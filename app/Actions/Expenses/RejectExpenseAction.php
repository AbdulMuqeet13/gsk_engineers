<?php

namespace App\Actions\Expenses;

use App\Models\Expense;
use App\Models\User;
use App\Services\ExpenseService;

class RejectExpenseAction
{
    public function __construct(private ExpenseService $expenseService) {}

    public function execute(Expense $expense, User $rejector, string $reason): void
    {
        $this->expenseService->reject($expense, $rejector, $reason);
    }
}
