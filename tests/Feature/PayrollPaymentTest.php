<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\Employee;
use App\Models\JournalEntry;
use App\Models\PayrollRun;
use App\Models\Payslip;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\ChartOfAccountsSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PayrollPaymentTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private AccountHead $bankAccount;

    private AccountHead $cashAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->seed(ChartOfAccountsSeeder::class);
        $this->withoutVite();
        $this->travelTo('2026-10-06 10:00:00');

        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);
        $this->bankAccount = AccountHead::where('code', '1002')->firstOrFail();
        $this->cashAccount = AccountHead::where('code', '1001')->firstOrFail();
    }

    public function test_approval_leaves_salaries_payable_until_paid(): void
    {
        Employee::factory()->withSalary('50000.00')->create(['name' => 'Ali Khan']);
        Employee::factory()->withSalary('30000.00')->create(['name' => 'Bilal Ahmed']);
        $this->actingAs($this->user)->post(route('payroll.store'), [
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->bankAccount->id,
        ]);
        $run = PayrollRun::sole();
        $this->post(route('payroll.submit', $run));

        $this->post(route('payroll.approve', $run));

        $this->assertSame(0, $run->payslips()->whereNotNull('paid_at')->count());
        $this->assertSame('80000.00', $this->balanceOf('2050'));
        $this->assertSame('0.00', $this->balanceOf('1002'));

        $this->post(route('payroll.pay', $run), [
            'payslip_ids' => $run->payslips()->pluck('id')->all(),
            'payment_account_id' => $this->bankAccount->id,
            'paid_at' => '2026-10-06',
        ]);

        $this->assertSame('0.00', $this->balanceOf('2050'));
        $this->assertSame('-80000.00', $this->balanceOf('1002'));
    }

    public function test_pays_a_single_employee_salary(): void
    {
        $run = PayrollRun::factory()->approved()->create(['payment_account_id' => $this->bankAccount->id, 'period_start' => '2026-09-01']);
        $employee = Employee::factory()->create(['name' => 'Ali Khan']);
        $payslip = Payslip::factory()->for($run, 'payrollRun')->for($employee)->create(['net_salary' => '45000.00']);
        $otherPayslip = Payslip::factory()->for($run, 'payrollRun')->create();

        $response = $this->actingAs($this->user)->post(route('payroll.pay', $run), [
            'payslip_ids' => [$payslip->id],
            'payment_account_id' => $this->cashAccount->id,
            'paid_at' => '2026-10-06',
        ]);

        $response->assertRedirect(route('payroll.show', $run));
        $response->assertInertiaFlash('toast.message', 'Salary of Ali Khan paid.');

        $payslip->refresh();
        $this->assertSame('06-10-2026', $payslip->paid_at->format('d-m-Y'));
        $this->assertSame($this->cashAccount->id, $payslip->payment_account_id);
        $this->assertSame($this->user->id, $payslip->paid_by);
        $this->assertNull($otherPayslip->fresh()->paid_at);

        $entry = JournalEntry::findOrFail($payslip->payment_journal_entry_id);
        $this->assertTrue($entry->isPosted());
        $this->assertSame("Salary payment: {$run->reference} — Ali Khan", $entry->description);
        $this->assertSame('2026-10-06', $entry->date->toDateString());
        $lines = $entry->lines()->with('accountHead')->get()
            ->map(fn ($line) => [$line->accountHead->code, $line->debit, $line->credit, $line->memo])
            ->sortBy(0)->values()->all();
        $this->assertSame([
            ['1001', '0.00', '45000.00', 'Salary of Ali Khan (Sep 2026)'],
            ['2050', '45000.00', '0.00', 'Salary of Ali Khan (Sep 2026)'],
        ], $lines);
    }

    public function test_payment_lines_carry_the_employee_and_payslip_project(): void
    {
        $project = Project::factory()->create();
        $run = PayrollRun::factory()->approved()->create(['payment_account_id' => $this->bankAccount->id]);
        $employee = Employee::factory()->projectBased($project)->create();
        $payslip = Payslip::factory()->for($run, 'payrollRun')->for($employee)->create(['project_id' => $project->id, 'net_salary' => '45000.00']);

        $this->actingAs($this->user)->post(route('payroll.pay', $run), [
            'payslip_ids' => [$payslip->id],
            'payment_account_id' => $this->bankAccount->id,
            'paid_at' => '2026-10-06',
        ]);

        $lines = JournalEntry::sole()->lines()->with('accountHead')->get()
            ->map(fn ($line) => [$line->accountHead->code, $line->project_id, $line->employee_id])
            ->sortBy(0)->values()->all();
        $this->assertSame([
            ['1002', $project->id, $employee->id],
            ['2050', null, $employee->id],
        ], $lines);
    }

    public function test_pays_several_employees_in_one_entry(): void
    {
        $run = PayrollRun::factory()->approved()->create(['payment_account_id' => $this->bankAccount->id]);
        $payslips = Payslip::factory()->for($run, 'payrollRun')->count(2)->sequence(
            ['net_salary' => '40000.00'],
            ['net_salary' => '25000.00'],
        )->create();

        $response = $this->actingAs($this->user)->post(route('payroll.pay', $run), [
            'payslip_ids' => $payslips->modelKeys(),
            'payment_account_id' => $this->bankAccount->id,
            'paid_at' => '2026-10-06',
        ]);

        $response->assertInertiaFlash('toast.message', 'Salaries of 2 employees paid.');
        $entry = JournalEntry::sole();
        $this->assertSame("Salary payment: {$run->reference} (2 employees)", $entry->description);
        $this->assertSame('65000.00', bcadd((string) $entry->lines()->whereHas('accountHead', fn ($q) => $q->where('code', '1002'))->sum('credit'), '0', 2));
        $this->assertSame(2, Payslip::whereNotNull('paid_at')->where('payment_journal_entry_id', $entry->id)->count());
    }

    public function test_rejects_paying_an_already_paid_salary(): void
    {
        $run = PayrollRun::factory()->approved()->create(['payment_account_id' => $this->bankAccount->id]);
        $employee = Employee::factory()->create(['name' => 'Ali Khan']);
        $paid = Payslip::factory()->for($run, 'payrollRun')->for($employee)->create(['paid_at' => '2026-10-01']);
        $unpaid = Payslip::factory()->for($run, 'payrollRun')->create();

        $response = $this->actingAs($this->user)->post(route('payroll.pay', $run), [
            'payslip_ids' => [$paid->id, $unpaid->id],
            'payment_account_id' => $this->bankAccount->id,
            'paid_at' => '2026-10-06',
        ]);

        $response->assertInertiaFlash('toast.message', 'The salary of Ali Khan has already been paid.');
        $this->assertSame(0, JournalEntry::count());
        $this->assertNull($unpaid->fresh()->paid_at);
    }

    public function test_cannot_pay_a_run_that_is_not_approved(): void
    {
        $run = PayrollRun::factory()->submitted()->create(['payment_account_id' => $this->bankAccount->id]);
        $payslip = Payslip::factory()->for($run, 'payrollRun')->create();

        $response = $this->actingAs($this->user)->post(route('payroll.pay', $run), [
            'payslip_ids' => [$payslip->id],
            'payment_account_id' => $this->bankAccount->id,
            'paid_at' => '2026-10-06',
        ]);

        $response->assertInertiaFlash('toast.message', 'Payroll run must be approved before salaries are paid, currently: submitted');
        $this->assertNull($payslip->fresh()->paid_at);
        $this->assertSame(0, JournalEntry::count());
    }

    public function test_paying_requires_approve_permission(): void
    {
        $viewer = User::factory()->create();
        $viewer->assignRole(RoleEnum::Viewer);
        $run = PayrollRun::factory()->approved()->create(['payment_account_id' => $this->bankAccount->id]);
        $payslip = Payslip::factory()->for($run, 'payrollRun')->create();

        $this->actingAs($viewer)->post(route('payroll.pay', $run), [
            'payslip_ids' => [$payslip->id],
            'payment_account_id' => $this->bankAccount->id,
            'paid_at' => '2026-10-06',
        ])->assertForbidden();

        $this->assertNull($payslip->fresh()->paid_at);
    }

    public function test_validates_required_payment_fields(): void
    {
        $run = PayrollRun::factory()->approved()->create(['payment_account_id' => $this->bankAccount->id]);

        $this->actingAs($this->user)->post(route('payroll.pay', $run), [])
            ->assertSessionHasErrors(['payslip_ids', 'payment_account_id', 'paid_at']);
    }

    public function test_rejects_a_payslip_of_another_run(): void
    {
        $run = PayrollRun::factory()->approved()->create(['payment_account_id' => $this->bankAccount->id]);
        $otherPayslip = Payslip::factory()->for(PayrollRun::factory()->approved()->state(['payment_account_id' => $this->bankAccount->id]), 'payrollRun')->create();

        $this->actingAs($this->user)->post(route('payroll.pay', $run), [
            'payslip_ids' => [$otherPayslip->id],
            'payment_account_id' => $this->bankAccount->id,
            'paid_at' => '2026-10-06',
        ])->assertSessionHasErrors(['payslip_ids.0' => 'The selected payslip does not belong to this payroll run.']);

        $this->assertNull($otherPayslip->fresh()->paid_at);
    }

    public function test_rejects_a_payment_date_before_approval(): void
    {
        $run = PayrollRun::factory()->approved()->create([
            'payment_account_id' => $this->bankAccount->id,
            'approved_at' => '2026-10-05 09:00:00',
        ]);
        $payslip = Payslip::factory()->for($run, 'payrollRun')->create();

        $this->actingAs($this->user)->post(route('payroll.pay', $run), [
            'payslip_ids' => [$payslip->id],
            'payment_account_id' => $this->bankAccount->id,
            'paid_at' => '2026-10-04',
        ])->assertSessionHasErrors(['paid_at' => 'The payment date cannot be before the payroll approval date.']);
    }

    private function balanceOf(string $code): string
    {
        $account = AccountHead::where('code', $code)->firstOrFail();
        $debits = (string) $account->journalLines()->sum('debit');
        $credits = (string) $account->journalLines()->sum('credit');

        return $account->normal_balance->value === 'debit'
            ? bcsub($debits, $credits, 2)
            : bcsub($credits, $debits, 2);
    }
}
