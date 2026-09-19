<?php

namespace App\Actions\ProjectAssignments;

use App\Models\ProjectAssignment;

class UpdateProjectAssignmentAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(ProjectAssignment $assignment, array $data): ProjectAssignment
    {
        $assignment->update($data);

        return $assignment;
    }
}
