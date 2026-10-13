<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\Employee;
use App\Models\PayrollRun;
use App\Models\Payslip;
use App\Models\Project;
use App\Models\ProjectAssignment;
use App\Models\User;
use Database\Seeders\ChartOfAccountsSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PayrollScopeTest extends TestCase
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
        $this->bankAccount = AccountHead::where('code', '1002')->firstOrFail();
    }

    public function test_project_run_covers_only_project_and_assigned_employees(): void
    {
        $project = Project::factory()->create();
        $projectEmployee = Employee::factory()->projectBased($project)->withSalary()->create();
        $assignedEmployee = Employee::factory()->withSalary()->create();
        ProjectAssignment::factory()->create(['employee_id' => $assignedEmployee->id, 'project_id' => $project->id]);
        Employee::factory()->withSalary()->create();
        Employee::factory()->projectBased(Project::factory()->create())->withSalary()->create();

        $this->actingAs($this->user)->post(route('payroll.store'), [
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->bankAccount->id,
            'project_id' => $project->id,
        ])->assertSessionHasNoErrors();

        $run = PayrollRun::sole();
        $this->assertSame($project->id, $run->project_id);
        $this->assertEqualsCanonicalizing(
            [[$projectEmployee->id, $project->id], [$assignedEmployee->id, null]],
            $run->payslips()->get()->map(fn ($payslip) => [$payslip->employee_id, $payslip->project_id])->all(),
        );
    }

    public function test_run_for_selected_employees(): void
    {
        $selected = Employee::factory()->withSalary()->create();
        Employee::factory()->withSalary()->create();

        $this->actingAs($this->user)->post(route('payroll.store'), [
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->bankAccount->id,
            'employee_ids' => [$selected->id],
        ])->assertSessionHasNoErrors();

        $this->assertSame([$selected->id], PayrollRun::sole()->payslips()->pluck('employee_id')->all());
    }

    public function test_skips_employees_already_in_an_overlapping_run(): void
    {
        $alreadyPaid = Employee::factory()->withSalary()->create();
        $remaining = Employee::factory()->withSalary()->create();
        $existing = PayrollRun::factory()->approved()->create([
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->bankAccount->id,
        ]);
        Payslip::factory()->for($existing, 'payrollRun')->for($alreadyPaid)->create();

        $response = $this->actingAs($this->user)->post(route('payroll.store'), [
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->bankAccount->id,
        ]);

        $response->assertInertiaFlash(
            'toast.message',
            'Payroll run created with 1 payslips. 1 employee(s) skipped: already in another payroll run for this period.',
        );
        $run = PayrollRun::latest('id')->firstOrFail();
        $this->assertSame([$remaining->id], $run->payslips()->pluck('employee_id')->all());
    }

    public function test_rejects_inactive_selected_employee(): void
    {
        $inactive = Employee::factory()->inactive()->withSalary()->create();

        $this->actingAs($this->user)->post(route('payroll.store'), [
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $this->bankAccount->id,
            'employee_ids' => [$inactive->id],
        ])->assertSessionHasErrors('employee_ids.0');

        $this->assertSame(0, PayrollRun::count());
    }
}
