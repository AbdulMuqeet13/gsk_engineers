<?php

namespace App\Exceptions\Payroll;

use App\Enums\PayrollStatus;
use DomainException;

class PayrollNotApprovedException extends DomainException
{
    public function __construct(PayrollStatus $currentStatus)
    {
        parent::__construct("Payroll run must be approved before salaries are paid, currently: {$currentStatus->value}");
    }
}
