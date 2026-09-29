<?php

namespace App\Services;

use App\Enums\JournalEntryType;
use App\Exceptions\Incomes\IncomeAlreadyReversedException;
use App\Models\ProjectIncome;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class IncomeService
{
    public function __construct(private JournalService $journalService) {}

    /**
     * Generate the next sequential reference number.
     *
     * Format: INC-YYYY-NNNNNN
     */
    public function generateReference(): string
    {
        $year = now()->year;
        $prefix = "INC-{$year}-";

        $lastNumber = DB::table('project_incomes')
            ->where('reference', 'like', "{$prefix}%")
            ->lockForUpdate()
            ->max(DB::raw('CAST(SUBSTRING(reference, '.(strlen($prefix) + 1).') AS UNSIGNED)'));

        $nextNumber = ($lastNumber ?? 0) + 1;

        return $prefix.str_pad((string) $nextNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Record a project income and post its journal entry.
     *
     * Debits the deposit account (cash, bank, receivable) and credits the
     * income account, with both lines tagged to the project.
     *
     * @param  array{
     *     project_id: int,
     *     income_account_id: int,
     *     deposit_account_id: int,
     *     amount: string,
     *     date: string,
     *     received_from?: string|null,
     *     description: string,
     *     cheque_number?: string|null,
     * }  $data
     */
    public function record(array $data, User $user): ProjectIncome
    {
        return DB::transaction(function () use ($data, $user) {
            $income = ProjectIncome::create([
                ...$data,
                'reference' => $this->generateReference(),
                'created_by' => $user->id,
            ]);

            $amount = $income->getRawOriginal('amount') ?? $income->amount;

            $journalEntry = $this->journalService->create([
                'date' => $data['date'],
                'description' => "Project income: {$income->reference} — {$data['description']}",
                'type' => JournalEntryType::Income->value,
                'lines' => [
                    [
                        'account_head_id' => $data['deposit_account_id'],
                        'project_id' => $data['project_id'],
                        'debit' => $amount,
                        'credit' => '0.00',
                        'memo' => "Income received {$income->reference}",
                    ],
                    [
                        'account_head_id' => $data['income_account_id'],
                        'project_id' => $data['project_id'],
                        'debit' => '0.00',
                        'credit' => $amount,
                        'memo' => $data['received_from'] ?? null,
                    ],
                ],
            ], $user);

            $this->journalService->post($journalEntry);

            $income->update(['journal_entry_id' => $journalEntry->id]);

            return $income;
        });
    }

    /**
     * Reverse an income by reversing its journal entry.
     *
     * @throws IncomeAlreadyReversedException
     */
    public function reverse(ProjectIncome $income, User $user, string $reason = ''): void
    {
        $income->load('journalEntry');

        if ($income->journalEntry->isReversed()) {
            throw new IncomeAlreadyReversedException;
        }

        $this->journalService->reverse($income->journalEntry, $user, $reason);
    }
}
