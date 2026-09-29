<?php

namespace App\Actions\AccountTransfers;

use App\Models\AccountTransfer;
use App\Models\User;
use App\Services\AccountTransferService;

class CreateAccountTransferAction
{
    public function __construct(private AccountTransferService $accountTransferService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, User $user): AccountTransfer
    {
        return $this->accountTransferService->execute($data, $user);
    }
}
