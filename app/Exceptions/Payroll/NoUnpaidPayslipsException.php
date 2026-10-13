<?php

namespace App\Exceptions\Payroll;

use DomainException;

class NoUnpaidPayslipsException extends DomainException
{
    public function __construct()
    {
        parent::__construct('Select at least one unpaid payslip of this payroll run to pay.');
    }
}
