<?php

namespace Database\Factories;

use App\Models\AccountHead;
use App\Models\AccountTransfer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AccountTransfer>
 */
class AccountTransferFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference' => 'ACT-'.fake()->unique()->numerify('######'),
            'from_account_id' => AccountHead::factory()->asset(),
            'to_account_id' => AccountHead::factory()->asset(),
            'project_id' => null,
            'amount' => fake()->randomFloat(2, 1000, 500000),
            'date' => fake()->date(),
            'description' => fake()->sentence(),
            'journal_entry_id' => null,
            'created_by' => User::factory(),
        ];
    }
}
