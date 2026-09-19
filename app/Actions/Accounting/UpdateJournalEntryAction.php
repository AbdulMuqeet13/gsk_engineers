<?php

namespace App\Actions\Accounting;

use App\Models\JournalEntry;
use App\Services\JournalService;

class UpdateJournalEntryAction
{
    public function __construct(private JournalService $journalService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(JournalEntry $entry, array $data): JournalEntry
    {
        return $this->journalService->update($entry, $data);
    }
}
