<?php

namespace App\Actions\Attendance;

use App\Models\Attendance;

class DeleteAttendanceAction
{
    public function execute(Attendance $attendance): void
    {
        $attendance->delete();
    }
}
