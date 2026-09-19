<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\PayrollRun;
use App\Models\User;

class PayrollRunPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::PayrollView->value);
    }

    public function view(User $user, PayrollRun $payrollRun): bool
    {
        return $user->can(PermissionEnum::PayrollView->value);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::PayrollRun->value);
    }

    public function update(User $user, PayrollRun $payrollRun): bool
    {
        return $user->can(PermissionEnum::PayrollRun->value)
            && $payrollRun->isDraft();
    }

    public function delete(User $user, PayrollRun $payrollRun): bool
    {
        return $user->can(PermissionEnum::PayrollRun->value)
            && $payrollRun->isDraft();
    }

    public function submit(User $user, PayrollRun $payrollRun): bool
    {
        return $user->can(PermissionEnum::PayrollRun->value)
            && $payrollRun->isDraft();
    }

    public function approve(User $user, PayrollRun $payrollRun): bool
    {
        return $user->can(PermissionEnum::PayrollApprove->value)
            && $payrollRun->isSubmitted();
    }

    public function reject(User $user, PayrollRun $payrollRun): bool
    {
        return $user->can(PermissionEnum::PayrollApprove->value)
            && $payrollRun->isSubmitted();
    }
}
