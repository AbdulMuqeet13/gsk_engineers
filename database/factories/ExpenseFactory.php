<?php

namespace Database\Factories;

use App\Enums\ExpenseStatus;
use App\Models\AccountHead;
use App\Models\Expense;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Expense>
 */
class ExpenseFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference' => 'EXP-'.fake()->unique()->numerify('######'),
            'date' => fake()->date(),
            'description' => fake()->sentence(),
            'amount' => fake()->randomFloat(2, 100, 50000),
            'status' => ExpenseStatus::Draft,
            'account_head_id' => AccountHead::factory()->expense(),
            'payment_account_id' => AccountHead::factory()->asset(),
            'project_id' => null,
            'journal_entry_id' => null,
            'created_by' => User::factory(),
            'approved_by' => null,
            'approved_at' => null,
            'rejection_reason' => null,
            'notes' => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(['status' => ExpenseStatus::Draft]);
    }

    public function submitted(): static
    {
        return $this->state(['status' => ExpenseStatus::Submitted]);
    }

    public function approved(): static
    {
        return $this->state([
            'status' => ExpenseStatus::Approved,
            'approved_by' => User::factory(),
            'approved_at' => now(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state([
            'status' => ExpenseStatus::Rejected,
            'approved_by' => User::factory(),
            'approved_at' => now(),
            'rejection_reason' => fake()->sentence(),
        ]);
    }

    public function forProject(Project $project): static
    {
        return $this->state(['project_id' => $project->id]);
    }
}
