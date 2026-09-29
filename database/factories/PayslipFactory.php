<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\PayrollRun;
use App\Models\Payslip;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payslip>
 */
class PayslipFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $basicSalary = fake()->randomFloat(2, 20000, 100000);

        return [
            'payroll_run_id' => PayrollRun::factory(),
            'employee_id' => Employee::factory(),
            'employee_salary_id' => null,
            'salary_amount' => $basicSalary,
            'allowances_amount' => 0,
            'gross_salary' => $basicSalary,
            'tax_amount' => 0,
            'security_amount' => 0,
            'deductions' => 0,
            'net_salary' => $basicSalary,
            'days_worked' => 26,
            'days_absent' => 0,
            'notes' => null,
        ];
    }

    public function withDeductions(float $deductions = 5000): static
    {
        return $this->state(function (array $attributes) use ($deductions) {
            $basicSalary = $attributes['gross_salary'];

            return [
                'deductions' => $deductions,
                'net_salary' => bcsub((string) $basicSalary, (string) $deductions, 2),
            ];
        });
    }
}
