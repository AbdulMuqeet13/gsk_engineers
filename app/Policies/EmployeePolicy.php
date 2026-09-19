<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\Employee;
use App\Models\User;

class EmployeePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::EmployeesView->value);
    }

    public function view(User $user, Employee $employee): bool
    {
        return $user->can(PermissionEnum::EmployeesView->value);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::EmployeesCreate->value);
    }

    public function update(User $user, Employee $employee): bool
    {
        return $user->can(PermissionEnum::EmployeesUpdate->value);
    }

    public function delete(User $user, Employee $employee): bool
    {
        return $user->can(PermissionEnum::EmployeesDelete->value);
    }
}
