<?php

namespace App\Actions\Leave;

use App\Models\LeaveRequest;
use App\Models\User;
use App\Services\LeaveService;

class CreateLeaveAction
{
    public function __construct(private LeaveService $leaveService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, User $user): LeaveRequest
    {
        return $this->leaveService->create($data, $user);
    }
}
