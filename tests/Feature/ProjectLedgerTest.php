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

class ProjectLedgerTest extends TestCase
{
    use RefreshDatabase;

    private AccountHead $cashAccount;

    private AccountHead $expenseAccount;

    private AccountHead $incomeAccount;

    private Project $project;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();

        $this->cashAccount = AccountHead::factory()->asset()->create(['code' => '1001', 'name' => 'Cash']);
        $this->expenseAccount = AccountHead::factory()->expense()->create(['code' => '5001', 'name' => 'Rent']);
        $this->incomeAccount = AccountHead::factory()->create([
            'code' => '4001',
            'name' => 'Consulting Income',
            'type' => 'income',
            'normal_balance' => 'credit',
        ]);
        $this->project = Project::factory()->active()->create();
        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);
    }

    public function test_requires_authentication(): void
    {
        $this->get(route('reports.project-ledger'))
            ->assertRedirect(route('login'));
    }

    public function test_requires_reports_project_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('reports.project-ledger'))
            ->assertForbidden();
    }

    public function test_returns_empty_when_no_project_selected(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('reports.project-ledger'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('reports/project-ledger')
            ->where('rows', [])
            ->where('totalDebit', '0.00')
            ->where('totalCredit', '0.00')
        );
    }

    public function test_shows_all_account_types_for_project(): void
    {
        $service = app(JournalService::class);

        $entry = $service->create([
            'date' => '2026-01-15',
            'description' => 'Pay rent from cash',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => $this->project->id, 'debit' => '10000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '10000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-ledger', ['project_id' => $this->project->id]));

        $response->assertOk();
        // Both the expense line and the cash line should appear
        $response->assertInertia(fn ($page) => $page
            ->has('rows', 2)
            ->where('totalDebit', '10000.00')
            ->where('totalCredit', '10000.00')
        );
    }

    public function test_filters_by_account_head(): void
    {
        $service = app(JournalService::class);

        $entry = $service->create([
            'date' => '2026-01-15',
            'description' => 'Pay rent',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => $this->project->id, 'debit' => '10000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '10000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry);

        // Filter to only cash account
        $response = $this->actingAs($this->user)
            ->get(route('reports.project-ledger', [
                'project_id' => $this->project->id,
                'account_head_id' => $this->cashAccount->id,
            ]));

        $response->assertInertia(fn ($page) => $page
            ->has('rows', 1)
            ->where('rows.0.credit', '10000.00')
        );
    }

    public function test_running_balance_when_single_account_selected(): void
    {
        $service = app(JournalService::class);

        // Debit cash 30K
        $entry1 = $service->create([
            'date' => '2026-01-10',
            'description' => 'Receive funds',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '30000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '30000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        // Credit cash 8K
        $entry2 = $service->create([
            'date' => '2026-01-20',
            'description' => 'Pay expense',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => $this->project->id, 'debit' => '8000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '8000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry2);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-ledger', [
                'project_id' => $this->project->id,
                'account_head_id' => $this->cashAccount->id,
            ]));

        $response->assertInertia(fn ($page) => $page
            ->has('rows', 2)
            ->where('rows.0.balance', '30000.00')
            ->where('rows.1.balance', '22000.00')
        );
    }

    public function test_no_balance_when_all_accounts_shown(): void
    {
        $service = app(JournalService::class);

        $entry = $service->create([
            'date' => '2026-01-15',
            'description' => 'Pay rent',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => $this->project->id, 'debit' => '5000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '5000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry);

        // No account filter — balance should be null
        $response = $this->actingAs($this->user)
            ->get(route('reports.project-ledger', ['project_id' => $this->project->id]));

        $response->assertInertia(fn ($page) => $page
            ->has('rows', 2)
            ->where('rows.0.balance', null)
            ->where('rows.1.balance', null)
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
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => $this->project->id, 'debit' => '5000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '5000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        $entry2 = $service->create([
            'date' => '2026-03-15',
            'description' => 'March',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => $this->project->id, 'debit' => '3000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '3000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry2);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-ledger', [
                'project_id' => $this->project->id,
                'date_from' => '2026-02-01',
                'date_to' => '2026-04-01',
            ]));

        // Only March entry (2 lines)
        $response->assertInertia(fn ($page) => $page->has('rows', 2));
    }

    public function test_excludes_draft_entries(): void
    {
        $service = app(JournalService::class);

        $entry1 = $service->create([
            'date' => '2026-01-10',
            'description' => 'Posted',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => $this->project->id, 'debit' => '5000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '5000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        // Draft — not posted
        $service->create([
            'date' => '2026-01-15',
            'description' => 'Draft',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => $this->project->id, 'debit' => '3000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '3000.00', 'memo' => null],
            ],
        ], $this->user);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-ledger', ['project_id' => $this->project->id]));

        // Only the posted entry (2 lines)
        $response->assertInertia(fn ($page) => $page->has('rows', 2));
    }

    public function test_excludes_lines_without_matching_project(): void
    {
        $service = app(JournalService::class);

        // Entry with no project
        $entry = $service->create([
            'date' => '2026-01-15',
            'description' => 'No project',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => null, 'debit' => '5000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '5000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-ledger', ['project_id' => $this->project->id]));

        $response->assertInertia(fn ($page) => $page->has('rows', 0));
    }

    public function test_export_pdf(): void
    {
        $service = app(JournalService::class);

        $entry = $service->create([
            'date' => '2026-01-15',
            'description' => 'Test entry',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => $this->project->id, 'debit' => '10000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '10000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-ledger.export', [
                'project_id' => $this->project->id,
                'format' => 'pdf',
            ]));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_export_excel(): void
    {
        $service = app(JournalService::class);

        $entry = $service->create([
            'date' => '2026-01-15',
            'description' => 'Test entry',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => $this->project->id, 'debit' => '10000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '10000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-ledger.export', [
                'project_id' => $this->project->id,
                'format' => 'excel',
            ]));

        $response->assertOk();
        $response->assertDownload();
    }
}
