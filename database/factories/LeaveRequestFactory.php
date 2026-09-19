<?php

namespace Database\Factories;

use App\Enums\LeaveStatus;
use App\Enums\LeaveType;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LeaveRequest>
 */
class LeaveRequestFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('now', '+1 month');
        $endDate = (clone $startDate)->modify('+'.fake()->numberBetween(0, 5).' days');

        return [
            'employee_id' => Employee::factory(),
            'leave_type' => LeaveType::Annual,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'days' => $startDate->diff($endDate)->days + 1,
            'reason' => fake()->sentence(),
            'status' => LeaveStatus::Pending,
            'approved_by' => null,
            'approved_at' => null,
            'rejection_reason' => null,
            'created_by' => User::factory(),
        ];
    }

    public function pending(): static
    {
        return $this->state(['status' => LeaveStatus::Pending]);
    }

    public function approved(): static
    {
        return $this->state([
            'status' => LeaveStatus::Approved,
            'approved_by' => User::factory(),
            'approved_at' => now(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state([
            'status' => LeaveStatus::Rejected,
            'approved_by' => User::factory(),
            'approved_at' => now(),
            'rejection_reason' => fake()->sentence(),
        ]);
    }

    public function sick(): static
    {
        return $this->state(['leave_type' => LeaveType::Sick]);
    }

    public function casual(): static
    {
        return $this->state(['leave_type' => LeaveType::Casual]);
    }

    public function unpaid(): static
    {
        return $this->state(['leave_type' => LeaveType::Unpaid]);
    }
}
