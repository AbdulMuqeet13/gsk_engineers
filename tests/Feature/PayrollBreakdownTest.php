<?php

namespace Tests\Feature;

use App\Enums\PayrollStatus;
use App\Enums\PayslipItemType;
use App\Enums\RoleEnum;
use App\Enums\SalaryChangeType;
use App\Models\AccountHead;
use App\Models\AssignmentAllowance;
use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\PayrollRun;
use App\Models\ProjectAssignment;
use App\Models\SalaryComponent;
use App\Models\User;
use Database\Seeders\ChartOfAccountsSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PayrollBreakdownTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private AccountHead $bankAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->seed(ChartOfAccountsSeeder::class);
        $this->withoutVite();

        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);
        $this->bankAccount = AccountHead::where('code', '1002')->first();
    }

    private function generatePayroll(string $periodStart = '2026-09-01', string $periodEnd = '2026-09-30'): PayrollRun
    {
        $this->actingAs($this->user)->post(route('payroll.store'), [
            'period_start' => $periodStart,
            'period_end' => $periodEnd,
            'payment_account_id' => $this->bankAccount->id,
        ]);

        return PayrollRun::latest('id')->firstOrFail();
    }

    public function test_payroll_uses_latest_salary_effective_by_period_end(): void
    {
        $employee = Employee::factory()->withSalary('50000.00', effectiveDate: '2026-01-01')->create();
        EmployeeSalary::factory()->for($employee)->create([
            'effective_date' => '2026-09-15',
            'change_type' => SalaryChangeType::Increment,
            'gross_salary' => '60000.00',
        ]);
        EmployeeSalary::factory()->for($employee)->create([
            'effective_date' => '2026-10-01',
            'change_type' => SalaryChangeType::Increment,
            'gross_salary' => '70000.00',
        ]);

        $payslip = $this->generatePayroll()->payslips()->sole();

        $this->assertSame('60000.00', $payslip->salary_amount);
    }

    public function test_payslip_adds_allowances_and_deducts_tax_and_security(): void
    {
        $employee = Employee::factory()->withSalary('70000.00', '3000.00', '2000.00')->create();
        $assignment = ProjectAssignment::factory()->for($employee)->create();
        AssignmentAllowance::factory()->for($assignment, 'assignment')->create(['name' => 'Site Allowance', 'amount' => '10000.00']);

        $payslip = $this->generatePayroll()->payslips()->sole();

        $this->assertSame('70000.00', $payslip->salary_amount);
        $this->assertSame('10000.00', $payslip->allowances_amount);
        $this->assertSame('80000.00', $payslip->gross_salary);
        $this->assertSame('3000.00', $payslip->tax_amount);
        $this->assertSame('2000.00', $payslip->security_amount);
        $this->assertSame('75000.00', $payslip->net_salary);

        $allowance = $payslip->items()->where('type', PayslipItemType::Allowance)->sole();
        $this->assertSame('Site Allowance', $allowance->name);
        $this->assertSame($assignment->project_id, $allowance->project_id);
        $this->assertSame(['Basic Salary'], $payslip->items()->where('type', PayslipItemType::Component)->pluck('name')->all());
    }

    public function test_payslip_items_do_not_change_when_allowances_change_later(): void
    {
        $employee = Employee::factory()->withSalary('70000.00')->create();
        $assignment = ProjectAssignment::factory()->for($employee)->create();
        $allowance = AssignmentAllowance::factory()->for($assignment, 'assignment')->create(['amount' => '10000.00']);
        $payslip = $this->generatePayroll()->payslips()->sole();

        $allowance->update(['amount' => '99999.00']);

        $this->assertSame('10000.00', $payslip->items()->where('type', PayslipItemType::Allowance)->sole()->amount);
    }

    public function test_employees_without_effective_salary_are_skipped(): void
    {
        Employee::factory()->withSalary('50000.00')->create();
        Employee::factory()->withSalary('50000.00', effectiveDate: '2027-01-01')->create();

        $response = $this->actingAs($this->user)->post(route('payroll.store'), [
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->bankAccount->id,
        ]);

        $response->assertInertiaFlash(
            'toast.message',
            'Payroll run created with 1 payslips. 1 active employee(s) skipped: no salary effective by the period end.',
        );
        $this->assertSame(1, PayrollRun::sole()->payslips()->count());
    }

    public function test_approval_journal_splits_salary_allowances_tax_and_security(): void
    {
        $employee = Employee::factory()->withSalary('70000.00', '3000.00', '2000.00')->create();
        $assignment = ProjectAssignment::factory()->for($employee)->create();
        AssignmentAllowance::factory()->for($assignment, 'assignment')->create(['amount' => '10000.00']);
        $run = $this->generatePayroll();
        $run->update(['status' => PayrollStatus::Submitted]);

        $this->actingAs($this->user)->post(route('payroll.approve', $run));

        $lines = $run->fresh()->journalEntry->lines()->with('accountHead')->get()
            ->map(fn ($line) => [$line->accountHead->code, $line->project_id, $line->debit, $line->credit])
            ->sortBy(0)->values()->all();
        $this->assertSame([
            ['2030', null, '0.00', '3000.00'],
            ['2040', null, '0.00', '2000.00'],
            ['2050', null, '0.00', '75000.00'],
            ['5001', null, '70000.00', '0.00'],
            ['5006', $assignment->project_id, '10000.00', '0.00'],
        ], $lines);
    }

    private function employeeWithDeductionComponent(string $basic, string $deduction): Employee
    {
        $employee = Employee::factory()->withSalary($basic)->create();
        $salary = $employee->salaries()->sole();
        $salary->update(['deductions_amount' => $deduction]);
        $salary->components()->create([
            'salary_component_id' => SalaryComponent::factory()->deduction()->create(['name' => 'Mess Charges'])->id,
            'amount' => $deduction,
        ]);

        return $employee;
    }

    public function test_deduction_components_are_snapshotted_and_reduce_net_salary(): void
    {
        $this->employeeWithDeductionComponent('50000.00', '1500.00');

        $payslip = $this->generatePayroll()->payslips()->sole();

        $this->assertSame('50000.00', $payslip->gross_salary);
        $this->assertSame('1500.00', $payslip->component_deductions);
        $this->assertSame('48500.00', $payslip->net_salary);
        $deduction = $payslip->items()->where('type', PayslipItemType::Deduction)->sole();
        $this->assertSame('Mess Charges', $deduction->name);
        $this->assertSame('1500.00', $deduction->amount);
    }

    public function test_editing_draft_payslip_keeps_deduction_components_in_net_salary(): void
    {
        $this->employeeWithDeductionComponent('50000.00', '1500.00');
        $run = $this->generatePayroll();
        $payslip = $run->payslips()->sole();

        $this->actingAs($this->user)->put(route('payroll.payslips.update', [$run, $payslip]), [
            'tax_amount' => '1000.00',
            'security_amount' => '0.00',
            'deductions' => '500.00',
        ])->assertSessionHasNoErrors();

        $this->assertSame('47000.00', $payslip->fresh()->net_salary);
        $this->assertSame('47000.00', $run->fresh()->total_amount);
    }

    public function test_editing_draft_payslip_rejects_deductions_above_gross_including_deduction_components(): void
    {
        $this->employeeWithDeductionComponent('50000.00', '1500.00');
        $run = $this->generatePayroll();
        $payslip = $run->payslips()->sole();

        $response = $this->actingAs($this->user)->put(route('payroll.payslips.update', [$run, $payslip]), [
            'tax_amount' => '0.00',
            'security_amount' => '0.00',
            'deductions' => '48500.01',
        ]);

        $response->assertSessionHasErrors(['deductions' => 'Total deductions cannot exceed the gross salary.']);
        $this->assertSame('48500.00', $payslip->fresh()->net_salary);
    }

    public function test_approval_journal_lowers_salary_expense_by_deduction_components(): void
    {
        $this->employeeWithDeductionComponent('50000.00', '1500.00');
        $run = $this->generatePayroll();
        $run->update(['status' => PayrollStatus::Submitted]);

        $this->actingAs($this->user)->post(route('payroll.approve', $run));

        $lines = $run->fresh()->journalEntry->lines()->with('accountHead')->get()
            ->map(fn ($line) => [$line->accountHead->code, $line->debit, $line->credit])
            ->sortBy(0)->values()->all();
        $this->assertSame([
            ['2050', '0.00', '48500.00'],
            ['5001', '48500.00', '0.00'],
        ], $lines);
    }

    public function test_soft_deleted_deduction_component_still_deducts_from_existing_salary(): void
    {
        $employee = $this->employeeWithDeductionComponent('50000.00', '1500.00');
        $employee->salaries()->sole()->components()->where('amount', '1500.00')->sole()
            ->salaryComponent->delete();

        $payslip = $this->generatePayroll()->payslips()->sole();

        $this->assertSame('1500.00', $payslip->component_deductions);
        $this->assertSame('48500.00', $payslip->net_salary);
        $this->assertSame(PayslipItemType::Deduction, $payslip->items()->where('name', 'Mess Charges')->sole()->type);
    }

    public function test_approval_journal_balances_with_allowances_tax_security_and_deduction_components(): void
    {
        $employee = $this->employeeWithDeductionComponent('70000.00', '2500.00');
        $employee->salaries()->sole()->update(['tax_amount' => '3000.00', 'security_amount' => '2000.00']);
        $assignment = ProjectAssignment::factory()->for($employee)->create();
        AssignmentAllowance::factory()->for($assignment, 'assignment')->create(['name' => 'Site Allowance', 'amount' => '10000.00']);

        $run = $this->generatePayroll();
        $payslip = $run->payslips()->sole();
        $this->assertSame('80000.00', $payslip->gross_salary);
        $this->assertSame('72500.00', $payslip->net_salary);

        $run->update(['status' => PayrollStatus::Submitted]);
        $this->actingAs($this->user)->post(route('payroll.approve', $run));

        $lines = $run->fresh()->journalEntry->lines()->with('accountHead')->get();
        $this->assertSame(0, bccomp($lines->sum('debit'), $lines->sum('credit'), 2));
        $this->assertSame([
            ['2030', '0.00', '3000.00'],
            ['2040', '0.00', '2000.00'],
            ['2050', '0.00', '72500.00'],
            ['5001', '67500.00', '0.00'],
            ['5006', '10000.00', '0.00'],
        ], $lines->map(fn ($line) => [$line->accountHead->code, $line->debit, $line->credit])->sortBy(0)->values()->all());
    }

    public function test_changing_deduction_component_amount_later_does_not_change_generated_payslip(): void
    {
        $employee = $this->employeeWithDeductionComponent('50000.00', '1500.00');
        $payslip = $this->generatePayroll()->payslips()->sole();

        $employee->salaries()->sole()->components()->where('amount', '1500.00')->update(['amount' => '9000.00']);

        $this->assertSame('1500.00', $payslip->fresh()->component_deductions);
        $this->assertSame('1500.00', $payslip->items()->where('type', PayslipItemType::Deduction)->sole()->amount);
    }

    public function test_security_balance_counts_only_approved_payroll(): void
    {
        $employee = Employee::factory()->withSalary('50000.00', securityAmount: '2000.00')->create();
        $run = $this->generatePayroll();
        $this->assertSame('0.00', $employee->securityBalance());

        $run->update(['status' => PayrollStatus::Approved]);

        $this->assertSame('2000.00', $employee->securityBalance());
    }
}
