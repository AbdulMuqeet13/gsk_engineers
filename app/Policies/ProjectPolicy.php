<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::ProjectsView->value);
    }

    public function view(User $user, Project $project): bool
    {
        return $user->can(PermissionEnum::ProjectsView->value);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::ProjectsCreate->value);
    }

    public function update(User $user, Project $project): bool
    {
        return $user->can(PermissionEnum::ProjectsUpdate->value);
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->can(PermissionEnum::ProjectsDelete->value);
    }
}
