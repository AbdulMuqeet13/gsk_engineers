<?php

namespace App\Exceptions\Payroll;

use App\Models\PayrollRun;
use DomainException;

class OverlappingPayrollException extends DomainException
{
    public function __construct(PayrollRun $existing)
    {
        parent::__construct("Payroll run {$existing->reference} already covers part of this period.");
    }
}
