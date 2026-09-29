<?php

namespace App\Models;

use Database\Factories\AccountTransferFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

/**
 * @property int $id
 * @property string $reference
 * @property int $from_account_id
 * @property int $to_account_id
 * @property int|null $project_id
 * @property string $amount
 * @property Carbon $date
 * @property string $description
 * @property string|null $cheque_number
 * @property int|null $journal_entry_id
 * @property int $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AccountHead $fromAccount
 * @property-read AccountHead $toAccount
 * @property-read Project|null $project
 * @property-read JournalEntry|null $journalEntry
 * @property-read User $creator
 */
#[Fillable([
    'reference', 'from_account_id', 'to_account_id', 'project_id', 'amount',
    'date', 'description', 'cheque_number', 'journal_entry_id', 'created_by',
])]
class AccountTransfer extends Model
{
    /** @use HasFactory<AccountTransferFactory> */
    use HasFactory, LogsActivity;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date:d-m-Y',
            'amount' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<AccountHead, $this>
     */
    public function fromAccount(): BelongsTo
    {
        return $this->belongsTo(AccountHead::class, 'from_account_id');
    }

    /**
     * @return BelongsTo<AccountHead, $this>
     */
    public function toAccount(): BelongsTo
    {
        return $this->belongsTo(AccountHead::class, 'to_account_id');
    }

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * @return BelongsTo<JournalEntry, $this>
     */
    public function journalEntry(): BelongsTo
    {
        return $this->belongsTo(JournalEntry::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isReversed(): bool
    {
        return $this->journalEntry !== null && $this->journalEntry->isReversed();
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
