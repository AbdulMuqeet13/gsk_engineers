<?php

namespace App\Exceptions\Salaries;

use DomainException;

class InsufficientSecurityBalanceException extends DomainException
{
    public function __construct(string $balance)
    {
        parent::__construct("Refund exceeds the employee's security balance of ".number_format((float) $balance, 2).'.');
    }
}
