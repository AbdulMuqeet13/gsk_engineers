<?php

namespace App\Actions\Payroll;

use App\Models\PayrollRun;
use App\Models\Payslip;
use App\Models\User;
use App\Services\PayrollService;
use Illuminate\Database\Eloquent\Collection;

class PayPayslipsAction
{
    public function __construct(private PayrollService $payrollService) {}

    /**
     * @param  array{payslip_ids: array<int, int>, payment_account_id: int, paid_at: string}  $data
     * @return Collection<int, Payslip>
     */
    public function execute(PayrollRun $run, array $data, User $payer): Collection
    {
        return $this->payrollService->pay(
            $run,
            array_map('intval', $data['payslip_ids']),
            (int) $data['payment_account_id'],
            $data['paid_at'],
            $payer,
        );
    }
}
