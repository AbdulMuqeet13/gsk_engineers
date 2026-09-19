<?php

namespace Database\Factories;

use App\Models\AccountHead;
use App\Models\InterProjectTransfer;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InterProjectTransfer>
 */
class InterProjectTransferFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference' => 'TRF-'.fake()->unique()->numerify('######'),
            'from_project_id' => Project::factory(),
            'to_project_id' => Project::factory(),
            'from_account_id' => AccountHead::factory()->asset(),
            'to_account_id' => AccountHead::factory()->asset(),
            'amount' => fake()->randomFloat(2, 10000, 500000),
            'date' => fake()->date(),
            'purpose' => fake()->sentence(),
            'journal_entry_id' => null,
            'created_by' => User::factory(),
        ];
    }
}
