<?php

namespace App\Exceptions\Expenses;

use App\Enums\ExpenseStatus;
use DomainException;

class ExpenseNotSubmittedException extends DomainException
{
    public function __construct(ExpenseStatus $currentStatus)
    {
        parent::__construct("Expense must be in submitted status to approve/reject, currently: {$currentStatus->value}");
    }
}
