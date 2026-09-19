<?php

namespace Tests\Unit;

use App\Enums\JournalEntryType;
use App\Exceptions\Expenses\ExpenseNotDraftException;
use App\Exceptions\Expenses\ExpenseNotSubmittedException;
use App\Models\AccountHead;
use App\Models\Expense;
use App\Models\User;
use App\Services\ExpenseService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpenseServiceTest extends TestCase
{
    use RefreshDatabase;

    private ExpenseService $service;

    private User $user;

    private AccountHead $expenseAccount;

    private AccountHead $cashAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = app(ExpenseService::class);
        $this->user = User::factory()->create();
        $this->expenseAccount = AccountHead::factory()->expense()->create(['code' => '5001', 'name' => 'Fuel']);
        $this->cashAccount = AccountHead::factory()->asset()->create(['code' => '1001', 'name' => 'Cash']);
    }

    public function test_create_creates_draft_expense(): void
    {
        $expense = $this->service->create([
            'date' => '2026-01-15',
            'description' => 'Fuel for site visit',
            'amount' => '5000.00',
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'project_id' => null,
            'notes' => null,
        ], $this->user);

        $this->assertInstanceOf(Expense::class, $expense);
        $this->assertTrue($expense->isDraft());
        $this->assertEquals('Fuel for site visit', $expense->description);
        $this->assertEquals($this->user->id, $expense->created_by);
    }

    public function test_create_generates_unique_reference(): void
    {
        $expense1 = $this->service->create([
            'date' => '2026-01-15',
            'description' => 'Expense 1',
            'amount' => '1000.00',
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'project_id' => null,
            'notes' => null,
        ], $this->user);

        $expense2 = $this->service->create([
            'date' => '2026-01-16',
            'description' => 'Expense 2',
            'amount' => '2000.00',
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'project_id' => null,
            'notes' => null,
        ], $this->user);

        $this->assertNotEquals($expense1->reference, $expense2->reference);
        $this->assertMatchesRegularExpression('/^EXP-\d{4}-\d{6}$/', $expense1->reference);
        $this->assertMatchesRegularExpression('/^EXP-\d{4}-\d{6}$/', $expense2->reference);
    }

    public function test_update_modifies_draft_expense(): void
    {
        $expense = Expense::factory()->draft()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'description' => 'Original',
        ]);

        $updated = $this->service->update($expense, ['description' => 'Updated']);

        $this->assertEquals('Updated', $updated->description);
    }

    public function test_update_throws_for_non_draft(): void
    {
        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $this->expectException(ExpenseNotDraftException::class);
        $this->service->update($expense, ['description' => 'Should fail']);
    }

    public function test_submit_transitions_draft_to_submitted(): void
    {
        $expense = Expense::factory()->draft()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $this->service->submit($expense);

        $expense->refresh();
        $this->assertTrue($expense->isSubmitted());
    }

    public function test_submit_throws_for_non_draft(): void
    {
        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $this->expectException(ExpenseNotDraftException::class);
        $this->service->submit($expense);
    }

    public function test_approve_creates_posted_journal_entry(): void
    {
        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'amount' => '5000.00',
        ]);

        $approver = User::factory()->create();
        $this->service->approve($expense, $approver);

        $expense->refresh();
        $this->assertTrue($expense->isApproved());
        $this->assertNotNull($expense->journal_entry_id);

        $journalEntry = $expense->journalEntry;
        $this->assertTrue($journalEntry->isPosted());
    }

    public function test_approve_journal_entry_has_correct_amounts(): void
    {
        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'amount' => '3500.50',
        ]);

        $approver = User::factory()->create();
        $this->service->approve($expense, $approver);

        $expense->refresh();
        $journalEntry = $expense->journalEntry;
        $journalEntry->load('lines');

        $debitLine = $journalEntry->lines->firstWhere('account_head_id', $this->expenseAccount->id);
        $creditLine = $journalEntry->lines->firstWhere('account_head_id', $this->cashAccount->id);

        $this->assertEquals(0, bccomp($debitLine->getRawOriginal('debit'), '3500.50', 2));
        $this->assertEquals(0, bccomp($creditLine->getRawOriginal('credit'), '3500.50', 2));
    }

    public function test_approve_journal_entry_has_expense_type(): void
    {
        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $approver = User::factory()->create();
        $this->service->approve($expense, $approver);

        $expense->refresh();
        $this->assertEquals(JournalEntryType::Expense, $expense->journalEntry->type);
    }

    public function test_approve_sets_approver_and_timestamp(): void
    {
        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $approver = User::factory()->create();
        $this->service->approve($expense, $approver);

        $expense->refresh();
        $this->assertEquals($approver->id, $expense->approved_by);
        $this->assertNotNull($expense->approved_at);
    }

    public function test_approve_links_journal_entry_to_expense(): void
    {
        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $approver = User::factory()->create();
        $this->service->approve($expense, $approver);

        $expense->refresh();
        $this->assertNotNull($expense->journal_entry_id);
        $this->assertEquals($expense->id, Expense::where('journal_entry_id', $expense->journal_entry_id)->first()->id);
    }

    public function test_approve_throws_for_non_submitted(): void
    {
        $expense = Expense::factory()->draft()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $this->expectException(ExpenseNotSubmittedException::class);
        $this->service->approve($expense, User::factory()->create());
    }

    public function test_reject_transitions_to_rejected_with_reason(): void
    {
        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $rejector = User::factory()->create();
        $this->service->reject($expense, $rejector, 'Invalid receipt');

        $expense->refresh();
        $this->assertTrue($expense->isRejected());
        $this->assertEquals('Invalid receipt', $expense->rejection_reason);
        $this->assertEquals($rejector->id, $expense->approved_by);
        $this->assertNotNull($expense->approved_at);
    }

    public function test_reject_throws_for_non_submitted(): void
    {
        $expense = Expense::factory()->draft()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $this->expectException(ExpenseNotSubmittedException::class);
        $this->service->reject($expense, User::factory()->create(), 'reason');
    }

    public function test_delete_removes_draft(): void
    {
        $expense = Expense::factory()->draft()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $this->service->delete($expense);

        $this->assertDatabaseMissing('expenses', ['id' => $expense->id]);
    }

    public function test_delete_throws_for_non_draft(): void
    {
        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $this->expectException(ExpenseNotDraftException::class);
        $this->service->delete($expense);
    }
}
