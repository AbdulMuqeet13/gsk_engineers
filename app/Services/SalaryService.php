<?php

namespace App\Services;

use App\Exceptions\Salaries\OnlySalaryRecordException;
use App\Exceptions\Salaries\SalaryRecordInUseException;
use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SalaryService
{
    /**
     * Record a new salary for an employee (initial, increment, decrement or revision).
     *
     * The gross salary is the sum of the component amounts. Components with a
     * zero amount are not stored.
     *
     * @param  array{
     *     effective_date: string,
     *     change_type: string,
     *     components: array<int, array{salary_component_id: int, amount: string|null}>,
     *     tax_amount?: string|null,
     *     security_amount?: string|null,
     *     remarks?: string|null,
     * }  $data
     */
    public function record(Employee $employee, array $data, ?User $user): EmployeeSalary
    {
        return DB::transaction(function () use ($employee, $data, $user) {
            $components = collect($data['components'])
                ->filter(fn (array $component) => is_numeric($component['amount'] ?? null)
                    && bccomp((string) $component['amount'], '0', 2) === 1);

            $grossSalary = $components->reduce(
                fn (string $total, array $component) => bcadd($total, (string) $component['amount'], 2),
                '0.00',
            );

            $salary = $employee->salaries()->create([
                'effective_date' => $data['effective_date'],
                'change_type' => $data['change_type'],
                'gross_salary' => $grossSalary,
                'tax_amount' => $data['tax_amount'] ?? '0.00',
                'security_amount' => $data['security_amount'] ?? '0.00',
                'remarks' => $data['remarks'] ?? null,
                'created_by' => $user?->id,
            ]);

            foreach ($components as $component) {
                $salary->components()->create([
                    'salary_component_id' => $component['salary_component_id'],
                    'amount' => $component['amount'],
                ]);
            }

            return $salary->load('components.salaryComponent');
        });
    }

    /**
     * Delete a salary record that has not been used in payroll.
     *
     * @throws SalaryRecordInUseException
     * @throws OnlySalaryRecordException
     */
    public function delete(EmployeeSalary $salary): void
    {
        if ($salary->payslips()->exists()) {
            throw new SalaryRecordInUseException;
        }

        if (EmployeeSalary::where('employee_id', $salary->employee_id)->count() <= 1) {
            throw new OnlySalaryRecordException;
        }

        $salary->delete();
    }
}
