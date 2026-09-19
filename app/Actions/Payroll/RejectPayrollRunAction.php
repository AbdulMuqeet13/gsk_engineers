<?php

namespace App\Actions\Payroll;

use App\Models\PayrollRun;
use App\Models\User;
use App\Services\PayrollService;

class RejectPayrollRunAction
{
    public function __construct(private PayrollService $payrollService) {}

    public function execute(PayrollRun $run, User $rejector, string $reason): void
    {
        $this->payrollService->reject($run, $rejector, $reason);
    }
}
