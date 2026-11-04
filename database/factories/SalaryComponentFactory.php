<?php

namespace Database\Factories;

use App\Enums\SalaryComponentType;
use App\Models\SalaryComponent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SalaryComponent>
 */
class SalaryComponentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'type' => SalaryComponentType::Earning,
            'sort_order' => fake()->numberBetween(10, 99),
            'is_active' => true,
        ];
    }

    public function deduction(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => SalaryComponentType::Deduction,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
