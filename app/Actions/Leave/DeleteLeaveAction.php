<?php

namespace App\Actions\Leave;

use App\Models\LeaveRequest;
use App\Services\LeaveService;

class DeleteLeaveAction
{
    public function __construct(private LeaveService $leaveService) {}

    public function execute(LeaveRequest $leave): void
    {
        $this->leaveService->delete($leave);
    }
}
