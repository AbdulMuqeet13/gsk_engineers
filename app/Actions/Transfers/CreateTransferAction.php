<?php

namespace App\Actions\Transfers;

use App\Models\InterProjectTransfer;
use App\Models\User;
use App\Services\TransferService;

class CreateTransferAction
{
    public function __construct(private TransferService $transferService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, User $user): InterProjectTransfer
    {
        return $this->transferService->execute($data, $user);
    }
}
