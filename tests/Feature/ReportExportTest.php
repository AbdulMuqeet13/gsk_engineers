<?php

namespace Tests\Feature;

use App\Enums\PayrollStatus;
use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\Employee;
use App\Models\PayrollRun;
use App\Models\Payslip;
use App\Models\Project;
use App\Models\User;
use App\Services\JournalService;
use App\Services\TransferService;
use Database\Seeders\ChartOfAccountsSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportExportTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;

    private User $viewer;

    private AccountHead $cashAccount;

    private AccountHead $incomeAccount;

    private AccountHead $expenseAccount;

    private JournalService $journalService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();

        $this->cashAccount = AccountHead::factory()->asset()->create(['code' => '1001', 'name' => 'Cash']);
        $this->incomeAccount = AccountHead::factory()->create([
            'code' => '4001',
            'name' => 'Project Income',
            'type' => 'income',
            'normal_balance' => 'credit',
        ]);
        $this->expenseAccount = AccountHead::factory()->expense()->create(['code' => '5001', 'name' => 'Salaries']);

        $this->superAdmin = User::factory()->create();
        $this->superAdmin->assignRole(RoleEnum::SuperAdmin);

        $this->viewer = User::factory()->create();
        $this->viewer->assignRole(RoleEnum::Viewer);

        $this->journalService = app(JournalService::class);
    }

    private function postEntry(string $date, int $debitAccountId, int $creditAccountId, string $amount, ?int $projectId = null): void
    {
        $entry = $this->journalService->create([
            'date' => $date,
            'description' => 'Test entry',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $debitAccountId, 'project_id' => $projectId, 'debit' => $amount, 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $creditAccountId, 'project_id' => $projectId, 'debit' => '0.00', 'credit' => $amount, 'memo' => null],
            ],
        ], $this->superAdmin);
        $this->journalService->post($entry);
    }

    public function test_profit_and_loss_pdf_export(): void
    {
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '50000.00');

        $response = $this->actingAs($this->superAdmin)
            ->get(route('reports.profit-and-loss.export', ['format' => 'pdf']));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_profit_and_loss_excel_export(): void
    {
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '50000.00');

        $response = $this->actingAs($this->superAdmin)
            ->get(route('reports.profit-and-loss.export', ['format' => 'excel']));

        $response->assertOk();
        $this->assertStringContainsString('spreadsheet', $response->headers->get('content-type'));
    }

    public function test_profit_and_loss_export_requires_permission(): void
    {
        $this->actingAs($this->viewer)
            ->get(route('reports.profit-and-loss.export', ['format' => 'pdf']))
            ->assertForbidden();
    }

    public function test_balance_sheet_pdf_export(): void
    {
        AccountHead::factory()->create(['code' => '3002', 'name' => 'Retained Earnings', 'type' => 'equity', 'normal_balance' => 'credit']);
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '50000.00');

        $response = $this->actingAs($this->superAdmin)
            ->get(route('reports.balance-sheet.export', ['format' => 'pdf']));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_balance_sheet_excel_export(): void
    {
        AccountHead::factory()->create(['code' => '3002', 'name' => 'Retained Earnings', 'type' => 'equity', 'normal_balance' => 'credit']);
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '50000.00');

        $response = $this->actingAs($this->superAdmin)
            ->get(route('reports.balance-sheet.export', ['format' => 'excel']));

        $response->assertOk();
        $this->assertStringContainsString('spreadsheet', $response->headers->get('content-type'));
    }

    public function test_trial_balance_pdf_export(): void
    {
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '50000.00');

        $response = $this->actingAs($this->superAdmin)
            ->get(route('trial-balance.export', ['format' => 'pdf']));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_trial_balance_excel_export(): void
    {
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '50000.00');

        $response = $this->actingAs($this->superAdmin)
            ->get(route('trial-balance.export', ['format' => 'excel']));

        $response->assertOk();
        $this->assertStringContainsString('spreadsheet', $response->headers->get('content-type'));
    }

    public function test_inter_project_position_pdf_export(): void
    {
        $this->seed(ChartOfAccountsSeeder::class);
        $projectA = Project::factory()->active()->create();
        $projectB = Project::factory()->active()->create();
        $transferService = app(TransferService::class);
        $transferService->execute([
            'from_project_id' => $projectA->id,
            'to_project_id' => $projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'amount' => '10000.00',
            'date' => '2026-09-15',
            'purpose' => 'Test transfer',
        ], $this->superAdmin);

        $response = $this->actingAs($this->superAdmin)
            ->get(route('reports.inter-project-position.export', ['format' => 'pdf']));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_inter_project_position_excel_export(): void
    {
        $this->seed(ChartOfAccountsSeeder::class);
        $projectA = Project::factory()->active()->create();
        $projectB = Project::factory()->active()->create();
        $transferService = app(TransferService::class);
        $transferService->execute([
            'from_project_id' => $projectA->id,
            'to_project_id' => $projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'amount' => '10000.00',
            'date' => '2026-09-15',
            'purpose' => 'Test transfer',
        ], $this->superAdmin);

        $response = $this->actingAs($this->superAdmin)
            ->get(route('reports.inter-project-position.export', ['format' => 'excel']));

        $response->assertOk();
        $this->assertStringContainsString('spreadsheet', $response->headers->get('content-type'));
    }

    public function test_income_expense_summary_pdf_export(): void
    {
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '50000.00');

        $response = $this->actingAs($this->superAdmin)
            ->get(route('reports.income-expense-summary.export', ['format' => 'pdf']));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_income_expense_summary_excel_export(): void
    {
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '50000.00');

        $response = $this->actingAs($this->superAdmin)
            ->get(route('reports.income-expense-summary.export', ['format' => 'excel']));

        $response->assertOk();
        $this->assertStringContainsString('spreadsheet', $response->headers->get('content-type'));
    }

    public function test_income_expense_summary_export_passes_filters(): void
    {
        $project = Project::factory()->active()->create();
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '50000.00', $project->id);
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '30000.00');

        $response = $this->actingAs($this->superAdmin)
            ->get(route('reports.income-expense-summary.export', [
                'format' => 'pdf',
                'project_id' => $project->id,
                'group_by' => 'project',
            ]));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_payroll_report_pdf_export(): void
    {
        $employee = Employee::factory()->create(['is_active' => true]);
        $run = PayrollRun::factory()->create([
            'status' => PayrollStatus::Approved,
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
        ]);
        Payslip::factory()->create(['payroll_run_id' => $run->id, 'employee_id' => $employee->id]);

        $response = $this->actingAs($this->superAdmin)
            ->get(route('reports.payroll.export', ['format' => 'pdf']));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_payroll_report_excel_export(): void
    {
        $employee = Employee::factory()->create(['is_active' => true]);
        $run = PayrollRun::factory()->create([
            'status' => PayrollStatus::Approved,
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
        ]);
        Payslip::factory()->create(['payroll_run_id' => $run->id, 'employee_id' => $employee->id]);

        $response = $this->actingAs($this->superAdmin)
            ->get(route('reports.payroll.export', ['format' => 'excel']));

        $response->assertOk();
        $this->assertStringContainsString('spreadsheet', $response->headers->get('content-type'));
    }

    public function test_payroll_report_export_requires_permission(): void
    {
        $this->actingAs($this->viewer)
            ->get(route('reports.payroll.export', ['format' => 'pdf']))
            ->assertForbidden();
    }
}
