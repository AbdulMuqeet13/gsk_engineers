<?php

namespace App\Actions\ProjectAssignments;

use App\Models\ProjectAssignment;

class DeleteProjectAssignmentAction
{
    public function execute(ProjectAssignment $assignment): void
    {
        $assignment->delete();
    }
}
