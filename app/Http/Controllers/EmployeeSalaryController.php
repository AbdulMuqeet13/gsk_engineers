<?php

namespace App\Http\Controllers;

use App\Actions\Salaries\DeleteEmployeeSalaryAction;
use App\Actions\Salaries\RecordEmployeeSalaryAction;
use App\Concerns\FlashesToast;
use App\Http\Requests\Salaries\StoreEmployeeSalaryRequest;
use App\Models\Employee;
use App\Models\EmployeeSalary;
use DomainException;
use Illuminate\Http\RedirectResponse;

class EmployeeSalaryController extends Controller
{
    use FlashesToast;

    public function store(StoreEmployeeSalaryRequest $request, Employee $employee, RecordEmployeeSalaryAction $action): RedirectResponse
    {
        $action->execute($employee, $request->validated(), $request->user());

        $this->flashSuccess('Salary record added.');

        return redirect()->route('employees.show', $employee);
    }

    public function destroy(Employee $employee, EmployeeSalary $salary, DeleteEmployeeSalaryAction $action): RedirectResponse
    {
        $this->authorize('update', $employee);

        try {
            $action->execute($salary);
            $this->flashSuccess('Salary record deleted.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('employees.show', $employee);
    }
}
