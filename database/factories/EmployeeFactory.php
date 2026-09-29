<?php

namespace Database\Factories;

use App\Enums\EmployeeType;
use App\Enums\SalaryChangeType;
use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\Project;
use App\Models\SalaryComponent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'type' => EmployeeType::Internal,
            'project_id' => null,
            'designation' => fake()->jobTitle(),
            'department' => fake()->randomElement(['Engineering', 'Finance', 'HR', 'Operations', 'Admin']),
            'date_of_joining' => fake()->date(),
            'cnic' => fake()->numerify('#####-#######-#'),
            'address' => fake()->address(),
            'is_active' => true,
        ];
    }

    public function internal(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => EmployeeType::Internal,
            'project_id' => null,
        ]);
    }

    public function projectBased(Project $project): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => EmployeeType::Project,
            'project_id' => $project->id,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Give the employee an initial salary record with a single Basic Salary component.
     */
    public function withSalary(
        string $grossSalary = '50000.00',
        string $taxAmount = '0.00',
        string $securityAmount = '0.00',
        string $effectiveDate = '2020-01-01',
    ): static {
        return $this->afterCreating(function (Employee $employee) use ($grossSalary, $taxAmount, $securityAmount, $effectiveDate) {
            $salary = EmployeeSalary::factory()->for($employee)->create([
                'effective_date' => $effectiveDate,
                'change_type' => SalaryChangeType::Initial,
                'gross_salary' => $grossSalary,
                'tax_amount' => $taxAmount,
                'security_amount' => $securityAmount,
            ]);

            $salary->components()->create([
                'salary_component_id' => SalaryComponent::firstOrCreate(['name' => 'Basic Salary'])->id,
                'amount' => $grossSalary,
            ]);
        });
    }
}
