<?php

namespace App\Exceptions\Incomes;

use DomainException;

class IncomeAlreadyReversedException extends DomainException
{
    public function __construct()
    {
        parent::__construct('This income has already been reversed.');
    }
}
