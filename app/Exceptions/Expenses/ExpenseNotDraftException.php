<?php

namespace App\Exceptions\Expenses;

use App\Enums\ExpenseStatus;
use DomainException;

class ExpenseNotDraftException extends DomainException
{
    public function __construct(ExpenseStatus $currentStatus)
    {
        parent::__construct("Expense must be in draft status, currently: {$currentStatus->value}");
    }
}
