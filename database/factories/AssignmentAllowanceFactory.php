<?php

namespace Database\Factories;

use App\Models\AssignmentAllowance;
use App\Models\ProjectAssignment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AssignmentAllowance>
 */
class AssignmentAllowanceFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_assignment_id' => ProjectAssignment::factory(),
            'name' => fake()->randomElement(['Site Allowance', 'Fuel Allowance', 'Hardship Allowance']),
            'amount' => fake()->randomFloat(2, 1000, 20000),
        ];
    }
}
