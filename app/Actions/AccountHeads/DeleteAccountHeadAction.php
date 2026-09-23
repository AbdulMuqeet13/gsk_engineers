<?php

namespace App\Actions\AccountHeads;

use App\Models\AccountHead;
use DomainException;

class DeleteAccountHeadAction
{
    public function execute(AccountHead $accountHead): void
    {
        if ($accountHead->journalLines()->exists()) {
            throw new DomainException('Cannot delete account head with journal entries.');
        }

        if ($accountHead->children()->exists()) {
            throw new DomainException('Cannot delete account head with child accounts.');
        }

        $accountHead->delete();
    }
}
