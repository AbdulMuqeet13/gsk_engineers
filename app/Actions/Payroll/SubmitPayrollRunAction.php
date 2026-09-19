<?php

namespace App\Actions\Payroll;

use App\Models\PayrollRun;
use App\Services\PayrollService;

class SubmitPayrollRunAction
{
    public function __construct(private PayrollService $payrollService) {}

    public function execute(PayrollRun $run): void
    {
        $this->payrollService->submit($run);
    }
}
