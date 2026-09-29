<?php

namespace App\Actions\Salaries;

use App\Models\Employee;
use App\Models\SecurityRefund;
use App\Models\User;
use App\Services\SecurityDepositService;

class RefundSecurityDepositAction
{
    public function __construct(private SecurityDepositService $securityDepositService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Employee $employee, array $data, User $user): SecurityRefund
    {
        return $this->securityDepositService->refund($employee, $data, $user);
    }
}
