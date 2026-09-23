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

class ProjectCashbookTest extends TestCase
{
    use RefreshDatabase;

    private AccountHead $cashAccount;

    private AccountHead $bankAccount;

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
        $this->bankAccount = AccountHead::factory()->asset()->create(['code' => '1002', 'name' => 'Bank']);
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
        $this->get(route('reports.project-cashbook'))
            ->assertRedirect(route('login'));
    }

    public function test_requires_reports_project_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('reports.project-cashbook'))
            ->assertForbidden();
    }

    public function test_returns_empty_when_no_project_selected(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('reports.project-cashbook'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('reports/project-cashbook')
            ->where('rows', [])
            ->where('summary.openingBalance', '0.00')
        );
    }

    public function test_shows_cash_transactions_for_project(): void
    {
        $service = app(JournalService::class);

        // Income received into cash for this project
        $entry = $service->create([
            'date' => '2026-01-15',
            'description' => 'Client payment',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '50000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '50000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-cashbook', ['project_id' => $this->project->id]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('rows', 1)
            ->where('rows.0.money_in', '50000.00')
            ->where('rows.0.money_out', '0.00')
            ->where('summary.totalIn', '50000.00')
            ->where('summary.closingBalance', '50000.00')
        );
    }

    public function test_excludes_non_cash_accounts(): void
    {
        $service = app(JournalService::class);

        // Expense entry — the expense line is NOT a cash account
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

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-cashbook', ['project_id' => $this->project->id]));

        // Only the cash line should appear, not the expense line
        $response->assertInertia(fn ($page) => $page
            ->has('rows', 1)
            ->where('rows.0.money_out', '10000.00')
        );
    }

    public function test_excludes_other_projects(): void
    {
        $otherProject = Project::factory()->active()->create();
        $service = app(JournalService::class);

        // Entry for other project
        $entry1 = $service->create([
            'date' => '2026-01-10',
            'description' => 'Other project payment',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $otherProject->id, 'debit' => '20000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $otherProject->id, 'debit' => '0.00', 'credit' => '20000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        // Entry for this project
        $entry2 = $service->create([
            'date' => '2026-01-15',
            'description' => 'This project payment',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '30000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '30000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry2);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-cashbook', ['project_id' => $this->project->id]));

        $response->assertInertia(fn ($page) => $page
            ->has('rows', 1)
            ->where('rows.0.money_in', '30000.00')
        );
    }

    public function test_computes_correct_running_balance(): void
    {
        $service = app(JournalService::class);

        // Receive 50K
        $entry1 = $service->create([
            'date' => '2026-01-10',
            'description' => 'Receive funds',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '50000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '50000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        // Spend 15K
        $entry2 = $service->create([
            'date' => '2026-01-20',
            'description' => 'Pay rent',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->expenseAccount->id, 'project_id' => $this->project->id, 'debit' => '15000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '15000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry2);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-cashbook', ['project_id' => $this->project->id]));

        $response->assertInertia(fn ($page) => $page
            ->has('rows', 2)
            ->where('rows.0.balance', '50000.00')
            ->where('rows.1.balance', '35000.00')
            ->where('summary.totalIn', '50000.00')
            ->where('summary.totalOut', '15000.00')
            ->where('summary.closingBalance', '35000.00')
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
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '10000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '10000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        $entry2 = $service->create([
            'date' => '2026-03-15',
            'description' => 'March entry',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '20000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '20000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry2);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-cashbook', [
                'project_id' => $this->project->id,
                'date_from' => '2026-02-01',
                'date_to' => '2026-04-01',
            ]));

        $response->assertInertia(fn ($page) => $page
            ->has('rows', 1)
            ->where('rows.0.money_in', '20000.00')
        );
    }

    public function test_computes_opening_balance_with_date_filter(): void
    {
        $service = app(JournalService::class);

        // Entry before the date range
        $entry1 = $service->create([
            'date' => '2026-01-10',
            'description' => 'January entry',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '10000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '10000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        // Entry within the date range
        $entry2 = $service->create([
            'date' => '2026-03-15',
            'description' => 'March entry',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '5000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '5000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry2);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-cashbook', [
                'project_id' => $this->project->id,
                'date_from' => '2026-02-01',
            ]));

        $response->assertInertia(fn ($page) => $page
            ->has('rows', 1)
            ->where('summary.openingBalance', '10000.00')
            ->where('summary.closingBalance', '15000.00')
        );
    }

    public function test_filters_by_specific_cash_account(): void
    {
        $service = app(JournalService::class);

        // Cash entry
        $entry1 = $service->create([
            'date' => '2026-01-10',
            'description' => 'Cash receipt',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '10000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '10000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        // Bank entry
        $entry2 = $service->create([
            'date' => '2026-01-15',
            'description' => 'Bank deposit',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->bankAccount->id, 'project_id' => $this->project->id, 'debit' => '25000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '25000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry2);

        // Filter to only bank
        $response = $this->actingAs($this->user)
            ->get(route('reports.project-cashbook', [
                'project_id' => $this->project->id,
                'account_id' => $this->bankAccount->id,
            ]));

        $response->assertInertia(fn ($page) => $page
            ->has('rows', 1)
            ->where('rows.0.money_in', '25000.00')
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
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '10000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '10000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry1);

        // Draft (not posted)
        $service->create([
            'date' => '2026-01-15',
            'description' => 'Draft',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '5000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '5000.00', 'memo' => null],
            ],
        ], $this->user);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-cashbook', ['project_id' => $this->project->id]));

        $response->assertInertia(fn ($page) => $page->has('rows', 1));
    }

    public function test_export_pdf(): void
    {
        $service = app(JournalService::class);

        $entry = $service->create([
            'date' => '2026-01-15',
            'description' => 'Test entry',
            'type' => 'standard',
            'lines' => [
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '10000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '10000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-cashbook.export', [
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
                ['account_head_id' => $this->cashAccount->id, 'project_id' => $this->project->id, 'debit' => '10000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->incomeAccount->id, 'project_id' => $this->project->id, 'debit' => '0.00', 'credit' => '10000.00', 'memo' => null],
            ],
        ], $this->user);
        $service->post($entry);

        $response = $this->actingAs($this->user)
            ->get(route('reports.project-cashbook.export', [
                'project_id' => $this->project->id,
                'format' => 'excel',
            ]));

        $response->assertOk();
        $response->assertDownload();
    }
}
