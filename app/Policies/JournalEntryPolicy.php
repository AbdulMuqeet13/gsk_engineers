<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\JournalEntry;
use App\Models\User;

class JournalEntryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::AccountingView->value);
    }

    public function view(User $user, JournalEntry $journalEntry): bool
    {
        return $user->can(PermissionEnum::AccountingView->value);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::AccountingCreate->value);
    }

    public function update(User $user, JournalEntry $journalEntry): bool
    {
        return $user->can(PermissionEnum::AccountingCreate->value)
            && $journalEntry->isDraft();
    }

    public function post(User $user, JournalEntry $journalEntry): bool
    {
        return $user->can(PermissionEnum::AccountingPost->value)
            && $journalEntry->isDraft();
    }

    public function reverse(User $user, JournalEntry $journalEntry): bool
    {
        return $user->can(PermissionEnum::AccountingReverse->value)
            && $journalEntry->isPosted()
            && ! $journalEntry->isReversed();
    }
}
