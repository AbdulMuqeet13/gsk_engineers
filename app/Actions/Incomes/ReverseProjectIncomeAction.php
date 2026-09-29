<?php

namespace App\Actions\Incomes;

use App\Models\ProjectIncome;
use App\Models\User;
use App\Services\IncomeService;

class ReverseProjectIncomeAction
{
    public function __construct(private IncomeService $incomeService) {}

    public function execute(ProjectIncome $income, User $user, string $reason = ''): void
    {
        $this->incomeService->reverse($income, $user, $reason);
    }
}
