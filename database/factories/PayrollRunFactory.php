<?php

namespace Database\Factories;

use App\Enums\PayrollStatus;
use App\Models\AccountHead;
use App\Models\PayrollRun;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PayrollRun>
 */
class PayrollRunFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference' => 'PR-'.fake()->unique()->numerify('######'),
            'period_start' => now()->startOfMonth(),
            'period_end' => now()->endOfMonth(),
            'description' => null,
            'total_amount' => 0,
            'status' => PayrollStatus::Draft,
            'payment_account_id' => AccountHead::factory()->asset(),
            'journal_entry_id' => null,
            'created_by' => User::factory(),
            'approved_by' => null,
            'approved_at' => null,
            'rejection_reason' => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(['status' => PayrollStatus::Draft]);
    }

    public function submitted(): static
    {
        return $this->state(['status' => PayrollStatus::Submitted]);
    }

    public function approved(): static
    {
        return $this->state([
            'status' => PayrollStatus::Approved,
            'approved_by' => User::factory(),
            'approved_at' => now(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state([
            'status' => PayrollStatus::Rejected,
            'approved_by' => User::factory(),
            'approved_at' => now(),
            'rejection_reason' => fake()->sentence(),
        ]);
    }
}
