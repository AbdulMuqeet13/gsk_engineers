<?php

namespace App\Exceptions\Accounting;

use DomainException;

class UnbalancedEntryException extends DomainException
{
    public function __construct(string $totalDebits, string $totalCredits)
    {
        parent::__construct("Journal entry is unbalanced: debits ({$totalDebits}) != credits ({$totalCredits})");
    }
}
