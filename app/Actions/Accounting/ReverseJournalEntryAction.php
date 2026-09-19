<?php

namespace App\Actions\Accounting;

use App\Models\JournalEntry;
use App\Models\User;
use App\Services\JournalService;

class ReverseJournalEntryAction
{
    public function __construct(private JournalService $journalService) {}

    public function execute(JournalEntry $entry, User $user, string $reason = ''): JournalEntry
    {
        return $this->journalService->reverse($entry, $user, $reason);
    }
}
