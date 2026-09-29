<?php

namespace App\Actions\Employees;

use App\Models\Employee;
use App\Models\User;
use App\Services\EmployeeService;

class CreateEmployeeAction
{
    public function __construct(private EmployeeService $employeeService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, ?User $user): Employee
    {
        return $this->employeeService->create($data, $user);
    }
}
