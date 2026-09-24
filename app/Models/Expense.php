<?php

namespace App\Models;

use App\Concerns\HasAttachments;
use App\Enums\ExpenseStatus;
use Database\Factories\ExpenseFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

/**
 * @property int $id
 * @property string $reference
 * @property Carbon $date
 * @property string $description
 * @property string $amount
 * @property ExpenseStatus $status
 * @property int $account_head_id
 * @property int $payment_account_id
 * @property int|null $project_id
 * @property int|null $journal_entry_id
 * @property int $created_by
 * @property int|null $approved_by
 * @property Carbon|null $approved_at
 * @property string|null $rejection_reason
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AccountHead $accountHead
 * @property-read AccountHead $paymentAccount
 * @property-read Project|null $project
 * @property-read JournalEntry|null $journalEntry
 * @property-read User $creator
 * @property-read User|null $approver
 */
#[Fillable([
    'reference', 'date', 'description', 'amount', 'status',
    'account_head_id', 'payment_account_id', 'project_id', 'journal_entry_id',
    'created_by', 'approved_by', 'approved_at', 'rejection_reason', 'notes',
])]
class Expense extends Model
{
    /** @use HasFactory<ExpenseFactory> */
    use HasAttachments, HasFactory, LogsActivity;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date:d-m-Y',
            'amount' => 'decimal:2',
            'status' => ExpenseStatus::class,
            'approved_at' => 'datetime:d-m-Y',
        ];
    }

    /**
     * @return BelongsTo<AccountHead, $this>
     */
    public function accountHead(): BelongsTo
    {
        return $this->belongsTo(AccountHead::class);
    }

    /**
     * @return BelongsTo<AccountHead, $this>
     */
    public function paymentAccount(): BelongsTo
    {
        return $this->belongsTo(AccountHead::class, 'payment_account_id');
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

    /**
     * @return BelongsTo<User, $this>
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * @param  Builder<Expense>  $query
     */
    public function scopeDraft(Builder $query): void
    {
        $query->where('status', ExpenseStatus::Draft);
    }

    /**
     * @param  Builder<Expense>  $query
     */
    public function scopeSubmitted(Builder $query): void
    {
        $query->where('status', ExpenseStatus::Submitted);
    }

    /**
     * @param  Builder<Expense>  $query
     */
    public function scopeApproved(Builder $query): void
    {
        $query->where('status', ExpenseStatus::Approved);
    }

    /**
     * @param  Builder<Expense>  $query
     */
    public function scopeRejected(Builder $query): void
    {
        $query->where('status', ExpenseStatus::Rejected);
    }

    /**
     * @param  Builder<Expense>  $query
     */
    public function scopeDateRange(Builder $query, ?Carbon $from, ?Carbon $to): void
    {
        $query->when($from, fn (Builder $q) => $q->where('date', '>=', $from))
            ->when($to, fn (Builder $q) => $q->where('date', '<=', $to));
    }

    /**
     * @param  Builder<Expense>  $query
     */
    public function scopeForProject(Builder $query, int $projectId): void
    {
        $query->where('project_id', $projectId);
    }

    public function isDraft(): bool
    {
        return $this->status === ExpenseStatus::Draft;
    }

    public function isSubmitted(): bool
    {
        return $this->status === ExpenseStatus::Submitted;
    }

    public function isApproved(): bool
    {
        return $this->status === ExpenseStatus::Approved;
    }

    public function isRejected(): bool
    {
        return $this->status === ExpenseStatus::Rejected;
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
