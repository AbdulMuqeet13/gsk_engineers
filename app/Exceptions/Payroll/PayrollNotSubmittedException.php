<?php

namespace App\Exceptions\Payroll;

use App\Enums\PayrollStatus;
use DomainException;

class PayrollNotSubmittedException extends DomainException
{
    public function __construct(PayrollStatus $currentStatus)
    {
        parent::__construct("Payroll run must be in submitted status, currently: {$currentStatus->value}");
    }
}
