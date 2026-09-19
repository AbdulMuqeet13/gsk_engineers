<?php

namespace Database\Factories;

use App\Enums\AttendanceStatus;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'date' => fake()->date(),
            'status' => AttendanceStatus::Present,
            'check_in' => '09:00',
            'check_out' => '17:00',
            'notes' => null,
            'marked_by' => User::factory(),
        ];
    }

    public function present(): static
    {
        return $this->state([
            'status' => AttendanceStatus::Present,
            'check_in' => '09:00',
            'check_out' => '17:00',
        ]);
    }

    public function absent(): static
    {
        return $this->state([
            'status' => AttendanceStatus::Absent,
            'check_in' => null,
            'check_out' => null,
        ]);
    }

    public function halfDay(): static
    {
        return $this->state([
            'status' => AttendanceStatus::HalfDay,
            'check_in' => '09:00',
            'check_out' => '13:00',
        ]);
    }

    public function onLeave(): static
    {
        return $this->state([
            'status' => AttendanceStatus::Leave,
            'check_in' => null,
            'check_out' => null,
        ]);
    }
}
