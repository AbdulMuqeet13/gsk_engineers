<?php

namespace App\Actions\Projects;

use App\Models\Expense;
use App\Models\InterProjectTransfer;
use App\Models\JournalLine;
use App\Models\Project;
use DomainException;

class DeleteProjectAction
{
    public function execute(Project $project): void
    {
        if (JournalLine::where('project_id', $project->id)
            ->whereHas('journalEntry', fn ($q) => $q->posted())
            ->exists()
        ) {
            throw new DomainException('Cannot delete project with posted journal entries.');
        }

        if (Expense::where('project_id', $project->id)
            ->where('status', 'approved')
            ->exists()
        ) {
            throw new DomainException('Cannot delete project with approved expenses.');
        }

        if (InterProjectTransfer::where('from_project_id', $project->id)
            ->orWhere('to_project_id', $project->id)
            ->exists()
        ) {
            throw new DomainException('Cannot delete project with inter-project transfers.');
        }

        $project->delete();
    }
}
