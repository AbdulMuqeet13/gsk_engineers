<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\Project;
use App\Models\User;
use App\Services\JournalService;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IncomeExpenseSummaryTest extends TestCase
{
    use RefreshDatabase;

    private AccountHead $cashAccount;

    private AccountHead $incomeAccount;

    private AccountHead $expenseAccount;

    private User $user;

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
        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);
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
        ], $this->user);
        $this->journalService->post($entry);
    }

    public function test_requires_authentication(): void
    {
        $this->get(route('reports.income-expense-summary'))
            ->assertRedirect(route('login'));
    }

    public function test_requires_financial_report_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('reports.income-expense-summary'))
            ->assertForbidden();
    }

    public function test_displays_summary_by_category(): void
    {
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '50000.00');
        $this->postEntry('2026-09-01', $this->expenseAccount->id, $this->cashAccount->id, '30000.00');

        $response = $this->actingAs($this->user)
            ->get(route('reports.income-expense-summary'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('reports/income-expense-summary')
            ->where('groupBy', 'category')
            ->where('totalIncome', '50000.00')
            ->where('totalExpenses', '30000.00')
            ->where('netProfit', '20000.00')
        );
    }

    public function test_displays_summary_by_project(): void
    {
        $project = Project::factory()->active()->create();

        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '50000.00', $project->id);
        $this->postEntry('2026-09-01', $this->expenseAccount->id, $this->cashAccount->id, '20000.00', $project->id);

        $response = $this->actingAs($this->user)
            ->get(route('reports.income-expense-summary', ['group_by' => 'project']));

        $response->assertInertia(fn ($page) => $page
            ->where('groupBy', 'project')
            ->has('rows', 1)
            ->where('totalIncome', '50000.00')
            ->where('totalExpenses', '20000.00')
        );
    }

    public function test_filters_by_date_range(): void
    {
        $this->postEntry('2026-01-15', $this->cashAccount->id, $this->incomeAccount->id, '10000.00');
        $this->postEntry('2026-03-15', $this->cashAccount->id, $this->incomeAccount->id, '20000.00');

        $response = $this->actingAs($this->user)
            ->get(route('reports.income-expense-summary', [
                'date_from' => '2026-03-01',
                'date_to' => '2026-03-31',
            ]));

        $response->assertInertia(fn ($page) => $page
            ->where('totalIncome', '20000.00')
        );
    }

    public function test_filters_by_project(): void
    {
        $project = Project::factory()->active()->create();

        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '50000.00', $project->id);
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '30000.00');

        $response = $this->actingAs($this->user)
            ->get(route('reports.income-expense-summary', ['project_id' => $project->id]));

        $response->assertInertia(fn ($page) => $page
            ->where('totalIncome', '50000.00')
        );
    }

    public function test_excludes_draft_entries(): void
    {
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '10000.00');

        $this->journalService->create([
            'date' => '2026-09-01',
            'description' => 'Draft',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '99999.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '99999.00', 'memo' => null],
            ],
        ], $this->user);

        $response = $this->actingAs($this->user)
            ->get(route('reports.income-expense-summary'));

        $response->assertInertia(fn ($page) => $page
            ->where('totalIncome', '10000.00')
        );
    }
}
