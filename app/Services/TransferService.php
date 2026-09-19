<?php

namespace App\Services;

use App\Enums\JournalEntryType;
use App\Exceptions\Transfers\TransferAlreadyReversedException;
use App\Models\AccountHead;
use App\Models\InterProjectTransfer;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TransferService
{
    public function __construct(private JournalService $journalService) {}

    /**
     * Generate the next sequential reference number.
     *
     * Format: TRF-YYYY-NNNNNN
     */
    public function generateReference(): string
    {
        $year = now()->year;
        $prefix = "TRF-{$year}-";

        $lastNumber = DB::table('inter_project_transfers')
            ->where('reference', 'like', "{$prefix}%")
            ->lockForUpdate()
            ->max(DB::raw('CAST(SUBSTRING(reference, '.(strlen($prefix) + 1).') AS UNSIGNED)'));

        $nextNumber = ($lastNumber ?? 0) + 1;

        return $prefix.str_pad((string) $nextNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Execute an inter-project transfer and post the journal entry.
     *
     * @param  array{
     *     from_project_id: int,
     *     to_project_id: int,
     *     from_account_id: int,
     *     to_account_id: int,
     *     amount: string,
     *     date: string,
     *     purpose: string,
     * }  $data
     */
    public function execute(array $data, User $user): InterProjectTransfer
    {
        return DB::transaction(function () use ($data, $user) {
            $transfer = InterProjectTransfer::create([
                ...$data,
                'reference' => $this->generateReference(),
                'created_by' => $user->id,
            ]);

            $amount = $transfer->getRawOriginal('amount') ?? $transfer->amount;

            $receivableAccount = AccountHead::where('code', '1020')->firstOrFail();
            $payableAccount = AccountHead::where('code', '2020')->firstOrFail();

            $journalEntry = $this->journalService->create([
                'date' => $data['date'],
                'description' => "Inter-project transfer: {$transfer->reference} — {$data['purpose']}",
                'type' => JournalEntryType::Transfer->value,
                'lines' => [
                    [
                        'account_head_id' => $data['to_account_id'],
                        'project_id' => $data['to_project_id'],
                        'debit' => $amount,
                        'credit' => '0.00',
                        'memo' => "Funds received from transfer {$transfer->reference}",
                    ],
                    [
                        'account_head_id' => $data['from_account_id'],
                        'project_id' => $data['from_project_id'],
                        'debit' => '0.00',
                        'credit' => $amount,
                        'memo' => "Funds sent via transfer {$transfer->reference}",
                    ],
                    [
                        'account_head_id' => $receivableAccount->id,
                        'project_id' => $data['from_project_id'],
                        'debit' => $amount,
                        'credit' => '0.00',
                        'memo' => "Receivable from inter-project transfer {$transfer->reference}",
                    ],
                    [
                        'account_head_id' => $payableAccount->id,
                        'project_id' => $data['to_project_id'],
                        'debit' => '0.00',
                        'credit' => $amount,
                        'memo' => "Payable from inter-project transfer {$transfer->reference}",
                    ],
                ],
            ], $user);

            $this->journalService->post($journalEntry);

            $transfer->update(['journal_entry_id' => $journalEntry->id]);

            return $transfer->load([
                'fromProject:id,name,code',
                'toProject:id,name,code',
                'fromAccount:id,code,name',
                'toAccount:id,code,name',
                'journalEntry:id,reference',
                'creator:id,name',
            ]);
        });
    }

    /**
     * Reverse a transfer by reversing its journal entry.
     *
     * @throws TransferAlreadyReversedException
     */
    public function reverse(InterProjectTransfer $transfer, User $user, string $reason = ''): void
    {
        $transfer->load('journalEntry');

        if ($transfer->journalEntry->isReversed()) {
            throw new TransferAlreadyReversedException;
        }

        $this->journalService->reverse($transfer->journalEntry, $user, $reason);
    }
}
