<?php

namespace App\Actions\Expenses;

use App\Models\Expense;
use App\Services\ExpenseService;

class SubmitExpenseAction
{
    public function __construct(private ExpenseService $expenseService) {}

    public function execute(Expense $expense): void
    {
        $this->expenseService->submit($expense);
    }
}
