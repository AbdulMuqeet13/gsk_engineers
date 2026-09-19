<?php

namespace App\Actions\Projects;

use App\Models\Project;

class CreateProjectAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): Project
    {
        return Project::create($data);
    }
}
