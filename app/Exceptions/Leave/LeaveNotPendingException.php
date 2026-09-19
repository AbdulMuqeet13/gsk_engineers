<?php

namespace App\Exceptions\Leave;

use App\Enums\LeaveStatus;
use DomainException;

class LeaveNotPendingException extends DomainException
{
    public function __construct(LeaveStatus $currentStatus)
    {
        parent::__construct("Leave request must be in pending status, currently: {$currentStatus->value}");
    }
}
