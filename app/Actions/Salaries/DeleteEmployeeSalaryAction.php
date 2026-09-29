<?php

namespace App\Actions\Salaries;

use App\Models\EmployeeSalary;
use App\Services\SalaryService;

class DeleteEmployeeSalaryAction
{
    public function __construct(private SalaryService $salaryService) {}

    public function execute(EmployeeSalary $salary): void
    {
        $this->salaryService->delete($salary);
    }
}
