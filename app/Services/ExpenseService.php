<?php

namespace App\Services;

use App\Enums\ExpenseStatus;
use App\Enums\JournalEntryType;
use App\Exceptions\Expenses\ExpenseNotDraftException;
use App\Exceptions\Expenses\ExpenseNotSubmittedException;
use App\Models\Expense;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ExpenseService
{
    public function __construct(private JournalService $journalService) {}

    /**
     * Generate the next sequential reference number.
     *
     * Format: EXP-YYYY-NNNNNN
     */
    public function generateReference(): string
    {
        $year = now()->year;
        $prefix = "EXP-{$year}-";

        $lastNumber = DB::table('expenses')
            ->where('reference', 'like', "{$prefix}%")
            ->lockForUpdate()
            ->max(DB::raw('CAST(SUBSTRING(reference, '.(strlen($prefix) + 1).') AS UNSIGNED)'));

        $nextNumber = ($lastNumber ?? 0) + 1;

        return $prefix.str_pad((string) $nextNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Create a draft expense.
     *
     * @param array{
     *     date: string,
     *     description: string,
     *     amount: string,
     *     account_head_id: int,
     *     payment_account_id: int,
     *     project_id: int|null,
     *     notes: string|null,
     * } $data
     */
    public function create(array $data, User $user): Expense
    {
        return DB::transaction(function () use ($data, $user) {
            return Expense::create([
                ...$data,
                'reference' => $this->generateReference(),
                'status' => ExpenseStatus::Draft,
                'created_by' => $user->id,
            ]);
        });
    }

    /**
     * Update a draft expense.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws ExpenseNotDraftException
     */
    public function update(Expense $expense, array $data): Expense
    {
        if (! $expense->isDraft()) {
            throw new ExpenseNotDraftException($expense->status);
        }

        $expense->update($data);

        return $expense;
    }

    /**
     * Submit a draft expense for approval.
     *
     * @throws ExpenseNotDraftException
     */
    public function submit(Expense $expense): void
    {
        if (! $expense->isDraft()) {
            throw new ExpenseNotDraftException($expense->status);
        }

        $expense->update(['status' => ExpenseStatus::Submitted]);
    }

    /**
     * Approve a submitted expense and create a posted journal entry.
     *
     * @throws ExpenseNotSubmittedException
     */
    public function approve(Expense $expense, User $approver): void
    {
        if (! $expense->isSubmitted()) {
            throw new ExpenseNotSubmittedException($expense->status);
        }

        DB::transaction(function () use ($expense, $approver) {
            $amount = $expense->getRawOriginal('amount') ?? $expense->amount;

            $journalEntry = $this->journalService->create([
                'date' => $expense->date->toDateString(),
                'description' => "Expense: {$expense->description}",
                'type' => JournalEntryType::Expense->value,
                'lines' => [
                    [
                        'account_head_id' => $expense->account_head_id,
                        'project_id' => $expense->project_id,
                        'debit' => $amount,
                        'credit' => '0.00',
                        'memo' => $expense->description,
                    ],
                    [
                        'account_head_id' => $expense->payment_account_id,
                        'project_id' => $expense->project_id,
                        'debit' => '0.00',
                        'credit' => $amount,
                        'memo' => "Payment for expense {$expense->reference}",
                    ],
                ],
            ], $approver);

            $this->journalService->post($journalEntry);

            $expense->update([
                'status' => ExpenseStatus::Approved,
                'journal_entry_id' => $journalEntry->id,
                'approved_by' => $approver->id,
                'approved_at' => now(),
            ]);
        });
    }

    /**
     * Reject a submitted expense.
     *
     * @throws ExpenseNotSubmittedException
     */
    public function reject(Expense $expense, User $rejector, string $reason): void
    {
        if (! $expense->isSubmitted()) {
            throw new ExpenseNotSubmittedException($expense->status);
        }

        $expense->update([
            'status' => ExpenseStatus::Rejected,
            'approved_by' => $rejector->id,
            'approved_at' => now(),
            'rejection_reason' => $reason,
        ]);
    }

    /**
     * Delete a draft expense.
     *
     * @throws ExpenseNotDraftException
     */
    public function delete(Expense $expense): void
    {
        if (! $expense->isDraft()) {
            throw new ExpenseNotDraftException($expense->status);
        }

        $expense->delete();
    }
}
