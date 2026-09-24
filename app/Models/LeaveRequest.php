<?php

namespace App\Models;

use App\Enums\LeaveStatus;
use App\Enums\LeaveType;
use Database\Factories\LeaveRequestFactory;
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
 * @property int $employee_id
 * @property LeaveType $leave_type
 * @property Carbon $start_date
 * @property Carbon $end_date
 * @property int $days
 * @property string $reason
 * @property LeaveStatus $status
 * @property int|null $approved_by
 * @property Carbon|null $approved_at
 * @property string|null $rejection_reason
 * @property int $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Employee $employee
 * @property-read User $creator
 * @property-read User|null $approver
 */
#[Fillable([
    'employee_id', 'leave_type', 'start_date', 'end_date', 'days',
    'reason', 'status', 'approved_by', 'approved_at', 'rejection_reason', 'created_by',
])]
class LeaveRequest extends Model
{
    /** @use HasFactory<LeaveRequestFactory> */
    use HasFactory, LogsActivity;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date:d-m-Y',
            'end_date' => 'date:d-m-Y',
            'leave_type' => LeaveType::class,
            'status' => LeaveStatus::class,
            'approved_at' => 'datetime:d-m-Y',
        ];
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
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
     * @param  Builder<LeaveRequest>  $query
     */
    public function scopePending(Builder $query): void
    {
        $query->where('status', LeaveStatus::Pending);
    }

    /**
     * @param  Builder<LeaveRequest>  $query
     */
    public function scopeApproved(Builder $query): void
    {
        $query->where('status', LeaveStatus::Approved);
    }

    /**
     * @param  Builder<LeaveRequest>  $query
     */
    public function scopeForEmployee(Builder $query, int $employeeId): void
    {
        $query->where('employee_id', $employeeId);
    }

    /**
     * @param  Builder<LeaveRequest>  $query
     */
    public function scopeDateRange(Builder $query, ?Carbon $from, ?Carbon $to): void
    {
        $query->when($from, fn (Builder $q) => $q->where('start_date', '>=', $from))
            ->when($to, fn (Builder $q) => $q->where('end_date', '<=', $to));
    }

    public function isPending(): bool
    {
        return $this->status === LeaveStatus::Pending;
    }

    public function isApproved(): bool
    {
        return $this->status === LeaveStatus::Approved;
    }

    public function isRejected(): bool
    {
        return $this->status === LeaveStatus::Rejected;
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
