<?php

namespace App\Actions\Expenses;

use App\Models\Expense;
use App\Models\User;
use App\Services\ExpenseService;

class ApproveExpenseAction
{
    public function __construct(private ExpenseService $expenseService) {}

    public function execute(Expense $expense, User $approver): void
    {
        $this->expenseService->approve($expense, $approver);
    }
}
