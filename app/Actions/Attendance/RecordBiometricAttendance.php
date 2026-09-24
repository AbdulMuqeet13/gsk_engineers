<?php

namespace App\Actions\Attendance;

use App\Enums\AttendanceSource;
use App\Enums\AttendanceStatus;
use App\Models\Attendance;

class RecordBiometricAttendance
{
    /**
     * Record a biometric attendance punch for an employee.
     *
     * First punch of the day creates a new record (check_in).
     * Second punch sets check_out.
     * Later punches update check_out if the time is later.
     */
    public function execute(int $employeeId, string $date, string $time): Attendance
    {
        $existing = Attendance::where('employee_id', $employeeId)
            ->where('date', $date)
            ->first();

        if (! $existing) {
            return Attendance::create([
                'employee_id' => $employeeId,
                'date' => $date,
                'status' => AttendanceStatus::Present,
                'check_in' => $time,
                'source' => AttendanceSource::Biometric,
                'marked_by' => null,
            ]);
        }

        if ($existing->check_out === null) {
            $existing->update(['check_out' => $time]);
        } elseif ($time > $existing->check_out) {
            $existing->update(['check_out' => $time]);
        }

        return $existing;
    }
}
