<?php

namespace App\Actions\Salaries;

use App\Models\SalaryComponent;

class CreateSalaryComponentAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): SalaryComponent
    {
        return SalaryComponent::create($data);
    }
}
