<?php

namespace App\Actions\Attendance;

use App\Models\Attendance;

class CreateAttendanceAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): Attendance
    {
        return Attendance::create($data);
    }
}
