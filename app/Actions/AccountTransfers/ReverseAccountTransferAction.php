<?php

namespace App\Actions\AccountTransfers;

use App\Models\AccountTransfer;
use App\Models\User;
use App\Services\AccountTransferService;

class ReverseAccountTransferAction
{
    public function __construct(private AccountTransferService $accountTransferService) {}

    public function execute(AccountTransfer $transfer, User $user, string $reason = ''): void
    {
        $this->accountTransferService->reverse($transfer, $user, $reason);
    }
}
