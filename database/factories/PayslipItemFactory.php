<?php

namespace Database\Factories;

use App\Enums\PayslipItemType;
use App\Models\Payslip;
use App\Models\PayslipItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PayslipItem>
 */
class PayslipItemFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'payslip_id' => Payslip::factory(),
            'type' => PayslipItemType::Component,
            'name' => 'Basic Salary',
            'amount' => fake()->randomFloat(2, 10000, 100000),
            'project_id' => null,
        ];
    }
}
