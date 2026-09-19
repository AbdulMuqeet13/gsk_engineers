<?php

namespace App\Actions\Projects;

use App\Models\Project;

class UpdateProjectAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Project $project, array $data): Project
    {
        $project->update($data);

        return $project;
    }
}
