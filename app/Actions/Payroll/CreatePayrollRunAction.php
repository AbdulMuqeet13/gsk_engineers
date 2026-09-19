<?php

namespace App\Actions\Payroll;

use App\Models\PayrollRun;
use App\Models\User;
use App\Services\PayrollService;

class CreatePayrollRunAction
{
    public function __construct(private PayrollService $payrollService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, User $user): PayrollRun
    {
        return $this->payrollService->create($data, $user);
    }
}
