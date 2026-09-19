<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\Employee;
use App\Models\PayrollRun;
use App\Models\Payslip;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PayrollReportTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();

        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);
    }

    public function test_requires_authentication(): void
    {
        $this->get(route('reports.payroll'))
            ->assertRedirect(route('login'));
    }

    public function test_requires_payroll_report_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('reports.payroll'))
            ->assertForbidden();
    }

    public function test_displays_approved_payroll_runs(): void
    {
        $run = PayrollRun::factory()->approved()->create(['total_amount' => '150000.00']);
        Payslip::factory()->create([
            'payroll_run_id' => $run->id,
            'basic_salary' => '80000.00',
            'deductions' => '5000.00',
            'net_salary' => '75000.00',
        ]);
        Payslip::factory()->create([
            'payroll_run_id' => $run->id,
            'basic_salary' => '80000.00',
            'deductions' => '5000.00',
            'net_salary' => '75000.00',
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('reports.payroll'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('reports/payroll-report')
            ->where('totalRuns', 1)
            ->where('totalEmployees', 2)
            ->where('totalDisbursed', '150000.00')
        );
    }

    public function test_includes_payslip_details(): void
    {
        $employee = Employee::factory()->create(['name' => 'John Doe']);
        $run = PayrollRun::factory()->approved()->create(['total_amount' => '75000.00']);
        Payslip::factory()->create([
            'payroll_run_id' => $run->id,
            'employee_id' => $employee->id,
            'basic_salary' => '80000.00',
            'deductions' => '5000.00',
            'net_salary' => '75000.00',
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('reports.payroll'));

        $response->assertInertia(fn ($page) => $page
            ->has('runs.0.payslips', 1)
            ->where('runs.0.payslips.0.employee_name', 'John Doe')
            ->where('runs.0.payslips.0.basic_salary', '80000.00')
            ->where('runs.0.payslips.0.net_salary', '75000.00')
        );
    }

    public function test_filters_by_date_range(): void
    {
        PayrollRun::factory()->approved()->create([
            'period_start' => '2026-01-01',
            'period_end' => '2026-01-31',
            'total_amount' => '50000.00',
        ]);
        PayrollRun::factory()->approved()->create([
            'period_start' => '2026-03-01',
            'period_end' => '2026-03-31',
            'total_amount' => '60000.00',
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('reports.payroll', [
                'date_from' => '2026-03-01',
                'date_to' => '2026-03-31',
            ]));

        $response->assertInertia(fn ($page) => $page
            ->where('totalRuns', 1)
            ->where('totalDisbursed', '60000.00')
        );
    }

    public function test_excludes_non_approved_runs(): void
    {
        PayrollRun::factory()->approved()->create(['total_amount' => '50000.00']);
        PayrollRun::factory()->draft()->create(['total_amount' => '99999.00']);
        PayrollRun::factory()->submitted()->create(['total_amount' => '88888.00']);

        $response = $this->actingAs($this->user)
            ->get(route('reports.payroll'));

        $response->assertInertia(fn ($page) => $page
            ->where('totalRuns', 1)
            ->where('totalDisbursed', '50000.00')
        );
    }
}
