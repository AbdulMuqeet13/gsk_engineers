<?php

namespace App\Services;

use App\Enums\JournalEntryType;
use App\Exceptions\AccountTransfers\AccountTransferAlreadyReversedException;
use App\Models\AccountTransfer;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AccountTransferService
{
    public function __construct(private JournalService $journalService) {}

    /**
     * Generate the next sequential reference number.
     *
     * Format: ACT-YYYY-NNNNNN
     */
    public function generateReference(): string
    {
        $year = now()->year;
        $prefix = "ACT-{$year}-";

        $lastNumber = DB::table('account_transfers')
            ->where('reference', 'like', "{$prefix}%")
            ->lockForUpdate()
            ->max(DB::raw('CAST(SUBSTRING(reference, '.(strlen($prefix) + 1).') AS UNSIGNED)'));

        $nextNumber = ($lastNumber ?? 0) + 1;

        return $prefix.str_pad((string) $nextNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Move funds between two accounts and post the journal entry.
     *
     * Debits the destination account and credits the source account.
     *
     * @param  array{
     *     from_account_id: int,
     *     to_account_id: int,
     *     project_id?: int|null,
     *     amount: string,
     *     date: string,
     *     description: string,
     *     cheque_number?: string|null,
     * }  $data
     */
    public function execute(array $data, User $user): AccountTransfer
    {
        return DB::transaction(function () use ($data, $user) {
            $transfer = AccountTransfer::create([
                ...$data,
                'reference' => $this->generateReference(),
                'created_by' => $user->id,
            ]);

            $amount = $transfer->getRawOriginal('amount') ?? $transfer->amount;
            $projectId = $data['project_id'] ?? null;

            $journalEntry = $this->journalService->create([
                'date' => $data['date'],
                'description' => "Account transfer: {$transfer->reference} — {$data['description']}",
                'type' => JournalEntryType::AccountTransfer->value,
                'lines' => [
                    [
                        'account_head_id' => $data['to_account_id'],
                        'project_id' => $projectId,
                        'debit' => $amount,
                        'credit' => '0.00',
                        'memo' => "Funds received via {$transfer->reference}",
                    ],
                    [
                        'account_head_id' => $data['from_account_id'],
                        'project_id' => $projectId,
                        'debit' => '0.00',
                        'credit' => $amount,
                        'memo' => "Funds sent via {$transfer->reference}",
                    ],
                ],
            ], $user);

            $this->journalService->post($journalEntry);

            $transfer->update(['journal_entry_id' => $journalEntry->id]);

            return $transfer;
        });
    }

    /**
     * Reverse an account transfer by reversing its journal entry.
     *
     * @throws AccountTransferAlreadyReversedException
     */
    public function reverse(AccountTransfer $transfer, User $user, string $reason = ''): void
    {
        $transfer->load('journalEntry');

        if ($transfer->journalEntry->isReversed()) {
            throw new AccountTransferAlreadyReversedException;
        }

        $this->journalService->reverse($transfer->journalEntry, $user, $reason);
    }
}
