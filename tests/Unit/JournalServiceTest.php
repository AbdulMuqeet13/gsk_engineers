<?php

namespace Tests\Unit;

use App\Enums\JournalEntryType;
use App\Exceptions\Accounting\EntryAlreadyPostedException;
use App\Exceptions\Accounting\EntryAlreadyReversedException;
use App\Exceptions\Accounting\EntryNotDraftException;
use App\Exceptions\Accounting\InactiveAccountHeadException;
use App\Exceptions\Accounting\InsufficientLinesException;
use App\Exceptions\Accounting\UnbalancedEntryException;
use App\Models\AccountHead;
use App\Models\JournalEntry;
use App\Models\JournalLine;
use App\Models\User;
use App\Services\JournalService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JournalServiceTest extends TestCase
{
    use RefreshDatabase;

    private JournalService $service;

    private User $user;

    private AccountHead $debitAccount;

    private AccountHead $creditAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = app(JournalService::class);
        $this->user = User::factory()->create();
        $this->debitAccount = AccountHead::factory()->asset()->create();
        $this->creditAccount = AccountHead::factory()->create([
            'type' => 'liability',
            'normal_balance' => 'credit',
        ]);
    }

    public function test_create_creates_draft_entry_with_lines(): void
    {
        $entry = $this->service->create([
            'date' => '2026-01-15',
            'description' => 'Test entry',
            'type' => JournalEntryType::Standard->value,
            'lines' => [
                [
                    'account_head_id' => $this->debitAccount->id,
                    'project_id' => null,
                    'debit' => '1000.00',
                    'credit' => '0.00',
                    'memo' => 'Debit line',
                ],
                [
                    'account_head_id' => $this->creditAccount->id,
                    'project_id' => null,
                    'debit' => '0.00',
                    'credit' => '1000.00',
                    'memo' => 'Credit line',
                ],
            ],
        ], $this->user);

        $this->assertInstanceOf(JournalEntry::class, $entry);
        $this->assertTrue($entry->isDraft());
        $this->assertCount(2, $entry->lines);
        $this->assertEquals('Test entry', $entry->description);
    }

    public function test_create_generates_unique_reference(): void
    {
        $entry1 = $this->service->create([
            'date' => '2026-01-15',
            'description' => 'Entry 1',
            'type' => JournalEntryType::Standard->value,
            'lines' => [
                ['account_head_id' => $this->debitAccount->id, 'project_id' => null, 'debit' => '500.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->creditAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '500.00', 'memo' => null],
            ],
        ], $this->user);

        $entry2 = $this->service->create([
            'date' => '2026-01-16',
            'description' => 'Entry 2',
            'type' => JournalEntryType::Standard->value,
            'lines' => [
                ['account_head_id' => $this->debitAccount->id, 'project_id' => null, 'debit' => '300.00', 'credit' => '0.00', 'memo' => null],
                ['account_head_id' => $this->creditAccount->id, 'project_id' => null, 'debit' => '0.00', 'credit' => '300.00', 'memo' => null],
            ],
        ], $this->user);

        $this->assertNotEquals($entry1->reference, $entry2->reference);
        $this->assertMatchesRegularExpression('/^JE-\d{4}-\d{6}$/', $entry1->reference);
        $this->assertMatchesRegularExpression('/^JE-\d{4}-\d{6}$/', $entry2->reference);
    }

    public function test_post_succeeds_for_balanced_entry(): void
    {
        $entry = JournalEntry::factory()
            ->withBalancedLines($this->debitAccount, $this->creditAccount, '5000.00')
            ->create();

        $this->service->post($entry);

        $entry->refresh();
        $this->assertTrue($entry->isPosted());
    }

    public function test_post_throws_for_unbalanced_entry(): void
    {
        $entry = JournalEntry::factory()->create();

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
            'credit' => '999.99',
        ]);

        $this->expectException(UnbalancedEntryException::class);
        $this->service->post($entry);

        $entry->refresh();
        $this->assertTrue($entry->isDraft());
    }

    public function test_post_throws_for_single_line_entry(): void
    {
        $entry = JournalEntry::factory()->create();

        JournalLine::factory()->create([
            'journal_entry_id' => $entry->id,
            'account_head_id' => $this->debitAccount->id,
            'debit' => '1000.00',
            'credit' => '0.00',
        ]);

        $this->expectException(InsufficientLinesException::class);
        $this->service->post($entry);
    }

    public function test_post_throws_for_inactive_account_head(): void
    {
        $inactiveAccount = AccountHead::factory()->inactive()->create();

        $entry = JournalEntry::factory()->create();

        JournalLine::factory()->create([
            'journal_entry_id' => $entry->id,
            'account_head_id' => $inactiveAccount->id,
            'debit' => '1000.00',
            'credit' => '0.00',
        ]);
        JournalLine::factory()->create([
            'journal_entry_id' => $entry->id,
            'account_head_id' => $this->creditAccount->id,
            'debit' => '0.00',
            'credit' => '1000.00',
        ]);

        $this->expectException(InactiveAccountHeadException::class);
        $this->service->post($entry);
    }

    public function test_post_throws_for_already_posted_entry(): void
    {
        $entry = JournalEntry::factory()
            ->posted()
            ->withBalancedLines($this->debitAccount, $this->creditAccount)
            ->create();

        $this->expectException(EntryNotDraftException::class);
        $this->service->post($entry);
    }

    public function test_update_throws_for_posted_entry(): void
    {
        $entry = JournalEntry::factory()
            ->posted()
            ->withBalancedLines($this->debitAccount, $this->creditAccount)
            ->create();

        $this->expectException(EntryAlreadyPostedException::class);
        $this->service->update($entry, ['description' => 'Updated']);
    }

    public function test_reverse_creates_mirror_entry(): void
    {
        $entry = JournalEntry::factory()
            ->posted()
            ->withBalancedLines($this->debitAccount, $this->creditAccount, '2500.00')
            ->create();

        $reversal = $this->service->reverse($entry, $this->user, 'Correction needed');

        $this->assertTrue($reversal->isPosted());
        $this->assertEquals($entry->id, $reversal->reversal_of_id);
        $this->assertCount(2, $reversal->lines);

        $entry->refresh();
        $this->assertEquals($reversal->id, $entry->reversed_by_id);

        $originalLines = $entry->lines->sortBy('id')->values();
        $reversalLines = $reversal->lines->sortBy('id')->values();

        $this->assertEquals(
            bccomp($originalLines[0]->getRawOriginal('debit'), $reversalLines[0]->getRawOriginal('credit'), 2),
            0,
        );
        $this->assertEquals(
            bccomp($originalLines[0]->getRawOriginal('credit'), $reversalLines[0]->getRawOriginal('debit'), 2),
            0,
        );
    }

    public function test_reverse_throws_for_draft_entry(): void
    {
        $entry = JournalEntry::factory()
            ->draft()
            ->withBalancedLines($this->debitAccount, $this->creditAccount)
            ->create();

        $this->expectException(EntryNotDraftException::class);
        $this->service->reverse($entry, $this->user);
    }

    public function test_reverse_throws_for_already_reversed_entry(): void
    {
        $entry = JournalEntry::factory()
            ->posted()
            ->withBalancedLines($this->debitAccount, $this->creditAccount)
            ->create();

        $this->service->reverse($entry, $this->user);

        $entry->refresh();

        $this->expectException(EntryAlreadyReversedException::class);
        $this->service->reverse($entry, $this->user);
    }

    public function test_bcmath_precision_is_maintained(): void
    {
        $entry = JournalEntry::factory()->create();

        JournalLine::factory()->create([
            'journal_entry_id' => $entry->id,
            'account_head_id' => $this->debitAccount->id,
            'debit' => '0.10',
            'credit' => '0.00',
        ]);
        JournalLine::factory()->create([
            'journal_entry_id' => $entry->id,
            'account_head_id' => $this->debitAccount->id,
            'debit' => '0.20',
            'credit' => '0.00',
        ]);
        JournalLine::factory()->create([
            'journal_entry_id' => $entry->id,
            'account_head_id' => $this->creditAccount->id,
            'debit' => '0.00',
            'credit' => '0.30',
        ]);

        $this->service->post($entry);

        $entry->refresh();
        $this->assertTrue($entry->isPosted());
    }

    public function test_post_rolls_back_on_failure(): void
    {
        $entry = JournalEntry::factory()->create();

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

        try {
            $this->service->post($entry);
        } catch (UnbalancedEntryException) {
            // Expected
        }

        $entry->refresh();
        $this->assertTrue($entry->isDraft());
    }
}
