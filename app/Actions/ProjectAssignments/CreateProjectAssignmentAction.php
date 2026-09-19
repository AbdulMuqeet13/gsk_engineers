<?php

namespace App\Actions\ProjectAssignments;

use App\Models\ProjectAssignment;

class CreateProjectAssignmentAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): ProjectAssignment
    {
        return ProjectAssignment::create($data);
    }
}
