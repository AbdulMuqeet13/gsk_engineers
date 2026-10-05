<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\Employee;
use App\Models\PayrollRun;
use App\Models\Payslip;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PayrollTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private AccountHead $cashAccount;

    private AccountHead $salariesAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();

        $this->salariesAccount = AccountHead::factory()->expense()->create(['code' => '5001', 'name' => 'Salaries']);
        $this->cashAccount = AccountHead::factory()->asset()->create(['code' => '1001', 'name' => 'Cash']);
        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);
    }

    public function test_index_requires_authentication(): void
    {
        $this->get(route('payroll.index'))
            ->assertRedirect(route('login'));
    }

    public function test_index_requires_view_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('payroll.index'))
            ->assertForbidden();
    }

    public function test_index_displays_payroll_runs(): void
    {
        PayrollRun::factory()->count(3)->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)->get(route('payroll.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('payroll/index')
            ->has('payrollRuns.data', 3)
        );
    }

    public function test_index_filters_by_status(): void
    {
        PayrollRun::factory()->draft()->count(2)->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);
        PayrollRun::factory()->submitted()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('payroll.index', ['status' => 'draft']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('payrollRuns.data', 2)
        );
    }

    public function test_show_displays_payslips(): void
    {
        $run = PayrollRun::factory()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('payroll.show', $run));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('payroll/show')
            ->has('payrollRun')
        );
    }

    public function test_store_creates_draft_with_payslips(): void
    {
        Employee::factory()->count(3)->withSalary()->create(['is_active' => true]);

        $data = [
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->cashAccount->id,
            'description' => 'September payroll',
        ];

        $response = $this->actingAs($this->user)
            ->post(route('payroll.store'), $data);

        $run = PayrollRun::latest()->first();
        $response->assertRedirect(route('payroll.show', $run));

        $this->assertTrue($run->isDraft());
        $this->assertEquals(3, $run->payslips()->count());
    }

    public function test_store_requires_run_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $data = [
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->cashAccount->id,
        ];

        $this->actingAs($user)
            ->post(route('payroll.store'), $data)
            ->assertForbidden();
    }

    public function test_store_validates_required_fields(): void
    {
        $this->actingAs($this->user)
            ->post(route('payroll.store'), [])
            ->assertSessionHasErrors(['period_start', 'period_end', 'payment_account_id']);
    }

    public function test_store_validates_period_dates(): void
    {
        $data = [
            'period_start' => '2026-09-30',
            'period_end' => '2026-09-01',
            'payment_account_id' => $this->cashAccount->id,
        ];

        $this->actingAs($this->user)
            ->post(route('payroll.store'), $data)
            ->assertSessionHasErrors('period_end');
    }

    public function test_update_payslip_recalculates_net_from_tax_security_and_deductions(): void
    {
        $run = PayrollRun::factory()->draft()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $employee = Employee::factory()->create();
        $payslip = $run->payslips()->create([
            'employee_id' => $employee->id,
            'salary_amount' => '50000.00',
            'gross_salary' => '50000.00',
            'deductions' => '0.00',
            'net_salary' => '50000.00',
            'days_worked' => 26,
            'days_absent' => 0,
        ]);

        $this->actingAs($this->user)
            ->put(route('payroll.payslips.update', [$run, $payslip]), [
                'tax_amount' => '3000.00',
                'security_amount' => '1000.00',
                'deductions' => '5000.00',
                'notes' => 'Advance recovery',
            ])
            ->assertRedirect(route('payroll.show', $run));

        $payslip->refresh();
        $this->assertSame('3000.00', $payslip->tax_amount);
        $this->assertSame('1000.00', $payslip->security_amount);
        $this->assertSame('5000.00', $payslip->deductions);
        $this->assertSame('41000.00', $payslip->net_salary);
    }

    public function test_update_payslip_rejects_deductions_above_gross(): void
    {
        $run = PayrollRun::factory()->draft()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);
        $payslip = Payslip::factory()->for($run)->create([
            'salary_amount' => '50000.00',
            'gross_salary' => '50000.00',
            'net_salary' => '50000.00',
        ]);

        $response = $this->actingAs($this->user)
            ->put(route('payroll.payslips.update', [$run, $payslip]), [
                'tax_amount' => '30000.00',
                'security_amount' => '10000.00',
                'deductions' => '15000.00',
            ]);

        $response->assertSessionHasErrors(['deductions' => 'Total deductions cannot exceed the gross salary.']);
        $this->assertSame('50000.00', $payslip->fresh()->net_salary);
    }

    public function test_destroy_deletes_draft(): void
    {
        $run = PayrollRun::factory()->draft()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->actingAs($this->user)
            ->delete(route('payroll.destroy', $run))
            ->assertRedirect(route('payroll.index'));

        $this->assertDatabaseMissing('payroll_runs', ['id' => $run->id]);
    }

    public function test_destroy_rejects_non_draft(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Hr);

        $run = PayrollRun::factory()->submitted()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $user->id,
        ]);

        $this->actingAs($user)
            ->delete(route('payroll.destroy', $run))
            ->assertForbidden();
    }

    public function test_submit_transitions_to_submitted(): void
    {
        $run = PayrollRun::factory()->draft()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->actingAs($this->user)
            ->post(route('payroll.submit', $run))
            ->assertRedirect(route('payroll.show', $run));

        $run->refresh();
        $this->assertTrue($run->isSubmitted());
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
            'salary_amount' => '100000.00',
            'gross_salary' => '100000.00',
            'deductions' => '0.00',
            'net_salary' => '100000.00',
            'days_worked' => 26,
            'days_absent' => 0,
        ]);

        $this->actingAs($this->user)
            ->post(route('payroll.approve', $run))
            ->assertRedirect(route('payroll.show', $run));

        $run->refresh();
        $this->assertTrue($run->isApproved());
        $this->assertNotNull($run->journal_entry_id);
        $this->assertTrue($run->journalEntry->isPosted());
    }

    public function test_approve_requires_approve_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $run = PayrollRun::factory()->submitted()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->actingAs($user)
            ->post(route('payroll.approve', $run))
            ->assertForbidden();
    }

    public function test_reject_requires_reason(): void
    {
        $run = PayrollRun::factory()->submitted()->create([
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->actingAs($this->user)
            ->post(route('payroll.reject', $run), [])
            ->assertSessionHasErrors('reason');
    }

    public function test_store_rejects_period_overlapping_an_existing_run(): void
    {
        $existing = PayrollRun::factory()->approved()->create([
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)->post(route('payroll.store'), [
            'period_start' => '2026-09-15',
            'period_end' => '2026-10-14',
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $response->assertSessionHasErrors(['period_start' => "Payroll run {$existing->reference} already covers part of this period."]);
        $this->assertSame(1, PayrollRun::count());
    }

    public function test_store_allows_period_of_a_rejected_run(): void
    {
        PayrollRun::factory()->rejected()->create([
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->actingAs($this->user)->post(route('payroll.store'), [
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->cashAccount->id,
        ])->assertSessionHasNoErrors();

        $this->assertSame(2, PayrollRun::count());
    }

    public function test_index_filters_by_multiple_statuses(): void
    {
        $attributes = [
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ];
        PayrollRun::factory()->draft()->create($attributes);
        PayrollRun::factory()->submitted()->create($attributes);
        PayrollRun::factory()->rejected()->create($attributes);

        $response = $this->actingAs($this->user)
            ->get(route('payroll.index', ['status' => 'draft,submitted']));

        $response->assertInertia(fn ($page) => $page
            ->has('payrollRuns.data', 2)
        );
    }
}
