<?php

namespace App\Actions\Leave;

use App\Models\LeaveRequest;
use App\Models\User;
use App\Services\LeaveService;

class ApproveLeaveAction
{
    public function __construct(private LeaveService $leaveService) {}

    public function execute(LeaveRequest $leave, User $approver): void
    {
        $this->leaveService->approve($leave, $approver);
    }
}
