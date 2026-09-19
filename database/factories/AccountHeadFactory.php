<?php

namespace Database\Factories;

use App\Enums\AccountType;
use App\Enums\NormalBalance;
use App\Models\AccountHead;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AccountHead>
 */
class AccountHeadFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(AccountType::cases());

        return [
            'code' => fake()->unique()->numerify('####'),
            'name' => fake()->words(2, true),
            'type' => $type,
            'normal_balance' => in_array($type, [AccountType::Asset, AccountType::Expense])
                ? NormalBalance::Debit
                : NormalBalance::Credit,
            'parent_id' => null,
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function asset(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => AccountType::Asset,
            'normal_balance' => NormalBalance::Debit,
        ]);
    }

    public function expense(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => AccountType::Expense,
            'normal_balance' => NormalBalance::Debit,
        ]);
    }

    public function withParent(AccountHead $parent): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => $parent->id,
            'type' => $parent->type,
            'normal_balance' => $parent->normal_balance,
        ]);
    }
}
