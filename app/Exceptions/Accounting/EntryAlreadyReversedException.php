<?php

namespace App\Exceptions\Accounting;

use DomainException;

class EntryAlreadyReversedException extends DomainException
{
    public function __construct()
    {
        parent::__construct('This journal entry has already been reversed.');
    }
}
