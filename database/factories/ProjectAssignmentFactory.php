<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Project;
use App\Models\ProjectAssignment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectAssignment>
 */
class ProjectAssignmentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'project_id' => Project::factory(),
            'role' => fake()->randomElement(['Site Engineer', 'Surveyor', 'Foreman', 'Safety Officer', 'Project Lead']),
            'allocation_percent' => 100.00,
        ];
    }
}
