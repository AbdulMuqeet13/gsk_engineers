<?php

namespace App\Models;

use Database\Factories\PayslipFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
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
 * @property int $payroll_run_id
 * @property int $employee_id
 * @property int|null $employee_salary_id
 * @property string $salary_amount
 * @property string $allowances_amount
 * @property string $gross_salary
 * @property string $tax_amount
 * @property string $security_amount
 * @property string $deductions
 * @property string $net_salary
 * @property int $days_worked
 * @property int $days_absent
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read PayrollRun $payrollRun
 * @property-read Employee $employee
 * @property-read EmployeeSalary|null $employeeSalary
 * @property-read Collection<int, PayslipItem> $items
 */
#[Fillable([
    'payroll_run_id', 'employee_id', 'employee_salary_id', 'salary_amount',
    'allowances_amount', 'gross_salary', 'tax_amount', 'security_amount',
    'deductions', 'net_salary', 'days_worked', 'days_absent', 'notes',
])]
class Payslip extends Model
{
    /** @use HasFactory<PayslipFactory> */
    use HasFactory, LogsActivity;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'salary_amount' => 'decimal:2',
            'allowances_amount' => 'decimal:2',
            'gross_salary' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'security_amount' => 'decimal:2',
            'deductions' => 'decimal:2',
            'net_salary' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<PayrollRun, $this>
     */
    public function payrollRun(): BelongsTo
    {
        return $this->belongsTo(PayrollRun::class);
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * @return BelongsTo<EmployeeSalary, $this>
     */
    public function employeeSalary(): BelongsTo
    {
        return $this->belongsTo(EmployeeSalary::class);
    }

    /**
     * @return HasMany<PayslipItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(PayslipItem::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
