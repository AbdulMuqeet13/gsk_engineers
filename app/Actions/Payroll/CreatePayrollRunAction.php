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
     * @return array{run: PayrollRun, skipped_without_salary: int, skipped_already_in_payroll: int}
     */
    public function execute(array $data, User $user): array
    {
        return $this->payrollService->create($data, $user);
    }
}
