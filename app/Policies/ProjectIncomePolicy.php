<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\ProjectIncome;
use App\Models\User;

class ProjectIncomePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::IncomesView->value);
    }

    public function view(User $user, ProjectIncome $income): bool
    {
        return $user->can(PermissionEnum::IncomesView->value);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::IncomesCreate->value);
    }

    public function reverse(User $user, ProjectIncome $income): bool
    {
        return $user->can(PermissionEnum::IncomesCreate->value);
    }
}
