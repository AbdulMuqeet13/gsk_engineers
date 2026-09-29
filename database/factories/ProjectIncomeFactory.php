<?php

namespace Database\Factories;

use App\Enums\AccountType;
use App\Enums\NormalBalance;
use App\Models\AccountHead;
use App\Models\Project;
use App\Models\ProjectIncome;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectIncome>
 */
class ProjectIncomeFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference' => 'INC-'.fake()->unique()->numerify('######'),
            'project_id' => Project::factory(),
            'income_account_id' => AccountHead::factory()->state([
                'type' => AccountType::Income,
                'normal_balance' => NormalBalance::Credit,
            ]),
            'deposit_account_id' => AccountHead::factory()->asset(),
            'amount' => fake()->randomFloat(2, 10000, 500000),
            'date' => fake()->date(),
            'received_from' => fake()->company(),
            'description' => fake()->sentence(),
            'journal_entry_id' => null,
            'created_by' => User::factory(),
        ];
    }
}
