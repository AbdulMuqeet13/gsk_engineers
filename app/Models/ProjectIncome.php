<?php

namespace App\Models;

use Database\Factories\ProjectIncomeFactory;
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
 * @property int $project_id
 * @property int $income_account_id
 * @property int $deposit_account_id
 * @property string $amount
 * @property Carbon $date
 * @property string|null $received_from
 * @property string $description
 * @property string|null $cheque_number
 * @property int|null $journal_entry_id
 * @property int $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Project $project
 * @property-read AccountHead $incomeAccount
 * @property-read AccountHead $depositAccount
 * @property-read JournalEntry|null $journalEntry
 * @property-read User $creator
 */
#[Fillable([
    'reference', 'project_id', 'income_account_id', 'deposit_account_id', 'amount',
    'date', 'received_from', 'description', 'cheque_number', 'journal_entry_id', 'created_by',
])]
class ProjectIncome extends Model
{
    /** @use HasFactory<ProjectIncomeFactory> */
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
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * @return BelongsTo<AccountHead, $this>
     */
    public function incomeAccount(): BelongsTo
    {
        return $this->belongsTo(AccountHead::class, 'income_account_id');
    }

    /**
     * @return BelongsTo<AccountHead, $this>
     */
    public function depositAccount(): BelongsTo
    {
        return $this->belongsTo(AccountHead::class, 'deposit_account_id');
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
