<?php

namespace App\Actions\Salaries;

use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\User;
use App\Services\SalaryService;

class RecordEmployeeSalaryAction
{
    public function __construct(private SalaryService $salaryService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Employee $employee, array $data, User $user): EmployeeSalary
    {
        return $this->salaryService->record($employee, $data, $user);
    }
}
