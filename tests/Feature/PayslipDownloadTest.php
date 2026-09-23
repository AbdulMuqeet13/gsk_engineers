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

class PayslipDownloadTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private PayrollRun $payrollRun;

    private Payslip $payslip;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();

        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);

        $paymentAccount = AccountHead::factory()->asset()->create();
        $employee = Employee::factory()->create();

        $this->payrollRun = PayrollRun::factory()->create([
            'payment_account_id' => $paymentAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->payslip = Payslip::factory()->create([
            'payroll_run_id' => $this->payrollRun->id,
            'employee_id' => $employee->id,
        ]);
    }

    public function test_download_requires_authentication(): void
    {
        $this->get(route('payroll.payslips.download', [
            'payroll_run' => $this->payrollRun,
            'payslip' => $this->payslip,
        ]))->assertRedirect(route('login'));
    }

    public function test_download_requires_view_permission(): void
    {
        $viewer = User::factory()->create();

        $this->actingAs($viewer)
            ->get(route('payroll.payslips.download', [
                'payroll_run' => $this->payrollRun,
                'payslip' => $this->payslip,
            ]))
            ->assertForbidden();
    }

    public function test_download_returns_pdf(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('payroll.payslips.download', [
                'payroll_run' => $this->payrollRun,
                'payslip' => $this->payslip,
            ]));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_download_rejects_mismatched_payslip(): void
    {
        $otherRun = PayrollRun::factory()->create([
            'payment_account_id' => AccountHead::factory()->asset()->create()->id,
            'created_by' => $this->user->id,
        ]);

        $this->actingAs($this->user)
            ->get(route('payroll.payslips.download', [
                'payroll_run' => $otherRun,
                'payslip' => $this->payslip,
            ]))
            ->assertNotFound();
    }
}
