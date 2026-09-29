<?php

namespace Tests\Feature;

use App\Enums\PayrollStatus;
use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\Employee;
use App\Models\PayrollRun;
use App\Models\Payslip;
use App\Models\SecurityRefund;
use App\Models\User;
use Database\Seeders\ChartOfAccountsSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityRefundTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private AccountHead $bankAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->seed(ChartOfAccountsSeeder::class);

        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);
        $this->bankAccount = AccountHead::where('code', '1002')->first();
    }

    private function employeeWithSecurityHeld(string $amount): Employee
    {
        $employee = Employee::factory()->create();
        $run = PayrollRun::factory()->create(['status' => PayrollStatus::Approved]);
        Payslip::factory()->for($run)->for($employee)->create(['security_amount' => $amount]);

        return $employee;
    }

    public function test_refund_posts_journal_entry_and_reduces_balance(): void
    {
        $employee = $this->employeeWithSecurityHeld('6000.00');

        $response = $this->actingAs($this->user)->post(route('employees.security-refunds.store', $employee), [
            'amount' => '4000.00',
            'date' => '2026-09-28',
            'payment_account_id' => $this->bankAccount->id,
            'remarks' => 'Final settlement',
        ]);

        $response->assertRedirect(route('employees.show', $employee));
        $refund = SecurityRefund::sole();
        $lines = $refund->journalEntry->lines()->with('accountHead')->get()
            ->map(fn ($line) => [$line->accountHead->code, $line->debit, $line->credit])
            ->sortBy(0)->values()->all();
        $this->assertSame([['1002', '0.00', '4000.00'], ['2040', '4000.00', '0.00']], $lines);
        $this->assertSame('2000.00', $employee->securityBalance());
    }

    public function test_refund_above_balance_is_rejected(): void
    {
        $employee = $this->employeeWithSecurityHeld('3000.00');

        $response = $this->actingAs($this->user)->post(route('employees.security-refunds.store', $employee), [
            'amount' => '3000.01',
            'date' => '2026-09-28',
            'payment_account_id' => $this->bankAccount->id,
        ]);

        $response->assertInertiaFlash('toast', ['type' => 'error', 'message' => "Refund exceeds the employee's security balance of 3,000.00."]);
        $this->assertDatabaseEmpty('security_refunds');
        $this->assertDatabaseEmpty('journal_entries');
    }

    public function test_refund_requires_payroll_approve_permission(): void
    {
        $accountant = User::factory()->create();
        $accountant->assignRole(RoleEnum::Accountant);
        $employee = $this->employeeWithSecurityHeld('3000.00');

        $this->actingAs($accountant)->post(route('employees.security-refunds.store', $employee), [
            'amount' => '1000.00',
            'date' => '2026-09-28',
            'payment_account_id' => $this->bankAccount->id,
        ])->assertForbidden();
    }
}
