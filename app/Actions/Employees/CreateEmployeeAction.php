<?php

namespace App\Actions\Employees;

use App\Models\Employee;

class CreateEmployeeAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): Employee
    {
        return Employee::create($data);
    }
}
