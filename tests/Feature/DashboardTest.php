<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\User;
use App\Services\JournalService;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
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

    private function postEntry(string $date, int $debitAccountId, int $creditAccountId, string $amount): void
    {
        $entry = $this->journalService->create([
            'date' => $date,
            'description' => 'Test entry',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $debitAccountId, 'project_id' => null, 'debit' => $amount, 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $creditAccountId, 'project_id' => null, 'debit' => '0.00', 'credit' => $amount, 'memo' => null],
            ],
        ], $this->user);
        $this->journalService->post($entry);
    }

    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $this->get(route('dashboard'))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard(): void
    {
        $this->actingAs($this->user)
            ->get(route('dashboard'))
            ->assertOk();
    }

    public function test_returns_kpi_data_with_correct_structure(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('kpis')
            ->has('monthlyTrend')
            ->has('expenseByCategory')
            ->has('projectBreakdown')
        );
    }

    public function test_income_kpi_reflects_posted_entries(): void
    {
        $today = now()->format('Y-m-d');
        $this->postEntry($today, $this->cashAccount->id, $this->incomeAccount->id, '50000.00');

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->where('kpis.totalIncome', '50000.00')
        );
    }

    public function test_expense_kpi_reflects_posted_entries(): void
    {
        $today = now()->format('Y-m-d');
        $this->postEntry($today, $this->expenseAccount->id, $this->cashAccount->id, '30000.00');

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->where('kpis.totalExpenses', '30000.00')
        );
    }

    public function test_cash_balance_computed_correctly(): void
    {
        $today = now()->format('Y-m-d');
        // Income adds to cash
        $this->postEntry($today, $this->cashAccount->id, $this->incomeAccount->id, '100000.00');
        // Expense removes from cash
        $this->postEntry($today, $this->expenseAccount->id, $this->cashAccount->id, '30000.00');

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->where('kpis.cashBalance', '70000.00')
        );
    }

    public function test_monthly_trend_returns_six_months(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->has('monthlyTrend', 6)
        );
    }

    public function test_excludes_draft_entries_from_kpis(): void
    {
        $today = now()->format('Y-m-d');
        $this->postEntry($today, $this->cashAccount->id, $this->incomeAccount->id, '10000.00');

        // Create but don't post
        $this->journalService->create([
            'date' => $today,
            'description' => 'Draft',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '99999.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '99999.00', 'memo' => null],
            ],
        ], $this->user);

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->where('kpis.totalIncome', '10000.00')
        );
    }
}
