import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getAttendanceColumns } from '@/components/attendance/attendance-columns';
import { CreateAttendanceDialog } from '@/components/attendance/create-attendance-dialog';
import { EditAttendanceDialog } from '@/components/attendance/edit-attendance-dialog';
import { DeleteAttendanceDialog } from '@/components/attendance/delete-attendance-dialog';
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
    Attendance,
    AttendanceStatus,
    Employee,
    PaginatedResponse,
    Project,
} from '@/types';
import { index } from '@/actions/App/Http/Controllers/AttendanceController';
import { dashboard } from '@/routes';

type AttendancePageProps = {
    attendances: PaginatedResponse<Attendance>;
    attendanceStatuses: AttendanceStatus[];
    employees: Pick<Employee, 'id' | 'name'>[];
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
};

export default function AttendanceIndex({
    attendances,
    attendanceStatuses,
    employees = [],
    projects = [],
}: AttendancePageProps) {
    const { can } = useCan();
    const canManage = can('attendance.manage');

    const {
        search,
        sort,
        filters,
        setSearch,
        setSort,
        setFilter,
        setPage,
        setPerPage,
    } = useDataTable({ only: ['attendances'] });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingAttendance, setEditingAttendance] =
        useState<Attendance | null>(null);
    const [deletingAttendance, setDeletingAttendance] =
        useState<Attendance | null>(null);

    const columns = useMemo(
        () =>
            getAttendanceColumns({
                sort,
                onSort: setSort,
                onEdit: setEditingAttendance,
                onDelete: setDeletingAttendance,
                canManage,
            }),
        [sort, setSort, canManage],
    );

    const statusFilterOptions = attendanceStatuses.map((status) => ({
        label:
            status === 'half_day'
                ? 'Half Day'
                : status.charAt(0).toUpperCase() + status.slice(1),
        value: status,
    }));

    const currentStatusFilter = filters.status
        ? Array.isArray(filters.status)
            ? filters.status
            : [filters.status]
        : [];

    return (
        <>
            <Head title="Attendance" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Attendance"
                    description="Track and manage employee attendance records."
                />

                <DataTable
                    columns={columns}
                    data={attendances.data}
                    meta={attendances.meta}
                    sort={sort}
                    onSort={setSort}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    emptyMessage="No attendance records found."
                    emptyDescription="Get started by marking attendance."
                    toolbar={
                        <DataTableToolbar>
                            <div className="flex flex-1 flex-wrap items-center gap-2">
                                <DataTableSearch
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search employee..."
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
                            </div>

                            {canManage && (
                                <Button
                                    size="sm"
                                    onClick={() => setIsCreateOpen(true)}
                                >
                                    <Plus className="mr-2 size-4" />
                                    Mark Attendance
                                </Button>
                            )}
                        </DataTableToolbar>
                    }
                />
            </div>

            {canManage && (
                <CreateAttendanceDialog
                    open={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    employees={employees}
                    attendanceStatuses={attendanceStatuses}
                />
            )}

            {editingAttendance && (
                <EditAttendanceDialog
                    open={!!editingAttendance}
                    onClose={() => setEditingAttendance(null)}
                    attendance={editingAttendance}
                    employees={employees}
                    attendanceStatuses={attendanceStatuses}
                />
            )}

            {deletingAttendance && (
                <DeleteAttendanceDialog
                    open={!!deletingAttendance}
                    onClose={() => setDeletingAttendance(null)}
                    attendance={deletingAttendance}
                />
            )}
        </>
    );
}

AttendanceIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Attendance', href: index().url },
    ],
};
