<?php

namespace App\Exceptions\Payroll;

use DomainException;

class EmptyPayrollException extends DomainException
{
    public function __construct()
    {
        parent::__construct('Cannot approve a payroll run with no payslips.');
    }
}
