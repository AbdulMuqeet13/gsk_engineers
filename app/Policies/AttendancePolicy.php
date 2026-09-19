<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\Attendance;
use App\Models\User;

class AttendancePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::AttendanceView->value);
    }

    public function view(User $user, Attendance $attendance): bool
    {
        return $user->can(PermissionEnum::AttendanceView->value);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::AttendanceManage->value);
    }

    public function update(User $user, Attendance $attendance): bool
    {
        return $user->can(PermissionEnum::AttendanceManage->value);
    }

    public function delete(User $user, Attendance $attendance): bool
    {
        return $user->can(PermissionEnum::AttendanceManage->value);
    }
}
