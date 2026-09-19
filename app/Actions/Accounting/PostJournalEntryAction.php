<?php

namespace App\Actions\Accounting;

use App\Models\JournalEntry;
use App\Services\JournalService;

class PostJournalEntryAction
{
    public function __construct(private JournalService $journalService) {}

    public function execute(JournalEntry $entry): void
    {
        $this->journalService->post($entry);
    }
}
