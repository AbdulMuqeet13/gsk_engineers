<?php

namespace Database\Factories;

use App\Models\AccountHead;
use App\Models\Employee;
use App\Models\SecurityRefund;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SecurityRefund>
 */
class SecurityRefundFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'amount' => fake()->randomFloat(2, 1000, 20000),
            'date' => fake()->date(),
            'payment_account_id' => AccountHead::factory()->asset(),
            'journal_entry_id' => null,
            'remarks' => null,
            'created_by' => User::factory(),
        ];
    }
}
