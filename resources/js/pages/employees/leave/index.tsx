import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getLeaveColumns } from '@/components/leave/leave-columns';
import { CreateLeaveDialog } from '@/components/leave/create-leave-dialog';
import { ApproveLeaveDialog } from '@/components/leave/approve-leave-dialog';
import { RejectLeaveDialog } from '@/components/leave/reject-leave-dialog';
import { DeleteLeaveDialog } from '@/components/leave/delete-leave-dialog';
import {
    DataTable,
    DataTableFilter,
    DataTableSearch,
    DataTableToolbar,
} from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useDataTable } from '@/hooks/use-data-table';
import type {
    Employee,
    LeaveRequest,
    LeaveStatus,
    LeaveType,
    PaginatedResponse,
} from '@/types';
import { index } from '@/actions/App/Http/Controllers/LeaveRequestController';
import { dashboard } from '@/routes';

type LeavePageProps = {
    leaveRequests: PaginatedResponse<LeaveRequest>;
    leaveStatuses: LeaveStatus[];
    leaveTypes: LeaveType[];
    employees: Pick<Employee, 'id' | 'name'>[];
};

export default function Leave({
    leaveRequests,
    leaveStatuses,
    leaveTypes,
    employees = [],
}: LeavePageProps) {
    const { can } = useCan();
    const canManage = can('leave.manage');
    const canApprove = can('leave.approve');

    const {
        search,
        sort,
        filters,
        setSearch,
        setSort,
        setFilter,
        setPage,
        setPerPage,
    } = useDataTable({ only: ['leaveRequests'] });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [approvingLeave, setApprovingLeave] = useState<LeaveRequest | null>(
        null,
    );
    const [rejectingLeave, setRejectingLeave] = useState<LeaveRequest | null>(
        null,
    );
    const [deletingLeave, setDeletingLeave] = useState<LeaveRequest | null>(
        null,
    );

    const columns = useMemo(
        () =>
            getLeaveColumns({
                sort,
                onSort: setSort,
                onApprove: setApprovingLeave,
                onReject: setRejectingLeave,
                onDelete: setDeletingLeave,
                canManage,
                canApprove,
            }),
        [sort, setSort, canManage, canApprove],
    );

    const statusFilterOptions = leaveStatuses.map((status) => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status,
    }));

    const leaveTypeFilterOptions = leaveTypes.map((type) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type,
    }));

    const currentStatusFilter = filters.status
        ? Array.isArray(filters.status)
            ? filters.status
            : [filters.status]
        : [];

    const currentTypeFilter = filters.leave_type
        ? Array.isArray(filters.leave_type)
            ? filters.leave_type
            : [filters.leave_type]
        : [];

    return (
        <>
            <Head title="Leave" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Leave"
                    description="Manage employee leave requests."
                />

                <DataTable
                    columns={columns}
                    data={leaveRequests.data}
                    meta={leaveRequests.meta}
                    sort={sort}
                    onSort={setSort}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    emptyMessage="No leave requests found."
                    emptyDescription="Get started by creating a leave request."
                    toolbar={
                        <DataTableToolbar>
                            <div className="flex flex-1 flex-wrap items-center gap-2">
                                <DataTableSearch
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search employee or reason..."
                                />
                                <DataTableFilter
                                    title="Status"
                                    options={statusFilterOptions}
                                    value={currentStatusFilter}
                                    onChange={(value) =>
                                        setFilter(
                                            'status',
                                            value.length > 0
                                                ? value.join(',')
                                                : undefined,
                                        )
                                    }
                                />
                                <DataTableFilter
                                    title="Type"
                                    options={leaveTypeFilterOptions}
                                    value={currentTypeFilter}
                                    onChange={(value) =>
                                        setFilter(
                                            'leave_type',
                                            value.length > 0
                                                ? value.join(',')
                                                : undefined,
                                        )
                                    }
                                />
                            </div>

                            {canManage && (
                                <Button
                                    size="sm"
                                    onClick={() => setIsCreateOpen(true)}
                                >
                                    <Plus className="mr-2 size-4" />
                                    New Leave Request
                                </Button>
                            )}
                        </DataTableToolbar>
                    }
                />
            </div>

            {canManage && (
                <CreateLeaveDialog
                    open={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    employees={employees}
                    leaveTypes={leaveTypes}
                />
            )}

            {approvingLeave && (
                <ApproveLeaveDialog
                    open={!!approvingLeave}
                    onClose={() => setApprovingLeave(null)}
                    leave={approvingLeave}
                />
            )}

            {rejectingLeave && (
                <RejectLeaveDialog
                    open={!!rejectingLeave}
                    onClose={() => setRejectingLeave(null)}
                    leave={rejectingLeave}
                />
            )}

            {deletingLeave && (
                <DeleteLeaveDialog
                    open={!!deletingLeave}
                    onClose={() => setDeletingLeave(null)}
                    leave={deletingLeave}
                />
            )}
        </>
    );
}

Leave.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Leave', href: index().url },
    ],
};
