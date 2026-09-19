<?php

namespace App\Http\Controllers;

use App\Actions\Leave\ApproveLeaveAction;
use App\Actions\Leave\CreateLeaveAction;
use App\Actions\Leave\DeleteLeaveAction;
use App\Actions\Leave\RejectLeaveAction;
use App\Concerns\FlashesToast;
use App\Enums\LeaveStatus;
use App\Enums\LeaveType;
use App\Http\Requests\Leave\ApproveLeaveFormRequest;
use App\Http\Requests\Leave\RejectLeaveFormRequest;
use App\Http\Requests\Leave\StoreLeaveRequest;
use App\Models\Employee;
use App\Models\LeaveRequest;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveRequestController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', LeaveRequest::class);

        $leaveRequests = LeaveRequest::query()
            ->with([
                'employee:id,name',
                'creator:id,name',
                'approver:id,name',
            ])
            ->when($request->input('search'), function ($query, string $search) {
                $query->whereHas('employee', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhere('reason', 'like', "%{$search}%");
            })
            ->when($request->input('status'), fn ($q, $s) => $q->where('status', $s))
            ->when($request->input('employee_id'), fn ($q, $id) => $q->where('employee_id', $id))
            ->when($request->input('leave_type'), fn ($q, $t) => $q->where('leave_type', $t))
            ->when($request->input('date_from'), fn ($q, $d) => $q->where('start_date', '>=', $d))
            ->when($request->input('date_to'), fn ($q, $d) => $q->where('end_date', '<=', $d))
            ->orderBy(
                $request->input('sort', 'created_at'),
                $request->input('direction', 'desc'),
            )
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        return Inertia::render('employees/leave/index', [
            'leaveRequests' => $leaveRequests,
            'leaveStatuses' => LeaveStatus::values(),
            'leaveTypes' => LeaveType::values(),
            'employees' => Inertia::optional(fn () => Employee::where('is_active', true)
                ->select('id', 'name')
                ->orderBy('name')
                ->get()),
        ]);
    }

    public function store(StoreLeaveRequest $request, CreateLeaveAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user());

        $this->flashSuccess('Leave request created successfully.');

        return redirect()->route('leave.index');
    }

    public function destroy(LeaveRequest $leaveRequest, DeleteLeaveAction $action): RedirectResponse
    {
        $this->authorize('delete', $leaveRequest);

        try {
            $action->execute($leaveRequest);
            $this->flashSuccess('Leave request deleted successfully.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('leave.index');
    }

    public function approve(ApproveLeaveFormRequest $request, LeaveRequest $leaveRequest, ApproveLeaveAction $action): RedirectResponse
    {
        $this->authorize('approve', $leaveRequest);

        try {
            $action->execute($leaveRequest, $request->user());
            $this->flashSuccess('Leave request approved.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('leave.index');
    }

    public function reject(RejectLeaveFormRequest $request, LeaveRequest $leaveRequest, RejectLeaveAction $action): RedirectResponse
    {
        $this->authorize('reject', $leaveRequest);

        try {
            $action->execute($leaveRequest, $request->user(), $request->validated()['reason']);
            $this->flashSuccess('Leave request rejected.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('leave.index');
    }
}
