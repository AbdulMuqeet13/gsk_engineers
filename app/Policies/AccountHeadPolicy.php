<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\AccountHead;
use App\Models\User;

class AccountHeadPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::ChartOfAccountsView->value);
    }

    public function view(User $user, AccountHead $accountHead): bool
    {
        return $user->can(PermissionEnum::ChartOfAccountsView->value);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::ChartOfAccountsManage->value);
    }

    public function update(User $user, AccountHead $accountHead): bool
    {
        return $user->can(PermissionEnum::ChartOfAccountsManage->value);
    }

    public function delete(User $user, AccountHead $accountHead): bool
    {
        return $user->can(PermissionEnum::ChartOfAccountsManage->value);
    }
}
