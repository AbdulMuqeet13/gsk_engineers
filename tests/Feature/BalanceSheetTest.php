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

class BalanceSheetTest extends TestCase
{
    use RefreshDatabase;

    private AccountHead $cashAccount;

    private AccountHead $incomeAccount;

    private AccountHead $expenseAccount;

    private AccountHead $equityAccount;

    private AccountHead $retainedEarnings;

    private User $user;

    private JournalService $journalService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();

        $this->cashAccount = AccountHead::factory()->asset()->create(['code' => '1001', 'name' => 'Cash']);
        $this->equityAccount = AccountHead::factory()->create([
            'code' => '3001',
            'name' => 'Owner Equity',
            'type' => 'equity',
            'normal_balance' => 'credit',
        ]);
        $this->retainedEarnings = AccountHead::factory()->create([
            'code' => '3002',
            'name' => 'Retained Earnings',
            'type' => 'equity',
            'normal_balance' => 'credit',
        ]);
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
        $this->get(route('reports.balance-sheet'))
            ->assertRedirect(route('login'));
    }

    public function test_requires_financial_report_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('reports.balance-sheet'))
            ->assertForbidden();
    }

    public function test_displays_assets_liabilities_equity(): void
    {
        // Owner invests cash
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->equityAccount->id, '100000.00');

        $response = $this->actingAs($this->user)
            ->get(route('reports.balance-sheet'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('reports/balance-sheet')
            ->has('assetAccounts', 1)
            ->has('equityAccounts', 1)
        );
    }

    public function test_is_balanced_after_posted_entries(): void
    {
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->equityAccount->id, '100000.00');

        $response = $this->actingAs($this->user)
            ->get(route('reports.balance-sheet'));

        $response->assertInertia(fn ($page) => $page
            ->where('isBalanced', true)
            ->where('totalAssets', '100000.00')
        );
    }

    public function test_includes_net_profit_in_retained_earnings(): void
    {
        // Owner invests
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->equityAccount->id, '100000.00');
        // Earn income
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->incomeAccount->id, '50000.00');
        // Pay expense
        $this->postEntry('2026-09-01', $this->expenseAccount->id, $this->cashAccount->id, '20000.00');

        // Net profit = 50000 - 20000 = 30000
        // Assets = 100000 + 50000 - 20000 = 130000
        // Equity = 100000 (owner) + 30000 (retained/profit) = 130000

        $response = $this->actingAs($this->user)
            ->get(route('reports.balance-sheet'));

        $response->assertInertia(fn ($page) => $page
            ->where('isBalanced', true)
            ->where('totalAssets', '130000.00')
            ->where('netProfit', '30000.00')
        );
    }

    public function test_filters_by_as_at_date(): void
    {
        $this->postEntry('2026-01-15', $this->cashAccount->id, $this->equityAccount->id, '50000.00');
        $this->postEntry('2026-06-15', $this->cashAccount->id, $this->equityAccount->id, '30000.00');

        $response = $this->actingAs($this->user)
            ->get(route('reports.balance-sheet', ['as_at_date' => '2026-03-31']));

        $response->assertInertia(fn ($page) => $page
            ->where('totalAssets', '50000.00')
        );
    }

    public function test_filters_by_project(): void
    {
        $project = Project::factory()->active()->create();

        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->equityAccount->id, '50000.00', $project->id);
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->equityAccount->id, '30000.00');

        $response = $this->actingAs($this->user)
            ->get(route('reports.balance-sheet', ['project_id' => $project->id]));

        $response->assertInertia(fn ($page) => $page
            ->where('totalAssets', '50000.00')
        );
    }

    public function test_excludes_draft_entries(): void
    {
        $this->postEntry('2026-09-01', $this->cashAccount->id, $this->equityAccount->id, '10000.00');

        // Create but don't post
        $this->journalService->create([
            'date' => '2026-09-01',
            'description' => 'Draft',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '99999.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->equityAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '99999.00', 'memo' => null],
            ],
        ], $this->user);

        $response = $this->actingAs($this->user)
            ->get(route('reports.balance-sheet'));

        $response->assertInertia(fn ($page) => $page
            ->where('totalAssets', '10000.00')
        );
    }
}
