<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\ProjectAssignment;
use App\Models\User;

class ProjectAssignmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::ProjectsAssign->value);
    }

    public function view(User $user, ProjectAssignment $projectAssignment): bool
    {
        return $user->can(PermissionEnum::ProjectsAssign->value);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::ProjectsAssign->value);
    }

    public function update(User $user, ProjectAssignment $projectAssignment): bool
    {
        return $user->can(PermissionEnum::ProjectsAssign->value);
    }

    public function delete(User $user, ProjectAssignment $projectAssignment): bool
    {
        return $user->can(PermissionEnum::ProjectsAssign->value);
    }
}
