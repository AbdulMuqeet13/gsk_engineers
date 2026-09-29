<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\AccountTransfer;
use App\Models\User;

class AccountTransferPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::AccountTransfersView->value);
    }

    public function view(User $user, AccountTransfer $accountTransfer): bool
    {
        return $user->can(PermissionEnum::AccountTransfersView->value);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::AccountTransfersCreate->value);
    }

    public function reverse(User $user, AccountTransfer $accountTransfer): bool
    {
        return $user->can(PermissionEnum::AccountTransfersCreate->value);
    }
}
