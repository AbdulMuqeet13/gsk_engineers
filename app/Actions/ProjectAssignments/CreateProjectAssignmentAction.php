<?php

namespace App\Actions\ProjectAssignments;

use App\Models\ProjectAssignment;
use App\Services\ProjectAssignmentService;

class CreateProjectAssignmentAction
{
    public function __construct(private ProjectAssignmentService $projectAssignmentService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): ProjectAssignment
    {
        return $this->projectAssignmentService->create($data);
    }
}
