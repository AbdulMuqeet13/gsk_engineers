<?php

namespace Tests\Unit;

use App\Enums\JournalEntryStatus;
use App\Enums\JournalEntryType;
use App\Exceptions\Transfers\TransferAlreadyReversedException;
use App\Models\AccountHead;
use App\Models\Project;
use App\Models\User;
use App\Services\TransferService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransferServiceTest extends TestCase
{
    use RefreshDatabase;

    private TransferService $service;

    private User $user;

    private AccountHead $cashAccount;

    private AccountHead $bankAccount;

    private AccountHead $receivableAccount;

    private AccountHead $payableAccount;

    private Project $projectA;

    private Project $projectB;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = app(TransferService::class);
        $this->user = User::factory()->create();
        $this->cashAccount = AccountHead::factory()->asset()->create(['code' => '1001', 'name' => 'Cash']);
        $this->bankAccount = AccountHead::factory()->asset()->create(['code' => '1002', 'name' => 'Bank']);
        $this->receivableAccount = AccountHead::factory()->asset()->create(['code' => '1020', 'name' => 'Inter-Project Receivable']);
        $this->payableAccount = AccountHead::factory()->create([
            'code' => '2020',
            'name' => 'Inter-Project Payable',
            'type' => 'liability',
            'normal_balance' => 'credit',
        ]);
        $this->projectA = Project::factory()->create();
        $this->projectB = Project::factory()->create();
    }

    private function makeTransferData(array $overrides = []): array
    {
        return array_merge([
            'from_project_id' => $this->projectA->id,
            'to_project_id' => $this->projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'amount' => '50000.00',
            'date' => '2026-09-16',
            'purpose' => 'Fund project B salaries',
        ], $overrides);
    }

    public function test_execute_creates_transfer_record(): void
    {
        $transfer = $this->service->execute($this->makeTransferData(), $this->user);

        $this->assertDatabaseHas('inter_project_transfers', [
            'id' => $transfer->id,
            'from_project_id' => $this->projectA->id,
            'to_project_id' => $this->projectB->id,
            'purpose' => 'Fund project B salaries',
        ]);
    }

    public function test_execute_creates_four_line_journal_entry(): void
    {
        $transfer = $this->service->execute($this->makeTransferData(), $this->user);

        $transfer->load('journalEntry.lines');

        $this->assertCount(4, $transfer->journalEntry->lines);
    }

    public function test_execute_journal_entry_is_posted(): void
    {
        $transfer = $this->service->execute($this->makeTransferData(), $this->user);

        $transfer->load('journalEntry');

        $this->assertEquals(JournalEntryStatus::Posted, $transfer->journalEntry->status);
    }

    public function test_execute_debits_equal_credits(): void
    {
        $transfer = $this->service->execute($this->makeTransferData(['amount' => '75000.00']), $this->user);

        $transfer->load('journalEntry.lines');

        $totalDebits = '0.00';
        $totalCredits = '0.00';

        foreach ($transfer->journalEntry->lines as $line) {
            $totalDebits = bcadd($totalDebits, $line->getRawOriginal('debit'), 2);
            $totalCredits = bcadd($totalCredits, $line->getRawOriginal('credit'), 2);
        }

        $this->assertEquals(0, bccomp($totalDebits, $totalCredits, 2));
        $this->assertEquals(0, bccomp($totalDebits, '150000.00', 2));
    }

    public function test_execute_uses_inter_project_receivable_and_payable(): void
    {
        $transfer = $this->service->execute($this->makeTransferData(), $this->user);

        $transfer->load('journalEntry.lines');

        $accountIds = $transfer->journalEntry->lines->pluck('account_head_id')->toArray();

        $this->assertContains($this->receivableAccount->id, $accountIds);
        $this->assertContains($this->payableAccount->id, $accountIds);
    }

    public function test_execute_tags_lines_to_correct_projects(): void
    {
        $transfer = $this->service->execute($this->makeTransferData(), $this->user);

        $transfer->load('journalEntry.lines');

        $lines = $transfer->journalEntry->lines;

        $fromProjectLines = $lines->where('project_id', $this->projectA->id);
        $toProjectLines = $lines->where('project_id', $this->projectB->id);

        $this->assertCount(2, $fromProjectLines);
        $this->assertCount(2, $toProjectLines);
    }

    public function test_execute_generates_unique_reference(): void
    {
        $transfer1 = $this->service->execute($this->makeTransferData(), $this->user);
        $transfer2 = $this->service->execute($this->makeTransferData(), $this->user);

        $this->assertNotEquals($transfer1->reference, $transfer2->reference);
        $this->assertStringStartsWith('TRF-', $transfer1->reference);
    }

    public function test_execute_journal_entry_type_is_transfer(): void
    {
        $transfer = $this->service->execute($this->makeTransferData(), $this->user);

        $transfer->load('journalEntry');

        $this->assertEquals(JournalEntryType::Transfer, $transfer->journalEntry->type);
    }

    public function test_reverse_delegates_to_journal_service(): void
    {
        $transfer = $this->service->execute($this->makeTransferData(), $this->user);

        $this->service->reverse($transfer, $this->user, 'Incorrect transfer');

        $transfer->load('journalEntry');

        $this->assertNotNull($transfer->journalEntry->reversed_by_id);
    }

    public function test_reverse_throws_for_already_reversed(): void
    {
        $transfer = $this->service->execute($this->makeTransferData(), $this->user);

        $this->service->reverse($transfer, $this->user);

        $this->expectException(TransferAlreadyReversedException::class);

        $transfer->refresh();
        $this->service->reverse($transfer, $this->user);
    }
}
