<?php

namespace App\Http\Controllers;

use App\Actions\Projects\CreateProjectAction;
use App\Actions\Projects\DeleteProjectAction;
use App\Actions\Projects\UpdateProjectAction;
use App\Concerns\FlashesToast;
use App\Enums\ProjectStatus;
use App\Http\Requests\Projects\StoreProjectRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Project::class);

        $projects = Project::query()
            ->when($request->input('search'), function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('client', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), function ($query, string $status) {
                $query->where('status', $status);
            })
            ->orderBy(
                $request->input('sort', 'created_at'),
                $request->input('direction', 'desc'),
            )
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        return Inertia::render('projects/index', [
            'projects' => $projects,
            'statuses' => ProjectStatus::values(),
        ]);
    }

    public function store(StoreProjectRequest $request, CreateProjectAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        $this->flashSuccess('Project created successfully.');

        return redirect()->route('projects.index');
    }

    public function update(UpdateProjectRequest $request, Project $project, UpdateProjectAction $action): RedirectResponse
    {
        $action->execute($project, $request->validated());

        $this->flashSuccess('Project updated successfully.');

        return redirect()->route('projects.index');
    }

    public function destroy(Project $project, DeleteProjectAction $action): RedirectResponse
    {
        $this->authorize('delete', $project);

        $action->execute($project);

        $this->flashSuccess('Project deleted successfully.');

        return redirect()->route('projects.index');
    }
}
