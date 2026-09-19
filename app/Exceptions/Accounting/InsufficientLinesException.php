<?php

namespace App\Exceptions\Accounting;

use DomainException;

class InsufficientLinesException extends DomainException
{
    public function __construct(int $lineCount)
    {
        parent::__construct("Journal entry must have at least 2 lines, got {$lineCount}");
    }
}
