<?php

namespace App\Actions\Expenses;

use App\Models\Expense;
use App\Services\ExpenseService;

class DeleteExpenseAction
{
    public function __construct(private ExpenseService $expenseService) {}

    public function execute(Expense $expense): void
    {
        $this->expenseService->delete($expense);
    }
}
