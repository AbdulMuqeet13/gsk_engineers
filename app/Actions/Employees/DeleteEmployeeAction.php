<?php

namespace App\Actions\Employees;

use App\Models\Employee;

class DeleteEmployeeAction
{
    public function execute(Employee $employee): void
    {
        $employee->delete();
    }
}
