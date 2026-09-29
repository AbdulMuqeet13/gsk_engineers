<?php

namespace Database\Factories;

use App\Enums\SalaryChangeType;
use App\Models\Employee;
use App\Models\EmployeeSalary;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeeSalary>
 */
class EmployeeSalaryFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'effective_date' => fake()->date(),
            'change_type' => SalaryChangeType::Initial,
            'gross_salary' => fake()->randomFloat(2, 30000, 200000),
            'tax_amount' => 0,
            'security_amount' => 0,
            'remarks' => null,
            'created_by' => null,
        ];
    }
}
