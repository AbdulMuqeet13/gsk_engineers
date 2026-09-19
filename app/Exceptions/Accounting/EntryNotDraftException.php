<?php

namespace App\Exceptions\Accounting;

use App\Enums\JournalEntryStatus;
use DomainException;

class EntryNotDraftException extends DomainException
{
    public function __construct(JournalEntryStatus $currentStatus)
    {
        parent::__construct("Journal entry must be in draft status to post, currently: {$currentStatus->value}");
    }
}
