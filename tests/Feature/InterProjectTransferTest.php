<?php

namespace Tests\Feature;

use App\Enums\ProjectStatus;
use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\InterProjectTransfer;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\ChartOfAccountsSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InterProjectTransferTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private AccountHead $cashAccount;

    private AccountHead $bankAccount;

    private Project $projectA;

    private Project $projectB;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->seed(ChartOfAccountsSeeder::class);
        $this->withoutVite();

        $this->cashAccount = AccountHead::where('code', '1001')->first();
        $this->bankAccount = AccountHead::where('code', '1002')->first();
        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);
        $this->projectA = Project::factory()->create();
        $this->projectB = Project::factory()->create();
    }

    public function test_index_requires_authentication(): void
    {
        $this->get(route('transfers.index'))
            ->assertRedirect(route('login'));
    }

    public function test_index_requires_view_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('transfers.index'))
            ->assertForbidden();
    }

    public function test_index_displays_transfers(): void
    {
        InterProjectTransfer::factory()->count(3)->create([
            'from_project_id' => $this->projectA->id,
            'to_project_id' => $this->projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
        ]);

        $response = $this->actingAs($this->user)->get(route('transfers.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('transfers/index')
            ->has('transfers.data', 3)
        );
    }

    public function test_index_filters_by_project(): void
    {
        InterProjectTransfer::factory()->create([
            'from_project_id' => $this->projectA->id,
            'to_project_id' => $this->projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
        ]);
        $otherProject = Project::factory()->create();
        InterProjectTransfer::factory()->create([
            'from_project_id' => $otherProject->id,
            'to_project_id' => $this->projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('transfers.index', ['from_project_id' => $this->projectA->id]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('transfers.data', 1));
    }

    public function test_index_filters_by_date_range(): void
    {
        InterProjectTransfer::factory()->create([
            'from_project_id' => $this->projectA->id,
            'to_project_id' => $this->projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'date' => '2026-09-10',
        ]);
        InterProjectTransfer::factory()->create([
            'from_project_id' => $this->projectA->id,
            'to_project_id' => $this->projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'date' => '2026-08-01',
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('transfers.index', ['date_from' => '2026-09-01']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('transfers.data', 1));
    }

    public function test_store_creates_transfer_with_journal_entry(): void
    {
        $response = $this->actingAs($this->user)->post(route('transfers.store'), [
            'from_project_id' => $this->projectA->id,
            'to_project_id' => $this->projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->bankAccount->id,
            'amount' => '50000.00',
            'date' => '2026-09-16',
            'purpose' => 'Fund project B',
        ]);

        $response->assertRedirect(route('transfers.index'));

        $this->assertDatabaseCount('inter_project_transfers', 1);

        $transfer = InterProjectTransfer::first();
        $this->assertNotNull($transfer->journal_entry_id);
        $this->assertEquals('posted', $transfer->journalEntry->status->value);
    }

    public function test_store_requires_create_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $response = $this->actingAs($user)->post(route('transfers.store'), [
            'from_project_id' => $this->projectA->id,
            'to_project_id' => $this->projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'amount' => '50000.00',
            'date' => '2026-09-16',
            'purpose' => 'Test',
        ]);

        $response->assertForbidden();
    }

    public function test_store_validates_required_fields(): void
    {
        $response = $this->actingAs($this->user)->post(route('transfers.store'), []);

        $response->assertSessionHasErrors([
            'from_project_id',
            'to_project_id',
            'from_account_id',
            'to_account_id',
            'amount',
            'date',
            'purpose',
        ]);
    }

    public function test_store_validates_different_projects(): void
    {
        $response = $this->actingAs($this->user)->post(route('transfers.store'), [
            'from_project_id' => $this->projectA->id,
            'to_project_id' => $this->projectA->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'amount' => '50000.00',
            'date' => '2026-09-16',
            'purpose' => 'Self transfer',
        ]);

        $response->assertSessionHasErrors('to_project_id');
    }

    public function test_store_validates_positive_amount(): void
    {
        $response = $this->actingAs($this->user)->post(route('transfers.store'), [
            'from_project_id' => $this->projectA->id,
            'to_project_id' => $this->projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'amount' => '0',
            'date' => '2026-09-16',
            'purpose' => 'Zero transfer',
        ]);

        $response->assertSessionHasErrors('amount');
    }

    public function test_reverse_creates_reversing_entry(): void
    {
        $this->actingAs($this->user)->post(route('transfers.store'), [
            'from_project_id' => $this->projectA->id,
            'to_project_id' => $this->projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'amount' => '25000.00',
            'date' => '2026-09-16',
            'purpose' => 'To be reversed',
        ]);

        $transfer = InterProjectTransfer::first();

        $response = $this->actingAs($this->user)
            ->post(route('transfers.reverse', $transfer), ['reason' => 'Mistake']);

        $response->assertRedirect(route('transfers.index'));

        $transfer->refresh();
        $this->assertNotNull($transfer->journalEntry->reversed_by_id);
    }

    public function test_reverse_already_reversed_fails(): void
    {
        $this->actingAs($this->user)->post(route('transfers.store'), [
            'from_project_id' => $this->projectA->id,
            'to_project_id' => $this->projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'amount' => '25000.00',
            'date' => '2026-09-16',
            'purpose' => 'Double reverse test',
        ]);

        $transfer = InterProjectTransfer::first();

        $this->actingAs($this->user)
            ->post(route('transfers.reverse', $transfer));

        $response = $this->actingAs($this->user)
            ->post(route('transfers.reverse', $transfer));

        $response->assertRedirect(route('transfers.index'));
    }

    public function test_store_rejects_completed_project(): void
    {
        $completedProject = Project::factory()->create(['status' => ProjectStatus::Completed]);

        $response = $this->actingAs($this->user)->post(route('transfers.store'), [
            'from_project_id' => $completedProject->id,
            'to_project_id' => $this->projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'amount' => '50000.00',
            'date' => '2026-09-16',
            'purpose' => 'Should fail',
        ]);

        $response->assertSessionHasErrors('from_project_id');
    }
}
