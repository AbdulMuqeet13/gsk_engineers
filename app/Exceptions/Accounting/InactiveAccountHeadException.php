<?php

namespace App\Exceptions\Accounting;

use DomainException;

class InactiveAccountHeadException extends DomainException
{
    public function __construct(string $accountCode, string $accountName)
    {
        parent::__construct("Account head {$accountCode} ({$accountName}) is inactive");
    }
}
