<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\InterProjectTransfer;
use App\Models\User;

class InterProjectTransferPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::TransfersView->value);
    }

    public function view(User $user, InterProjectTransfer $transfer): bool
    {
        return $user->can(PermissionEnum::TransfersView->value);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::TransfersCreate->value);
    }

    public function reverse(User $user, InterProjectTransfer $transfer): bool
    {
        return $user->can(PermissionEnum::TransfersCreate->value);
    }
}
