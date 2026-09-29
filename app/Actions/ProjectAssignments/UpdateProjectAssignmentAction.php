<?php

namespace App\Actions\ProjectAssignments;

use App\Models\ProjectAssignment;
use App\Services\ProjectAssignmentService;

class UpdateProjectAssignmentAction
{
    public function __construct(private ProjectAssignmentService $projectAssignmentService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(ProjectAssignment $assignment, array $data): ProjectAssignment
    {
        return $this->projectAssignmentService->update($assignment, $data);
    }
}
