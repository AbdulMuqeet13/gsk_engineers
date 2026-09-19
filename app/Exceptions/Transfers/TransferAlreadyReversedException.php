<?php

namespace App\Exceptions\Transfers;

use DomainException;

class TransferAlreadyReversedException extends DomainException
{
    public function __construct()
    {
        parent::__construct('This transfer has already been reversed.');
    }
}
