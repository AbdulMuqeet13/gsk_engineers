<?php

namespace App\Exceptions\Payroll;

use App\Models\Payslip;
use DomainException;

class PayslipAlreadyPaidException extends DomainException
{
    public function __construct(Payslip $payslip)
    {
        parent::__construct("The salary of {$payslip->employee->name} has already been paid.");
    }
}
