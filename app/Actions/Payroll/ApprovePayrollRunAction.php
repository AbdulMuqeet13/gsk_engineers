<?php

namespace App\Actions\Payroll;

use App\Models\PayrollRun;
use App\Models\User;
use App\Services\PayrollService;

class ApprovePayrollRunAction
{
    public function __construct(private PayrollService $payrollService) {}

    public function execute(PayrollRun $run, User $approver): void
    {
        $this->payrollService->approve($run, $approver);
    }
}
