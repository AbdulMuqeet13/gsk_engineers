<?php

namespace App\Actions\Employees;

use App\Models\Employee;
use DomainException;

class DeleteEmployeeAction
{
    public function execute(Employee $employee): void
    {
        if ($employee->payslips()->exists()) {
            throw new DomainException('Cannot delete employee with payroll history.');
        }

        $employee->delete();
    }
}
