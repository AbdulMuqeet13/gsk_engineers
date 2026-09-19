<?php

namespace App\Exceptions\Payroll;

use App\Enums\PayrollStatus;
use DomainException;

class PayrollNotDraftException extends DomainException
{
    public function __construct(PayrollStatus $currentStatus)
    {
        parent::__construct("Payroll run must be in draft status, currently: {$currentStatus->value}");
    }
}
