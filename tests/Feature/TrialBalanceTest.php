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

class TrialBalanceTest extends TestCase
{
    use RefreshDatabase;

    private AccountHead $cashAccount;

    private AccountHead $expenseAccount;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();

        $this->cashAccount = AccountHead::factory()->asset()->create(['code' => '1001', 'name' => 'Cash']);
        $this->expenseAccount = AccountHead::factory()->expense()->create(['code' => '5001', 'name' => 'Rent']);
        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);
    }

    public function test_requires_authentication(): void
    {
        $this->get(route('trial-balance.index'))
            ->assertRedirect(route('login'));
    }

    public function test_requires_view_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('trial-balance.index'))
            ->assertForbidden();
    }

    public function test_always_balances_with_posted_entries(): void
    {
        $service = app(JournalService::class);

        $entry = $service->create([
            'date' => '2026-01-15',
            'description' => 'Test entry',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '5000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '5000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry);

        $response = $this->actingAs($this->user)
            ->get(route('trial-balance.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('accounting/trial-balance/index')
            ->where('isBalanced', true)
            ->where('grandTotalDebit', '5000.00')
            ->where('grandTotalCredit', '5000.00')
        );
    }

    public function test_filters_by_date_range(): void
    {
        $service = app(JournalService::class);

        $entry1 = $service->create([
            'date' => '2026-01-10',
            'description' => 'January',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '1000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '1000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        $entry2 = $service->create([
            'date' => '2026-03-15',
            'description' => 'March',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '2000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '2000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry2);

        $response = $this->actingAs($this->user)
            ->get(route('trial-balance.index', [
                'date_from' => '2026-03-01',
                'date_to' => '2026-03-31',
            ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('grandTotalDebit', '2000.00')
            ->where('grandTotalCredit', '2000.00')
            ->where('isBalanced', true)
        );
    }

    public function test_filters_by_project(): void
    {
        $project = Project::factory()->active()->create();
        $service = app(JournalService::class);

        $entry1 = $service->create([
            'date' => '2026-01-10',
            'description' => 'Project expense',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => $project->id, 'debit' => '3000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $project->id, 'debit' => '0.00', 'credit' => '3000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        $entry2 = $service->create([
            'date' => '2026-01-11',
            'description' => 'Non-project expense',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '1000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '1000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry2);

        $response = $this->actingAs($this->user)
            ->get(route('trial-balance.index', ['project_id' => $project->id]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('grandTotalDebit', '3000.00')
            ->where('grandTotalCredit', '3000.00')
        );
    }

    public function test_excludes_draft_entries(): void
    {
        $service = app(JournalService::class);

        // Posted
        $entry1 = $service->create([
            'date' => '2026-01-10',
            'description' => 'Posted',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '1000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '1000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        // Draft (should not show)
        $service->create([
            'date' => '2026-01-11',
            'description' => 'Draft',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '9999.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '9999.00', 'memo' => null],
            ],
        ], $this->user);

        $response = $this->actingAs($this->user)
            ->get(route('trial-balance.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('grandTotalDebit', '1000.00')
            ->where('grandTotalCredit', '1000.00')
        );
    }

    public function test_shows_correct_totals_after_reversal(): void
    {
        $service = app(JournalService::class);

        $entry = $service->create([
            'date' => '2026-01-10',
            'description' => 'Original',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '5000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '5000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry);
        $service->reverse($entry, $this->user, 'Error');

        $response = $this->actingAs($this->user)
            ->get(route('trial-balance.index'));

        $response->assertOk();
        // After reversal, net effect should be zero — but both entries show
        // Grand totals should still balance
        $response->assertInertia(fn ($page) => $page
            ->where('isBalanced', true)
        );
    }
}
