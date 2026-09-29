<?php

namespace App\Exceptions\AccountTransfers;

use DomainException;

class AccountTransferAlreadyReversedException extends DomainException
{
    public function __construct()
    {
        parent::__construct('This account transfer has already been reversed.');
    }
}
