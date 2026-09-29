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
            ['1002', null, '0.00', '75000.00'],
            ['2030', null, '0.00', '3000.00'],
            ['2040', null, '0.00', '2000.00'],
            ['5001', null, '70000.00', '0.00'],
            ['5006', $assignment->project_id, '10000.00', '0.00'],
        ], $lines);
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
