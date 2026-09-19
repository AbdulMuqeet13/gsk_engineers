<?php

namespace Database\Factories;

use App\Enums\EmployeeType;
use App\Models\Employee;
use App\Models\Project;
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
            'salary' => fake()->randomFloat(2, 30000, 200000),
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
}
