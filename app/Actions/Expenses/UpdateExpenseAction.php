<?php

namespace App\Actions\Expenses;

use App\Models\Expense;
use App\Services\ExpenseService;

class UpdateExpenseAction
{
    public function __construct(private ExpenseService $expenseService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Expense $expense, array $data): Expense
    {
        return $this->expenseService->update($expense, $data);
    }
}
