<?php

namespace App\Models;

use App\Concerns\HasAttachments;
use App\Enums\EmployeeType;
use Database\Factories\EmployeeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

/**
 * @property int $id
 * @property string $name
 * @property string|null $email
 * @property string|null $phone
 * @property EmployeeType $type
 * @property int|null $project_id
 * @property string $designation
 * @property string $department
 * @property Carbon $date_of_joining
 * @property string $salary
 * @property string $cnic
 * @property string $address
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Project|null $project
 * @property-read Collection<int, ProjectAssignment> $assignments
 * @property-read Collection<int, Payslip> $payslips
 */
#[Fillable(['name', 'email', 'phone', 'type', 'project_id', 'designation', 'department', 'date_of_joining', 'salary', 'cnic', 'address', 'is_active'])]
class Employee extends Model
{
    /** @use HasFactory<EmployeeFactory> */
    use HasAttachments, HasFactory, LogsActivity, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => EmployeeType::class,
            'date_of_joining' => 'date:d-m-Y',
            'salary' => 'decimal:2',
            'is_active' => 'boolean',
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
     * @return HasMany<ProjectAssignment, $this>
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(ProjectAssignment::class);
    }

    /**
     * @return HasMany<Payslip, $this>
     */
    public function payslips(): HasMany
    {
        return $this->hasMany(Payslip::class);
    }

    /**
     * @param  Builder<Employee>  $query
     */
    public function scopeInternal(Builder $query): void
    {
        $query->where('type', EmployeeType::Internal);
    }

    /**
     * @param  Builder<Employee>  $query
     */
    public function scopeProjectBased(Builder $query): void
    {
        $query->where('type', EmployeeType::Project);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
