<?php

namespace App\Models;

use App\Concerns\HasAttachments;
use App\Enums\EmployeeType;
use App\Enums\PayrollStatus;
use Database\Factories\EmployeeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
 * @property string $cnic
 * @property string $address
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Project|null $project
 * @property-read Collection<int, ProjectAssignment> $assignments
 * @property-read Collection<int, Payslip> $payslips
 * @property-read Collection<int, EmployeeFingerprint> $fingerprints
 * @property-read Collection<int, EmployeeSalary> $salaries
 * @property-read EmployeeSalary|null $currentSalary
 * @property-read Collection<int, SecurityRefund> $securityRefunds
 */
#[Fillable(['name', 'email', 'phone', 'type', 'project_id', 'designation', 'department', 'date_of_joining', 'cnic', 'address', 'is_active'])]
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
     * @return HasMany<EmployeeFingerprint, $this>
     */
    public function fingerprints(): HasMany
    {
        return $this->hasMany(EmployeeFingerprint::class);
    }

    /**
     * Salary history, newest first.
     *
     * @return HasMany<EmployeeSalary, $this>
     */
    public function salaries(): HasMany
    {
        return $this->hasMany(EmployeeSalary::class)
            ->orderByDesc('effective_date')
            ->orderByDesc('id');
    }

    /**
     * The salary record in effect today (future-dated increments excluded).
     *
     * @return HasOne<EmployeeSalary, $this>
     */
    public function currentSalary(): HasOne
    {
        return $this->hasOne(EmployeeSalary::class)->ofMany(
            ['effective_date' => 'max', 'id' => 'max'],
            fn (Builder $query) => $query->where('effective_date', '<=', now()->toDateString()),
        );
    }

    /**
     * @return HasMany<SecurityRefund, $this>
     */
    public function securityRefunds(): HasMany
    {
        return $this->hasMany(SecurityRefund::class);
    }

    /**
     * The latest salary record effective on or before the given date.
     */
    public function salaryEffectiveOn(string $date): ?EmployeeSalary
    {
        return $this->hasMany(EmployeeSalary::class)
            ->where('effective_date', '<=', $date)
            ->orderByDesc('effective_date')
            ->orderByDesc('id')
            ->first();
    }

    /**
     * Security deducted in approved payroll runs minus security refunded.
     */
    public function securityBalance(): string
    {
        $deducted = (string) $this->payslips()
            ->whereHas('payrollRun', fn (Builder $query) => $query->where('status', PayrollStatus::Approved))
            ->sum('security_amount');

        $refunded = (string) $this->securityRefunds()->sum('amount');

        return bcsub($deducted, $refunded, 2);
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
