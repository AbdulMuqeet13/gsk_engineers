<?php

namespace App\Actions\Accounting;

use App\Models\JournalEntry;
use App\Models\User;
use App\Services\JournalService;

class CreateJournalEntryAction
{
    public function __construct(private JournalService $journalService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, User $user): JournalEntry
    {
        return $this->journalService->create($data, $user);
    }
}
