<?php

namespace App\Actions\Salaries;

use App\Models\SalaryComponent;

class DeleteSalaryComponentAction
{
    /**
     * Soft delete the component. Salary records that already use it keep
     * their amounts and still show its name.
     */
    public function execute(SalaryComponent $salaryComponent): void
    {
        $salaryComponent->delete();
    }
}
