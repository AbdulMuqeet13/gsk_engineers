<?php

namespace App\Exceptions\Accounting;

use DomainException;

class EntryAlreadyPostedException extends DomainException
{
    public function __construct()
    {
        parent::__construct('Cannot modify a posted journal entry. Use reversal instead.');
    }
}
