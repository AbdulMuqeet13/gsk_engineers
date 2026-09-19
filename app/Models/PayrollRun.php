<?php

namespace App\Models;

use App\Enums\PayrollStatus;
use Database\Factories\PayrollRunFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

/**
 * @property int $id
 * @property string $reference
 * @property Carbon $period_start
 * @property Carbon $period_end
 * @property string|null $description
 * @property string $total_amount
 * @property PayrollStatus $status
 * @property int $payment_account_id
 * @property int|null $journal_entry_id
 * @property int $created_by
 * @property int|null $approved_by
 * @property Carbon|null $approved_at
 * @property string|null $rejection_reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Payslip> $payslips
 * @property-read AccountHead $paymentAccount
 * @property-read JournalEntry|null $journalEntry
 * @property-read User $creator
 * @property-read User|null $approver
 */
#[Fillable([
    'reference', 'period_start', 'period_end', 'description', 'total_amount',
    'status', 'payment_account_id', 'journal_entry_id',
    'created_by', 'approved_by', 'approved_at', 'rejection_reason',
])]
class PayrollRun extends Model
{
    /** @use HasFactory<PayrollRunFactory> */
    use HasFactory, LogsActivity;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'total_amount' => 'decimal:2',
            'status' => PayrollStatus::class,
            'approved_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<Payslip, $this>
     */
    public function payslips(): HasMany
    {
        return $this->hasMany(Payslip::class);
    }

    /**
     * @return BelongsTo<AccountHead, $this>
     */
    public function paymentAccount(): BelongsTo
    {
        return $this->belongsTo(AccountHead::class, 'payment_account_id');
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
     * @param  Builder<PayrollRun>  $query
     */
    public function scopeDraft(Builder $query): void
    {
        $query->where('status', PayrollStatus::Draft);
    }

    /**
     * @param  Builder<PayrollRun>  $query
     */
    public function scopeSubmitted(Builder $query): void
    {
        $query->where('status', PayrollStatus::Submitted);
    }

    public function isDraft(): bool
    {
        return $this->status === PayrollStatus::Draft;
    }

    public function isSubmitted(): bool
    {
        return $this->status === PayrollStatus::Submitted;
    }

    public function isApproved(): bool
    {
        return $this->status === PayrollStatus::Approved;
    }

    public function isRejected(): bool
    {
        return $this->status === PayrollStatus::Rejected;
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
