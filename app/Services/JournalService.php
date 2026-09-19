<?php

namespace App\Services;

use App\Enums\JournalEntryStatus;
use App\Exceptions\Accounting\EntryAlreadyPostedException;
use App\Exceptions\Accounting\EntryAlreadyReversedException;
use App\Exceptions\Accounting\EntryNotDraftException;
use App\Exceptions\Accounting\InactiveAccountHeadException;
use App\Exceptions\Accounting\InsufficientLinesException;
use App\Exceptions\Accounting\UnbalancedEntryException;
use App\Models\JournalEntry;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class JournalService
{
    /**
     * Generate the next sequential reference number.
     *
     * Format: JE-YYYY-NNNNNN
     */
    public function generateReference(): string
    {
        $year = now()->year;
        $prefix = "JE-{$year}-";

        $lastNumber = DB::table('journal_entries')
            ->where('reference', 'like', "{$prefix}%")
            ->lockForUpdate()
            ->max(DB::raw('CAST(SUBSTRING(reference, '.(strlen($prefix) + 1).') AS UNSIGNED)'));

        $nextNumber = ($lastNumber ?? 0) + 1;

        return $prefix.str_pad((string) $nextNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Create a draft journal entry with lines.
     *
     * @param  array{
     *     date: string,
     *     description: string,
     *     type: string,
     *     lines: array<int, array{
     *         account_head_id: int,
     *         project_id: int|null,
     *         debit: string,
     *         credit: string,
     *         memo: string|null
     *     }>
     * }  $data
     */
    public function create(array $data, User $user): JournalEntry
    {
        return DB::transaction(function () use ($data, $user) {
            $entry = JournalEntry::create([
                'date' => $data['date'],
                'reference' => $this->generateReference(),
                'description' => $data['description'],
                'type' => $data['type'],
                'status' => JournalEntryStatus::Draft,
                'created_by' => $user->id,
            ]);

            foreach ($data['lines'] as $line) {
                $entry->lines()->create($line);
            }

            return $entry->load('lines');
        });
    }

    /**
     * Update a draft journal entry and its lines.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws EntryAlreadyPostedException
     */
    public function update(JournalEntry $entry, array $data): JournalEntry
    {
        if ($entry->isPosted()) {
            throw new EntryAlreadyPostedException;
        }

        return DB::transaction(function () use ($entry, $data) {
            $entry->update(Arr::except($data, ['lines']));

            if (isset($data['lines'])) {
                $entry->lines()->delete();

                foreach ($data['lines'] as $line) {
                    $entry->lines()->create($line);
                }
            }

            return $entry->load('lines');
        });
    }

    /**
     * Validate invariants and post a journal entry.
     *
     * @throws EntryNotDraftException
     * @throws InsufficientLinesException
     * @throws UnbalancedEntryException
     * @throws InactiveAccountHeadException
     */
    public function post(JournalEntry $entry): void
    {
        DB::transaction(function () use ($entry) {
            $entry->load('lines.accountHead');

            if (! $entry->isDraft()) {
                throw new EntryNotDraftException($entry->status);
            }

            if ($entry->lines->count() < 2) {
                throw new InsufficientLinesException($entry->lines->count());
            }

            foreach ($entry->lines as $line) {
                if (! $line->accountHead->is_active) {
                    throw new InactiveAccountHeadException(
                        $line->accountHead->code,
                        $line->accountHead->name,
                    );
                }
            }

            $totalDebits = '0.00';
            $totalCredits = '0.00';

            foreach ($entry->lines as $line) {
                $totalDebits = bcadd($totalDebits, $line->getRawOriginal('debit') ?? $line->debit, 2);
                $totalCredits = bcadd($totalCredits, $line->getRawOriginal('credit') ?? $line->credit, 2);
            }

            if (bccomp($totalDebits, $totalCredits, 2) !== 0) {
                throw new UnbalancedEntryException($totalDebits, $totalCredits);
            }

            $entry->update(['status' => JournalEntryStatus::Posted]);
        });
    }

    /**
     * Create a reversing entry for a posted journal entry.
     *
     * @throws EntryNotDraftException
     * @throws EntryAlreadyReversedException
     */
    public function reverse(JournalEntry $entry, User $user, string $reason = ''): JournalEntry
    {
        if (! $entry->isPosted()) {
            throw new EntryNotDraftException($entry->status);
        }

        if ($entry->isReversed()) {
            throw new EntryAlreadyReversedException;
        }

        return DB::transaction(function () use ($entry, $user, $reason) {
            $entry->load('lines');

            $description = "Reversal of {$entry->reference}";
            if ($reason !== '') {
                $description .= ": {$reason}";
            }

            $reversal = JournalEntry::create([
                'date' => now()->toDateString(),
                'reference' => $this->generateReference(),
                'description' => $description,
                'type' => $entry->type,
                'status' => JournalEntryStatus::Posted,
                'created_by' => $user->id,
                'reversal_of_id' => $entry->id,
            ]);

            foreach ($entry->lines as $line) {
                $reversal->lines()->create([
                    'account_head_id' => $line->account_head_id,
                    'project_id' => $line->project_id,
                    'debit' => $line->getRawOriginal('credit') ?? $line->credit,
                    'credit' => $line->getRawOriginal('debit') ?? $line->debit,
                    'memo' => $line->memo,
                ]);
            }

            $entry->update(['reversed_by_id' => $reversal->id]);

            return $reversal->load('lines');
        });
    }
}
