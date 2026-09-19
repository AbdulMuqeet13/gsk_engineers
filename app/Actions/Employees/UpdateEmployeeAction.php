<?php

namespace App\Actions\Employees;

use App\Models\Employee;

class UpdateEmployeeAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Employee $employee, array $data): Employee
    {
        $employee->update($data);

        return $employee;
    }
}
