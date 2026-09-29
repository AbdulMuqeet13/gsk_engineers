<?php

namespace Tests\Feature;

use App\Enums\JournalEntryStatus;
use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\AccountTransfer;
use App\Models\JournalEntry;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\ChartOfAccountsSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountTransferTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private AccountHead $cashAccount;

    private AccountHead $bankAccount;

    private AccountHead $receivableAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->seed(ChartOfAccountsSeeder::class);
        $this->withoutVite();

        $this->cashAccount = AccountHead::where('code', '1001')->first();
        $this->bankAccount = AccountHead::where('code', '1002')->first();
        $this->receivableAccount = AccountHead::where('code', '1010')->first();
        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'from_account_id' => $this->bankAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'amount' => '20000.00',
            'date' => '2026-09-20',
            'description' => 'Cash withdrawal for site',
        ], $overrides);
    }

    public function test_index_requires_view_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('account-transfers.index'))
            ->assertForbidden();
    }

    public function test_index_filters_by_account_on_either_side(): void
    {
        AccountTransfer::factory()->create(['from_account_id' => $this->bankAccount->id, 'to_account_id' => $this->cashAccount->id]);
        AccountTransfer::factory()->create(['from_account_id' => $this->cashAccount->id, 'to_account_id' => $this->bankAccount->id]);
        AccountTransfer::factory()->create(['from_account_id' => $this->receivableAccount->id, 'to_account_id' => $this->bankAccount->id]);

        $response = $this->actingAs($this->user)
            ->get(route('account-transfers.index', ['account_id' => $this->cashAccount->id]));

        $response->assertInertia(fn ($page) => $page
            ->component('account-transfers/index')
            ->has('accountTransfers.data', 2)
        );
    }

    public function test_store_posts_journal_entry_debiting_destination_and_crediting_source(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('account-transfers.store'), $this->validPayload());

        $response->assertRedirect(route('account-transfers.index'));

        $transfer = AccountTransfer::sole();
        $this->assertSame(JournalEntryStatus::Posted, $transfer->journalEntry->status);
        $this->assertDatabaseCount('journal_lines', 2);
        $this->assertDatabaseHas('journal_lines', [
            'journal_entry_id' => $transfer->journal_entry_id,
            'account_head_id' => $this->cashAccount->id,
            'project_id' => null,
            'debit' => '20000.00',
            'credit' => '0.00',
        ]);
        $this->assertDatabaseHas('journal_lines', [
            'journal_entry_id' => $transfer->journal_entry_id,
            'account_head_id' => $this->bankAccount->id,
            'project_id' => null,
            'debit' => '0.00',
            'credit' => '20000.00',
        ]);
    }

    public function test_store_tags_both_lines_with_selected_project(): void
    {
        $project = Project::factory()->create();

        $this->actingAs($this->user)->post(route('account-transfers.store'), $this->validPayload([
            'from_account_id' => $this->receivableAccount->id,
            'to_account_id' => $this->bankAccount->id,
            'project_id' => $project->id,
        ]));

        $transfer = AccountTransfer::sole();
        $this->assertSame(2, $transfer->journalEntry->lines()->where('project_id', $project->id)->count());
    }

    public function test_store_requires_create_permission(): void
    {
        $viewer = User::factory()->create();
        $viewer->assignRole(RoleEnum::Viewer);

        $this->actingAs($viewer)
            ->post(route('account-transfers.store'), $this->validPayload())
            ->assertForbidden();

        $this->assertDatabaseEmpty('account_transfers');
    }

    public function test_store_validates_required_fields(): void
    {
        $response = $this->actingAs($this->user)->post(route('account-transfers.store'), []);

        $response->assertSessionHasErrors([
            'from_account_id',
            'to_account_id',
            'amount',
            'date',
            'description',
        ]);
    }

    public function test_store_rejects_same_source_and_destination(): void
    {
        $response = $this->actingAs($this->user)->post(route('account-transfers.store'), $this->validPayload([
            'to_account_id' => $this->bankAccount->id,
        ]));

        $response->assertSessionHasErrors([
            'to_account_id' => 'The destination account must be different from the source account.',
        ]);
        $this->assertDatabaseEmpty('account_transfers');
    }

    public function test_store_rejects_non_asset_account(): void
    {
        $incomeAccount = AccountHead::where('code', '4001')->first();

        $response = $this->actingAs($this->user)->post(route('account-transfers.store'), $this->validPayload([
            'from_account_id' => $incomeAccount->id,
        ]));

        $response->assertSessionHasErrors([
            'from_account_id' => 'The source account must be an active asset account.',
        ]);
    }

    public function test_reverse_creates_reversing_entry(): void
    {
        $this->actingAs($this->user)->post(route('account-transfers.store'), $this->validPayload());
        $transfer = AccountTransfer::sole();

        $response = $this->actingAs($this->user)
            ->post(route('account-transfers.reverse', $transfer), ['reason' => 'Wrong amount']);

        $response->assertRedirect(route('account-transfers.index'));
        $reversal = JournalEntry::where('reversal_of_id', $transfer->journal_entry_id)->sole();
        $this->assertSame($reversal->id, $transfer->journalEntry->fresh()->reversed_by_id);
    }

    public function test_reverse_already_reversed_transfer_flashes_error(): void
    {
        $this->actingAs($this->user)->post(route('account-transfers.store'), $this->validPayload());
        $transfer = AccountTransfer::sole();
        $this->actingAs($this->user)->post(route('account-transfers.reverse', $transfer));

        $response = $this->actingAs($this->user)->post(route('account-transfers.reverse', $transfer));

        $response->assertInertiaFlash('toast', ['type' => 'error', 'message' => 'This account transfer has already been reversed.']);
        $this->assertSame(1, JournalEntry::where('reversal_of_id', $transfer->journal_entry_id)->count());
    }
}
