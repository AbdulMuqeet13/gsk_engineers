<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\Expense;
use App\Models\User;

class ExpensePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::ExpensesView->value);
    }

    public function view(User $user, Expense $expense): bool
    {
        return $user->can(PermissionEnum::ExpensesView->value);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::ExpensesCreate->value);
    }

    public function update(User $user, Expense $expense): bool
    {
        return $user->can(PermissionEnum::ExpensesUpdate->value)
            && $expense->isDraft();
    }

    public function delete(User $user, Expense $expense): bool
    {
        return $user->can(PermissionEnum::ExpensesDelete->value)
            && $expense->isDraft();
    }

    public function submit(User $user, Expense $expense): bool
    {
        return $user->can(PermissionEnum::ExpensesCreate->value)
            && $expense->isDraft();
    }

    public function approve(User $user, Expense $expense): bool
    {
        return $user->can(PermissionEnum::ExpensesApprove->value)
            && $expense->isSubmitted();
    }

    public function reject(User $user, Expense $expense): bool
    {
        return $user->can(PermissionEnum::ExpensesApprove->value)
            && $expense->isSubmitted();
    }
}
