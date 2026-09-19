<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\LeaveRequest;
use App\Models\User;

class LeaveRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::LeaveView->value);
    }

    public function view(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->can(PermissionEnum::LeaveView->value);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::LeaveManage->value);
    }

    public function delete(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->can(PermissionEnum::LeaveManage->value)
            && $leaveRequest->isPending();
    }

    public function approve(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->can(PermissionEnum::LeaveApprove->value)
            && $leaveRequest->isPending();
    }

    public function reject(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->can(PermissionEnum::LeaveApprove->value)
            && $leaveRequest->isPending();
    }
}
