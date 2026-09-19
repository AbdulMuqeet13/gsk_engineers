<?php

namespace App\Actions\Payroll;

use App\Models\Payslip;
use App\Services\PayrollService;

class UpdatePayslipAction
{
    public function __construct(private PayrollService $payrollService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Payslip $payslip, array $data): Payslip
    {
        return $this->payrollService->updatePayslip($payslip, $data);
    }
}
