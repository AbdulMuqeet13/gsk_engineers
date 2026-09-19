<?php

namespace App\Actions\AccountHeads;

use App\Models\AccountHead;

class UpdateAccountHeadAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(AccountHead $accountHead, array $data): AccountHead
    {
        $accountHead->update($data);

        return $accountHead;
    }
}
