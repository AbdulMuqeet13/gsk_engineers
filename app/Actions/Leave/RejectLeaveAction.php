<?php

namespace App\Actions\Leave;

use App\Models\LeaveRequest;
use App\Models\User;
use App\Services\LeaveService;

class RejectLeaveAction
{
    public function __construct(private LeaveService $leaveService) {}

    public function execute(LeaveRequest $leave, User $rejector, string $reason): void
    {
        $this->leaveService->reject($leave, $rejector, $reason);
    }
}
