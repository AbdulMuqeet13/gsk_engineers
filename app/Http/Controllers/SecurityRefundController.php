<?php

namespace App\Http\Controllers;

use App\Actions\Salaries\RefundSecurityDepositAction;
use App\Concerns\FlashesToast;
use App\Http\Requests\Salaries\StoreSecurityRefundRequest;
use App\Models\Employee;
use DomainException;
use Illuminate\Http\RedirectResponse;

class SecurityRefundController extends Controller
{
    use FlashesToast;

    public function store(StoreSecurityRefundRequest $request, Employee $employee, RefundSecurityDepositAction $action): RedirectResponse
    {
        try {
            $action->execute($employee, $request->validated(), $request->user());
            $this->flashSuccess('Security refunded and journal entry posted.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('employees.show', $employee);
    }
}
