<?php

namespace App\Actions\Incomes;

use App\Models\ProjectIncome;
use App\Models\User;
use App\Services\IncomeService;

class CreateProjectIncomeAction
{
    public function __construct(private IncomeService $incomeService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, User $user): ProjectIncome
    {
        return $this->incomeService->record($data, $user);
    }
}
