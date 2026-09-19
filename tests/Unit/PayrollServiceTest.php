<?php

namespace Tests\Unit;

use App\Enums\JournalEntryType;
use App\Exceptions\Payroll\EmptyPayrollException;
use App\Exceptions\Payroll\PayrollNotDraftException;
use App\Exceptions\Payroll\PayrollNotSubmittedException;
use App\Models\AccountHead;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\PayrollRun;
use App\Models\User;
use App\Services\PayrollService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PayrollServiceTest extends TestCase
{
    use RefreshDatabase;

    private PayrollService $service;

    private User $user;

    private AccountHead $cashAccount;

    private AccountHead $salariesAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = app(PayrollService::class);
        $this->user = User::factory()->create();
        $this->salariesAccount = AccountHead::factory()->expense()->create(['code' => '5001', 'name' => 'Salaries']);
        $this->cashAccount = AccountHead::factory()->asset()->create(['code' => '1001', 'name' => 'Cash']);
    }

    public function test_create_generates_payslips_from_active_employees(): void
    {
        Employee::factory()->count(3)->create(['is_active' => true, 'salary' => '50000.00']);
        Employee::factory()->create(['is_active' => false, 'salary' => '30000.00']);

        $run = $this->service->create([
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->cashAccount->id,
            'description' => null,
        ], $this->user);

        $this->assertEquals(3, $run->payslips->count());
        $this->assertTrue($run->isDraft());
    }

    public function test_create_generates_unique_reference(): void
    {
        Employee::factory()->create(['is_active' => true]);

        $run1 = $this->service->create([
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->cashAccount->id,
            'description' => null,
        ], $this->user);

        $run2 = $this->service->create([
            'period_start' => '2026-10-01',
            'period_end' => '2026-10-31',
            'payment_account_id' => $this->cashAccount->id,
            'description' => null,
        ], $this->user);

        $this->assertNotEquals($run1->reference, $run2->reference);
        $this->assertMatchesRegularExpression('/^PR-\d{4}-\d{6}$/', $run1->reference);
    }

    public function test_create_calculates_days_from_attendance(): void
    {
        $employee = Employee::factory()->create(['is_active' => true, 'salary' => '50000.00']);

        Attendance::factory()->present()->create([
            'employee_id' => $employee->id,
            'date' => '2026-09-01',
            'marked_by' => $this->user->id,
        ]);
        Attendance::factory()->present()->create([
            'employee_id' => $employee->id,
            'date' => '2026-09-02',
            'marked_by' => $this->user->id,
        ]);
        Attendance::factory()->absent()->create([
            'employee_id' => $employee->id,
            'date' => '2026-09-03',
            'marked_by' => $this->user->id,
        ]);

        $run = $this->service->create([
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->cashAccount->id,
            'description' => null,
        ], $this->user);

        $payslip = $run->payslips->firstWhere('employee_id', $employee->id);
        $this->assertEquals(2, $payslip->days_worked);
        $this->assertEquals(1, $payslip->days_absent);
    }

    public function test_create_calculates_net_salary(): void
    {
        $employee = Employee::factory()->create(['is_active' => true, 'salary' => '75000.00']);

        $run = $this->service->create([
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->cashAccount->id,
            'description' => null,
        ], $this->user);

        $payslip = $run->payslips->firstWhere('employee_id', $employee->id);
        $this->assertEquals(0, bccomp($payslip->getRawOriginal('basic_salary'), '75000.00', 2));
        $this->assertEquals(0, bccomp($payslip->getRawOriginal('net_salary'), '75000.00', 2));
    }

    public function test_update_payslip_recalculates_total(): void
    {
        $employee1 = Employee::factory()->create(['is_active' => true, 'salary' => '50000.00']);
        $employee2 = Employee::factory()->create(['is_active' => true, 'salary' => '30000.00']);

        $run = $this->service->create([
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->cashAccount->id,
            'description' => null,
        ], $this->user);

        $payslip1 = $run->payslips->firstWhere('employee_id', $employee1->id);
        $this->service->updatePayslip($payslip1, [
            'deductions' => '5000.00',
            'notes' => null,
        ]);

        $run->refresh();
        // 45000 + 30000 = 75000
        $this->assertEquals(0, bccomp($run->getRawOriginal('total_amount'), '75000.00', 2));
    }

    public function test_update_payslip_throws_for_non_draft(): void
    {
        $run = PayrollRun::factory()->submitted()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $employee = Employee::factory()->create();
        $payslip = $run->payslips()->create([
            'employee_id' => $employee->id,
            'basic_salary' => '50000.00',
            'deductions' => '0.00',
            'net_salary' => '50000.00',
            'days_worked' => 26,
            'days_absent' => 0,
        ]);

        $this->expectException(PayrollNotDraftException::class);
        $this->service->updatePayslip($payslip, [
            'deductions' => '5000.00',
            'notes' => null,
        ]);
    }

    public function test_submit_transitions_to_submitted(): void
    {
        $run = PayrollRun::factory()->draft()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->service->submit($run);

        $run->refresh();
        $this->assertTrue($run->isSubmitted());
    }

    public function test_submit_throws_for_non_draft(): void
    {
        $run = PayrollRun::factory()->submitted()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->expectException(PayrollNotDraftException::class);
        $this->service->submit($run);
    }

    public function test_approve_creates_posted_journal_entry(): void
    {
        $run = PayrollRun::factory()->submitted()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
            'total_amount' => '100000.00',
        ]);

        $employee = Employee::factory()->create();
        $run->payslips()->create([
            'employee_id' => $employee->id,
            'basic_salary' => '100000.00',
            'deductions' => '0.00',
            'net_salary' => '100000.00',
            'days_worked' => 26,
            'days_absent' => 0,
        ]);

        $approver = User::factory()->create();
        $this->service->approve($run, $approver);

        $run->refresh();
        $this->assertTrue($run->isApproved());
        $this->assertNotNull($run->journal_entry_id);
        $this->assertTrue($run->journalEntry->isPosted());
        $this->assertEquals(JournalEntryType::Payroll, $run->journalEntry->type);
    }

    public function test_approve_journal_has_correct_amounts(): void
    {
        $run = PayrollRun::factory()->submitted()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
            'total_amount' => '80000.00',
        ]);

        $employee = Employee::factory()->create();
        $run->payslips()->create([
            'employee_id' => $employee->id,
            'basic_salary' => '80000.00',
            'deductions' => '0.00',
            'net_salary' => '80000.00',
            'days_worked' => 26,
            'days_absent' => 0,
        ]);

        $approver = User::factory()->create();
        $this->service->approve($run, $approver);

        $run->refresh();
        $journalEntry = $run->journalEntry;
        $journalEntry->load('lines');

        $debitLine = $journalEntry->lines->firstWhere('account_head_id', $this->salariesAccount->id);
        $creditLine = $journalEntry->lines->firstWhere('account_head_id', $this->cashAccount->id);

        $this->assertEquals(0, bccomp($debitLine->getRawOriginal('debit'), '80000.00', 2));
        $this->assertEquals(0, bccomp($creditLine->getRawOriginal('credit'), '80000.00', 2));
    }

    public function test_approve_throws_for_non_submitted(): void
    {
        $run = PayrollRun::factory()->draft()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->expectException(PayrollNotSubmittedException::class);
        $this->service->approve($run, User::factory()->create());
    }

    public function test_approve_throws_for_empty_payroll(): void
    {
        $run = PayrollRun::factory()->submitted()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->expectException(EmptyPayrollException::class);
        $this->service->approve($run, User::factory()->create());
    }

    public function test_reject_with_reason(): void
    {
        $run = PayrollRun::factory()->submitted()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $rejector = User::factory()->create();
        $this->service->reject($run, $rejector, 'Incorrect amounts');

        $run->refresh();
        $this->assertTrue($run->isRejected());
        $this->assertEquals('Incorrect amounts', $run->rejection_reason);
        $this->assertEquals($rejector->id, $run->approved_by);
    }

    public function test_reject_throws_for_non_submitted(): void
    {
        $run = PayrollRun::factory()->draft()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->expectException(PayrollNotSubmittedException::class);
        $this->service->reject($run, User::factory()->create(), 'reason');
    }

    public function test_delete_removes_draft(): void
    {
        $run = PayrollRun::factory()->draft()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->service->delete($run);

        $this->assertDatabaseMissing('payroll_runs', ['id' => $run->id]);
    }

    public function test_delete_throws_for_non_draft(): void
    {
        $run = PayrollRun::factory()->submitted()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->expectException(PayrollNotDraftException::class);
        $this->service->delete($run);
    }
}
