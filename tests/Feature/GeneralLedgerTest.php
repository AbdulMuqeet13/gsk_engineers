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

class GeneralLedgerTest extends TestCase
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
        $this->get(route('general-ledger.index'))
            ->assertRedirect(route('login'));
    }

    public function test_requires_view_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('general-ledger.index'))
            ->assertForbidden();
    }

    public function test_shows_posted_lines_for_account(): void
    {
        $service = app(JournalService::class);

        $entry = $service->create([
            'date' => '2026-01-15',
            'description' => 'Pay rent',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '5000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '5000.00', 'memo' => null],
            ],
        ], $this->user);

        $service->post($entry);

        $response = $this->actingAs($this->user)
            ->get(route('general-ledger.index', ['account_head_id' => $this->cashAccount->id]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('accounting/general-ledger/index')
            ->has('lines', 1)
        );
    }

    public function test_computes_correct_running_balance_for_debit_normal_account(): void
    {
        $service = app(JournalService::class);

        // Entry 1: debit cash 3000
        $entry1 = $service->create([
            'date' => '2026-01-10',
            'description' => 'Receive payment',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '3000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '3000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        // Entry 2: credit cash 1000
        $entry2 = $service->create([
            'date' => '2026-01-15',
            'description' => 'Pay expense',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '1000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '1000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry2);

        $response = $this->actingAs($this->user)
            ->get(route('general-ledger.index', ['account_head_id' => $this->cashAccount->id]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('lines', 2)
            ->where('lines.0.running_balance', '3000.00')
            ->where('lines.1.running_balance', '2000.00')
        );
    }

    public function test_computes_correct_running_balance_for_credit_normal_account(): void
    {
        $liabilityAccount = AccountHead::factory()->create([
            'code' => '2001',
            'name' => 'AP',
            'type' => 'liability',
            'normal_balance' => 'credit',
        ]);

        $service = app(JournalService::class);

        $entry = $service->create([
            'date' => '2026-01-10',
            'description' => 'Incur liability',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '2000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $liabilityAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '2000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry);

        $response = $this->actingAs($this->user)
            ->get(route('general-ledger.index', ['account_head_id' => $liabilityAccount->id]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('lines', 1)
            ->where('lines.0.running_balance', '2000.00')
        );
    }

    public function test_filters_by_date_range(): void
    {
        $service = app(JournalService::class);

        $entry1 = $service->create([
            'date' => '2026-01-10',
            'description' => 'January entry',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '1000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '1000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        $entry2 = $service->create([
            'date' => '2026-03-15',
            'description' => 'March entry',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '2000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '2000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry2);

        $response = $this->actingAs($this->user)
            ->get(route('general-ledger.index', [
                'account_head_id' => $this->cashAccount->id,
                'date_from' => '2026-02-01',
                'date_to' => '2026-04-01',
            ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('lines', 1));
    }

    public function test_filters_by_project(): void
    {
        $project = Project::factory()->active()->create();
        $service = app(JournalService::class);

        $entry1 = $service->create([
            'date' => '2026-01-10',
            'description' => 'Project entry',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $project->id, 'debit' => '1000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => $project->id, 'debit' => '0.00', 'credit' => '1000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        $entry2 = $service->create([
            'date' => '2026-01-11',
            'description' => 'No project entry',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '500.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '500.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry2);

        $response = $this->actingAs($this->user)
            ->get(route('general-ledger.index', [
                'account_head_id' => $this->cashAccount->id,
                'project_id' => $project->id,
            ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('lines', 1));
    }

    public function test_excludes_draft_entries(): void
    {
        $service = app(JournalService::class);

        // Posted entry
        $entry1 = $service->create([
            'date' => '2026-01-10',
            'description' => 'Posted',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '1000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '1000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        // Draft entry (should not appear)
        $service->create([
            'date' => '2026-01-11',
            'description' => 'Draft',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '500.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '500.00', 'memo' => null],
            ],
        ], $this->user);

        $response = $this->actingAs($this->user)
            ->get(route('general-ledger.index', ['account_head_id' => $this->cashAccount->id]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('lines', 1));
    }
}
