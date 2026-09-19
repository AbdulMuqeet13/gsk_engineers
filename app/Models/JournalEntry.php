<?php

namespace App\Models;

use App\Enums\JournalEntryStatus;
use App\Enums\JournalEntryType;
use Database\Factories\JournalEntryFactory;
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
 * @property Carbon $date
 * @property string $reference
 * @property string $description
 * @property JournalEntryType $type
 * @property JournalEntryStatus $status
 * @property int $created_by
 * @property int|null $reversed_by_id
 * @property int|null $reversal_of_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $creator
 * @property-read Collection<int, JournalLine> $lines
 * @property-read int|null $lines_count
 * @property-read JournalEntry|null $reversedBy
 * @property-read JournalEntry|null $reversalOf
 */
#[Fillable(['date', 'reference', 'description', 'type', 'status', 'created_by', 'reversed_by_id', 'reversal_of_id'])]
class JournalEntry extends Model
{
    /** @use HasFactory<JournalEntryFactory> */
    use HasFactory, LogsActivity;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
            'type' => JournalEntryType::class,
            'status' => JournalEntryStatus::class,
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return HasMany<JournalLine, $this>
     */
    public function lines(): HasMany
    {
        return $this->hasMany(JournalLine::class);
    }

    /**
     * @return BelongsTo<JournalEntry, $this>
     */
    public function reversedBy(): BelongsTo
    {
        return $this->belongsTo(self::class, 'reversed_by_id');
    }

    /**
     * @return BelongsTo<JournalEntry, $this>
     */
    public function reversalOf(): BelongsTo
    {
        return $this->belongsTo(self::class, 'reversal_of_id');
    }

    /**
     * @param  Builder<JournalEntry>  $query
     */
    public function scopePosted(Builder $query): void
    {
        $query->where('status', JournalEntryStatus::Posted);
    }

    /**
     * @param  Builder<JournalEntry>  $query
     */
    public function scopeDraft(Builder $query): void
    {
        $query->where('status', JournalEntryStatus::Draft);
    }

    /**
     * @param  Builder<JournalEntry>  $query
     */
    public function scopeDateRange(Builder $query, ?Carbon $from, ?Carbon $to): void
    {
        $query->when($from, fn (Builder $q) => $q->where('date', '>=', $from))
            ->when($to, fn (Builder $q) => $q->where('date', '<=', $to));
    }

    /**
     * @param  Builder<JournalEntry>  $query
     */
    public function scopeForProject(Builder $query, int $projectId): void
    {
        $query->whereHas('lines', fn (Builder $q) => $q->where('project_id', $projectId));
    }

    public function isPosted(): bool
    {
        return $this->status === JournalEntryStatus::Posted;
    }

    public function isDraft(): bool
    {
        return $this->status === JournalEntryStatus::Draft;
    }

    public function isReversed(): bool
    {
        return $this->reversed_by_id !== null;
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
