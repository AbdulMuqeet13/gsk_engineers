<?php

namespace App\Services;

use App\Enums\LeaveStatus;
use App\Exceptions\Leave\LeaveNotPendingException;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class LeaveService
{
    /**
     * Create a pending leave request.
     *
     * @param array{
     *     employee_id: int,
     *     leave_type: string,
     *     start_date: string,
     *     end_date: string,
     *     reason: string,
     * } $data
     */
    public function create(array $data, User $user): LeaveRequest
    {
        return DB::transaction(function () use ($data, $user) {
            $startDate = Carbon::parse($data['start_date']);
            $endDate = Carbon::parse($data['end_date']);
            $days = $startDate->diffInDays($endDate) + 1;

            return LeaveRequest::create([
                ...$data,
                'days' => $days,
                'status' => LeaveStatus::Pending,
                'created_by' => $user->id,
            ]);
        });
    }

    /**
     * Approve a pending leave request.
     *
     * @throws LeaveNotPendingException
     */
    public function approve(LeaveRequest $leave, User $approver): void
    {
        if (! $leave->isPending()) {
            throw new LeaveNotPendingException($leave->status);
        }

        $leave->update([
            'status' => LeaveStatus::Approved,
            'approved_by' => $approver->id,
            'approved_at' => now(),
        ]);
    }

    /**
     * Reject a pending leave request.
     *
     * @throws LeaveNotPendingException
     */
    public function reject(LeaveRequest $leave, User $rejector, string $reason): void
    {
        if (! $leave->isPending()) {
            throw new LeaveNotPendingException($leave->status);
        }

        $leave->update([
            'status' => LeaveStatus::Rejected,
            'approved_by' => $rejector->id,
            'approved_at' => now(),
            'rejection_reason' => $reason,
        ]);
    }

    /**
     * Delete a pending leave request.
     *
     * @throws LeaveNotPendingException
     */
    public function delete(LeaveRequest $leave): void
    {
        if (! $leave->isPending()) {
            throw new LeaveNotPendingException($leave->status);
        }

        $leave->delete();
    }
}
