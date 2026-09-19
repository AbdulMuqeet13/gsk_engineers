<?php

namespace App\Actions\AccountHeads;

use App\Models\AccountHead;

class CreateAccountHeadAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): AccountHead
    {
        return AccountHead::create($data);
    }
}
