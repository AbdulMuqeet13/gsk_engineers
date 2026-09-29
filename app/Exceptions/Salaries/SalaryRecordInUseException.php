<?php

namespace App\Exceptions\Salaries;

use DomainException;

class SalaryRecordInUseException extends DomainException
{
    public function __construct()
    {
        parent::__construct('This salary record has been used in payroll and cannot be deleted.');
    }
}
