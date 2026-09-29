<?php

namespace App\Actions\Salaries;

use App\Models\SalaryComponent;

class UpdateSalaryComponentAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(SalaryComponent $salaryComponent, array $data): SalaryComponent
    {
        $salaryComponent->update($data);

        return $salaryComponent;
    }
}
