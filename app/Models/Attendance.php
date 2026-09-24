<?php

namespace App\Models;

use App\Enums\AttendanceStatus;
use Database\Factories\AttendanceFactory;
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
 * @property Carbon $date
 * @property AttendanceStatus $status
 * @property string|null $check_in
 * @property string|null $check_out
 * @property string|null $notes
 * @property int $marked_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Employee $employee
 * @property-read User $marker
 */
#[Fillable([
    'employee_id', 'date', 'status', 'check_in', 'check_out', 'notes', 'marked_by',
])]
class Attendance extends Model
{
    /** @use HasFactory<AttendanceFactory> */
    use HasFactory, LogsActivity;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date:d-m-Y',
            'status' => AttendanceStatus::class,
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
    public function marker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'marked_by');
    }

    /**
     * @param  Builder<Attendance>  $query
     */
    public function scopeForDate(Builder $query, Carbon|string $date): void
    {
        $query->where('date', $date);
    }

    /**
     * @param  Builder<Attendance>  $query
     */
    public function scopeForEmployee(Builder $query, int $employeeId): void
    {
        $query->where('employee_id', $employeeId);
    }

    /**
     * @param  Builder<Attendance>  $query
     */
    public function scopeDateRange(Builder $query, ?Carbon $from, ?Carbon $to): void
    {
        $query->when($from, fn (Builder $q) => $q->where('date', '>=', $from))
            ->when($to, fn (Builder $q) => $q->where('date', '<=', $to));
    }

    /**
     * @param  Builder<Attendance>  $query
     */
    public function scopeForProject(Builder $query, int $projectId): void
    {
        $query->whereHas('employee', fn (Builder $q) => $q->where('project_id', $projectId));
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
