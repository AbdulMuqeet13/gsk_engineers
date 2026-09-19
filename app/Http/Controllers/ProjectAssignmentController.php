<?php

namespace App\Http\Controllers;

use App\Actions\ProjectAssignments\CreateProjectAssignmentAction;
use App\Actions\ProjectAssignments\DeleteProjectAssignmentAction;
use App\Actions\ProjectAssignments\UpdateProjectAssignmentAction;
use App\Concerns\FlashesToast;
use App\Http\Requests\ProjectAssignments\StoreProjectAssignmentRequest;
use App\Http\Requests\ProjectAssignments\UpdateProjectAssignmentRequest;
use App\Models\Employee;
use App\Models\Project;
use App\Models\ProjectAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectAssignmentController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ProjectAssignment::class);

        $assignments = ProjectAssignment::query()
            ->with(['employee:id,name,type', 'project:id,name,code'])
            ->when($request->input('project_id'), function ($query, string $projectId) {
                $query->where('project_id', $projectId);
            })
            ->when($request->input('employee_id'), function ($query, string $employeeId) {
                $query->where('employee_id', $employeeId);
            })
            ->orderBy(
                $request->input('sort', 'created_at'),
                $request->input('direction', 'desc'),
            )
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        return Inertia::render('projects/assignments/index', [
            'assignments' => $assignments,
            'employees' => Inertia::optional(fn () => Employee::internal()->select('id', 'name')->orderBy('name')->get()),
            'projects' => Inertia::optional(fn () => Project::select('id', 'name', 'code')->orderBy('name')->get()),
        ]);
    }

    public function store(StoreProjectAssignmentRequest $request, CreateProjectAssignmentAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        $this->flashSuccess('Project assignment created successfully.');

        return redirect()->route('project-assignments.index');
    }

    public function update(UpdateProjectAssignmentRequest $request, ProjectAssignment $assignment, UpdateProjectAssignmentAction $action): RedirectResponse
    {
        $action->execute($assignment, $request->validated());

        $this->flashSuccess('Project assignment updated successfully.');

        return redirect()->route('project-assignments.index');
    }

    public function destroy(ProjectAssignment $assignment, DeleteProjectAssignmentAction $action): RedirectResponse
    {
        $this->authorize('delete', $assignment);

        $action->execute($assignment);

        $this->flashSuccess('Project assignment deleted successfully.');

        return redirect()->route('project-assignments.index');
    }
}
