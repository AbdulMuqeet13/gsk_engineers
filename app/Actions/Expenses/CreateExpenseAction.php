<?php

namespace App\Actions\Expenses;

use App\Models\Expense;
use App\Models\User;
use App\Services\ExpenseService;

class CreateExpenseAction
{
    public function __construct(private ExpenseService $expenseService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, User $user): Expense
    {
        return $this->expenseService->create($data, $user);
    }
}
