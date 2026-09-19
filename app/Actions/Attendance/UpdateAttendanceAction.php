<?php

namespace App\Actions\Attendance;

use App\Models\Attendance;

class UpdateAttendanceAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Attendance $attendance, array $data): Attendance
    {
        $attendance->update($data);

        return $attendance;
    }
}
