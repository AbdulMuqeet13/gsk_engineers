<?php

namespace App\Actions\Transfers;

use App\Models\InterProjectTransfer;
use App\Models\User;
use App\Services\TransferService;

class ReverseTransferAction
{
    public function __construct(private TransferService $transferService) {}

    public function execute(InterProjectTransfer $transfer, User $user, string $reason = ''): void
    {
        $this->transferService->reverse($transfer, $user, $reason);
    }
}
