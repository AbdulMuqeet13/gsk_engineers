<?php

namespace App\Actions\AccountHeads;

use App\Models\AccountHead;

class DeleteAccountHeadAction
{
    public function execute(AccountHead $accountHead): void
    {
        $accountHead->delete();
    }
}
