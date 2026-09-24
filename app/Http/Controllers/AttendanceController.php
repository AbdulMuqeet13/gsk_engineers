<?php

namespace App\Http\Controllers;

use App\Actions\Attendance\CreateAttendanceAction;
use App\Actions\Attendance\DeleteAttendanceAction;
use App\Actions\Attendance\UpdateAttendanceAction;
use App\Concerns\FlashesToast;
use App\Enums\AttendanceStatus;
use App\Http\Requests\Attendance\StoreAttendanceRequest;
use App\Http\Requests\Attendance\UpdateAttendanceRequest;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Attendance::class);

        $attendances = Attendance::query()
            ->with([
                'employee:id,name',
                'marker:id,name',
            ])
            ->when($request->input('search'), function ($query, string $search) {
                $query->whereHas('employee', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            })
            ->when($request->input('status'), fn ($q, $s) => $q->where('status', $s))
            ->when($request->input('employee_id'), fn ($q, $id) => $q->where('employee_id', $id))
            ->when($request->input('project_id'), fn ($q, $id) => $q->whereHas('employee', fn ($eq) => $eq->where('project_id', $id)))
            ->when($request->input('date_from'), fn ($q, $d) => $q->where('date', '>=', $d))
            ->when($request->input('date_to'), fn ($q, $d) => $q->where('date', '<=', $d))
            ->orderBy(
                $request->input('sort', 'date'),
                $request->input('direction', 'desc'),
            )
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        return Inertia::render('employees/attendance/index', [
            'attendances' => $attendances,
            'attendanceStatuses' => AttendanceStatus::values(),
            'employees' => fn () => Employee::where('is_active', true)
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
            'projects' => fn () => Project::select('id', 'name', 'code')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(StoreAttendanceRequest $request, CreateAttendanceAction $action): RedirectResponse
    {
        $action->execute(array_merge($request->validated(), [
            'marked_by' => $request->user()->id,
        ]));

        $this->flashSuccess('Attendance recorded successfully.');

        return redirect()->route('attendance.index');
    }

    public function update(UpdateAttendanceRequest $request, Attendance $attendance, UpdateAttendanceAction $action): RedirectResponse
    {
        $this->authorize('update', $attendance);

        $action->execute($attendance, $request->validated());

        $this->flashSuccess('Attendance updated successfully.');

        return redirect()->route('attendance.index');
    }

    public function destroy(Attendance $attendance, DeleteAttendanceAction $action): RedirectResponse
    {
        $this->authorize('delete', $attendance);

        $action->execute($attendance);

        $this->flashSuccess('Attendance deleted successfully.');

        return redirect()->route('attendance.index');
    }
}
