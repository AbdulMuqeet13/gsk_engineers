<?php

namespace Tests\Feature;

use App\Enums\JournalEntryStatus;
use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\JournalEntry;
use App\Models\Project;
use App\Models\ProjectIncome;
use App\Models\User;
use Database\Seeders\ChartOfAccountsSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectIncomeTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private AccountHead $bankAccount;

    private AccountHead $incomeAccount;

    private Project $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->seed(ChartOfAccountsSeeder::class);
        $this->withoutVite();

        $this->bankAccount = AccountHead::where('code', '1002')->first();
        $this->incomeAccount = AccountHead::where('code', '4001')->first();
        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);
        $this->project = Project::factory()->create();
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'project_id' => $this->project->id,
            'income_account_id' => $this->incomeAccount->id,
            'deposit_account_id' => $this->bankAccount->id,
            'amount' => '75000.00',
            'date' => '2026-09-20',
            'received_from' => 'NHA',
            'description' => 'Milestone 1 payment',
        ], $overrides);
    }

    public function test_index_requires_view_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('incomes.index'))
            ->assertForbidden();
    }

    public function test_index_displays_incomes_filtered_by_project(): void
    {
        ProjectIncome::factory()->count(2)->create(['project_id' => $this->project->id]);
        ProjectIncome::factory()->create();

        $response = $this->actingAs($this->user)
            ->get(route('incomes.index', ['project_id' => $this->project->id]));

        $response->assertInertia(fn ($page) => $page
            ->component('incomes/index')
            ->has('incomes.data', 2)
        );
    }

    public function test_store_posts_journal_entry_debiting_deposit_and_crediting_income(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('incomes.store'), $this->validPayload());

        $response->assertRedirect(route('incomes.index'));

        $income = ProjectIncome::sole();
        $this->assertSame(JournalEntryStatus::Posted, $income->journalEntry->status);
        $this->assertDatabaseCount('journal_lines', 2);
        $this->assertDatabaseHas('journal_lines', [
            'journal_entry_id' => $income->journal_entry_id,
            'account_head_id' => $this->bankAccount->id,
            'project_id' => $this->project->id,
            'debit' => '75000.00',
            'credit' => '0.00',
        ]);
        $this->assertDatabaseHas('journal_lines', [
            'journal_entry_id' => $income->journal_entry_id,
            'account_head_id' => $this->incomeAccount->id,
            'project_id' => $this->project->id,
            'debit' => '0.00',
            'credit' => '75000.00',
        ]);
    }

    public function test_store_requires_create_permission(): void
    {
        $viewer = User::factory()->create();
        $viewer->assignRole(RoleEnum::Viewer);

        $this->actingAs($viewer)
            ->post(route('incomes.store'), $this->validPayload())
            ->assertForbidden();

        $this->assertDatabaseEmpty('project_incomes');
    }

    public function test_store_validates_required_fields(): void
    {
        $response = $this->actingAs($this->user)->post(route('incomes.store'), []);

        $response->assertSessionHasErrors([
            'project_id',
            'income_account_id',
            'deposit_account_id',
            'amount',
            'date',
            'description',
        ]);
    }

    public function test_store_rejects_non_income_account_as_income_account(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('incomes.store'), $this->validPayload(['income_account_id' => $this->bankAccount->id]));

        $response->assertSessionHasErrors([
            'income_account_id' => 'The selected income account must be an active income account.',
        ]);
        $this->assertDatabaseEmpty('project_incomes');
    }

    public function test_store_rejects_non_asset_account_as_deposit_account(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('incomes.store'), $this->validPayload(['deposit_account_id' => $this->incomeAccount->id]));

        $response->assertSessionHasErrors([
            'deposit_account_id' => 'The selected deposit account must be an active asset account.',
        ]);
    }

    public function test_reverse_creates_reversing_entry(): void
    {
        $this->actingAs($this->user)->post(route('incomes.store'), $this->validPayload());
        $income = ProjectIncome::sole();

        $response = $this->actingAs($this->user)
            ->post(route('incomes.reverse', $income), ['reason' => 'Wrong project']);

        $response->assertRedirect(route('incomes.index'));
        $reversal = JournalEntry::where('reversal_of_id', $income->journal_entry_id)->sole();
        $this->assertSame($reversal->id, $income->journalEntry->fresh()->reversed_by_id);
    }

    public function test_reverse_already_reversed_income_flashes_error(): void
    {
        $this->actingAs($this->user)->post(route('incomes.store'), $this->validPayload());
        $income = ProjectIncome::sole();
        $this->actingAs($this->user)->post(route('incomes.reverse', $income));

        $response = $this->actingAs($this->user)->post(route('incomes.reverse', $income));

        $response->assertInertiaFlash('toast', ['type' => 'error', 'message' => 'This income has already been reversed.']);
        $this->assertSame(1, JournalEntry::where('reversal_of_id', $income->journal_entry_id)->count());
    }

    public function test_index_serializes_dates_as_day_month_year(): void
    {
        ProjectIncome::factory()->create(['project_id' => $this->project->id, 'date' => '2026-09-20']);

        $response = $this->actingAs($this->user)->get(route('incomes.index'));

        $response->assertInertia(fn ($page) => $page->where('incomes.data.0.date', '20-09-2026'));
    }
}
