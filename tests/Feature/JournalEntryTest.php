<?php

namespace Tests\Feature;

use App\Enums\JournalEntryType;
use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\JournalEntry;
use App\Models\JournalLine;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JournalEntryTest extends TestCase
{
    use RefreshDatabase;

    private AccountHead $debitAccount;

    private AccountHead $creditAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();

        $this->debitAccount = AccountHead::factory()->asset()->create();
        $this->creditAccount = AccountHead::factory()->create([
            'type' => 'liability',
            'normal_balance' => 'credit',
        ]);
    }

    public function test_index_requires_authentication(): void
    {
        $this->get(route('journal-entries.index'))
            ->assertRedirect(route('login'));
    }

    public function test_index_requires_view_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('journal-entries.index'))
            ->assertForbidden();
    }

    public function test_index_displays_journal_entries(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        JournalEntry::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('journal-entries.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('accounting/journal-entries/index')
            ->has('journalEntries.data', 3)
        );
    }

    public function test_index_filters_by_status(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        JournalEntry::factory()->draft()->count(2)->create();
        JournalEntry::factory()->posted()
            ->withBalancedLines($this->debitAccount, $this->creditAccount)
            ->create();

        $response = $this->actingAs($user)
            ->get(route('journal-entries.index', ['status' => 'draft']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('journalEntries.data', 2)
        );
    }

    public function test_store_creates_draft_journal_entry(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $data = [
            'date' => '2026-01-15',
            'description' => 'Test journal entry',
            'type' => JournalEntryType::Standard->value,
            'lines' => [
                [
                    'account_head_id' => $this->debitAccount->id,
                    'project_id' => null,
                    'debit' => '5000.00',
                    'credit' => '0.00',
                    'memo' => 'Debit line',
                ],
                [
                    'account_head_id' => $this->creditAccount->id,
                    'project_id' => null,
                    'debit' => '0.00',
                    'credit' => '5000.00',
                    'memo' => 'Credit line',
                ],
            ],
        ];

        $this->actingAs($user)
            ->post(route('journal-entries.store'), $data)
            ->assertRedirect(route('journal-entries.index'));

        $this->assertDatabaseHas('journal_entries', [
            'description' => 'Test journal entry',
            'status' => 'draft',
        ]);

        $entry = JournalEntry::where('description', 'Test journal entry')->first();
        $this->assertCount(2, $entry->lines);
    }

    public function test_store_requires_create_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $data = [
            'date' => '2026-01-15',
            'description' => 'Test',
            'type' => JournalEntryType::Standard->value,
            'lines' => [
                ['account_head_id' => $this->debitAccount->id, 'project_id' => null, 'debit' => '100.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->creditAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '100.00', 'memo' => null],
            ],
        ];

        $this->actingAs($user)
            ->post(route('journal-entries.store'), $data)
            ->assertForbidden();
    }

    public function test_store_validates_minimum_two_lines(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $data = [
            'date' => '2026-01-15',
            'description' => 'Test',
            'type' => JournalEntryType::Standard->value,
            'lines' => [
                ['account_head_id' => $this->debitAccount->id, 'project_id' => null, 'debit' => '100.00', 'credit' => '0.00', 'memo' => null],
            ],
        ];

        $this->actingAs($user)
            ->post(route('journal-entries.store'), $data)
            ->assertSessionHasErrors('lines');
    }

    public function test_update_modifies_draft_entry(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $entry = JournalEntry::factory()
            ->draft()
            ->withBalancedLines($this->debitAccount, $this->creditAccount)
            ->create(['created_by' => $user->id]);

        $data = [
            'date' => '2026-02-01',
            'description' => 'Updated description',
            'type' => JournalEntryType::Standard->value,
            'lines' => [
                ['account_head_id' => $this->debitAccount->id, 'project_id' => null, 'debit' => '2000.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->creditAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '2000.00', 'memo' => null],
            ],
        ];

        $this->actingAs($user)
            ->put(route('journal-entries.update', $entry), $data)
            ->assertRedirect(route('journal-entries.index'));

        $this->assertDatabaseHas('journal_entries', [
            'id' => $entry->id,
            'description' => 'Updated description',
        ]);
    }

    public function test_update_rejects_posted_entry(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $entry = JournalEntry::factory()
            ->posted()
            ->withBalancedLines($this->debitAccount, $this->creditAccount)
            ->create(['created_by' => $user->id]);

        $data = [
            'date' => '2026-02-01',
            'description' => 'Should not update',
            'type' => JournalEntryType::Standard->value,
            'lines' => [
                ['account_head_id' => $this->debitAccount->id, 'project_id' => null, 'debit' => '100.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->creditAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '100.00', 'memo' => null],
            ],
        ];

        $this->actingAs($user)
            ->put(route('journal-entries.update', $entry), $data)
            ->assertForbidden();
    }

    public function test_post_transitions_draft_to_posted(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $entry = JournalEntry::factory()
            ->draft()
            ->withBalancedLines($this->debitAccount, $this->creditAccount, '3000.00')
            ->create(['created_by' => $user->id]);

        $this->actingAs($user)
            ->post(route('journal-entries.post', $entry))
            ->assertRedirect(route('journal-entries.index'));

        $entry->refresh();
        $this->assertTrue($entry->isPosted());
    }

    public function test_post_requires_post_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $entry = JournalEntry::factory()
            ->draft()
            ->withBalancedLines($this->debitAccount, $this->creditAccount)
            ->create();

        $this->actingAs($user)
            ->post(route('journal-entries.post', $entry))
            ->assertForbidden();
    }

    public function test_post_rejects_unbalanced_entry(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $entry = JournalEntry::factory()->draft()->create(['created_by' => $user->id]);

        JournalLine::factory()->create([
            'journal_entry_id' => $entry->id,
            'account_head_id' => $this->debitAccount->id,
            'debit' => '1000.00',
            'credit' => '0.00',
        ]);
        JournalLine::factory()->create([
            'journal_entry_id' => $entry->id,
            'account_head_id' => $this->creditAccount->id,
            'debit' => '0.00',
            'credit' => '500.00',
        ]);

        $this->actingAs($user)
            ->post(route('journal-entries.post', $entry))
            ->assertRedirect(route('journal-entries.index'));

        $entry->refresh();
        $this->assertTrue($entry->isDraft());
    }

    public function test_reverse_creates_reversal_entry(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $entry = JournalEntry::factory()
            ->posted()
            ->withBalancedLines($this->debitAccount, $this->creditAccount, '4000.00')
            ->create(['created_by' => $user->id]);

        $this->actingAs($user)
            ->post(route('journal-entries.reverse', $entry), ['reason' => 'Error correction'])
            ->assertRedirect(route('journal-entries.index'));

        $entry->refresh();
        $this->assertNotNull($entry->reversed_by_id);

        $reversal = JournalEntry::find($entry->reversed_by_id);
        $this->assertTrue($reversal->isPosted());
        $this->assertEquals($entry->id, $reversal->reversal_of_id);
    }

    public function test_reverse_requires_reverse_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $entry = JournalEntry::factory()
            ->posted()
            ->withBalancedLines($this->debitAccount, $this->creditAccount)
            ->create();

        $this->actingAs($user)
            ->post(route('journal-entries.reverse', $entry))
            ->assertForbidden();
    }

    public function test_reverse_rejects_draft_entry(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $entry = JournalEntry::factory()
            ->draft()
            ->withBalancedLines($this->debitAccount, $this->creditAccount)
            ->create(['created_by' => $user->id]);

        $this->actingAs($user)
            ->post(route('journal-entries.reverse', $entry))
            ->assertRedirect(route('journal-entries.index'));

        $this->assertDatabaseMissing('journal_entries', [
            'reversal_of_id' => $entry->id,
        ]);
    }
}
