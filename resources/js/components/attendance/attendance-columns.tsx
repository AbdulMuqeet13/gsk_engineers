import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableSortHeader } from '@/components/data-table/data-table-header';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Attendance, SortState } from '@/types';

type AttendanceColumnsOptions = {
    sort?: SortState | null;
    onSort?: (column: string) => void;
    onEdit?: (attendance: Attendance) => void;
    onDelete?: (attendance: Attendance) => void;
    canManage: boolean;
};

const statusBadgeVariants: Record<string, 'success-soft' | 'destructive-soft' | 'warning-soft' | 'info-soft'> = {
    present: 'success-soft',
    absent: 'destructive-soft',
    half_day: 'warning-soft',
    leave: 'info-soft',
};

const statusLabels: Record<string, string> = {
    present: 'Present',
    absent: 'Absent',
    half_day: 'Half Day',
    leave: 'Leave',
};

export function getAttendanceColumns({
    sort,
    onSort,
    onEdit,
    onDelete,
    canManage,
}: AttendanceColumnsOptions): ColumnDef<Attendance>[] {
    const columns: ColumnDef<Attendance>[] = [
        {
            accessorKey: 'date',
            header: () => (
                <DataTableSortHeader
                    column="date"
                    label="Date"
                    sort={sort}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => (
                <span className="text-sm">
                    {row.original.date}
                </span>
            ),
        },
        {
            id: 'employee',
            header: () => <span>Employee</span>,
            cell: ({ row }) => (
                <span className="text-sm font-medium">
                    {row.original.employee?.name ?? '--'}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: () => <span>Status</span>,
            cell: ({ row }) => (
                <Badge
                    variant={statusBadgeVariants[row.original.status] ?? 'secondary'}
                >
                    {statusLabels[row.original.status] ?? row.original.status}
                </Badge>
            ),
        },
        {
            accessorKey: 'check_in',
            header: () => <span>Check In</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.check_in ?? '--'}
                </span>
            ),
        },
        {
            accessorKey: 'check_out',
            header: () => <span>Check Out</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.check_out ?? '--'}
                </span>
            ),
        },
        {
            accessorKey: 'notes',
            header: () => <span>Notes</span>,
            cell: ({ row }) => (
                <span
                    className="text-muted-foreground block max-w-[200px] truncate text-sm"
                    title={row.original.notes ?? ''}
                >
                    {row.original.notes ?? '--'}
                </span>
            ),
        },
        {
            id: 'marked_by',
            header: () => <span>Marked By</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.marker?.name ?? '--'}
                </span>
            ),
        },
    ];

    if (canManage) {
        columns.push({
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const attendance = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                            >
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => onEdit?.(attendance)}
                            >
                                <Pencil className="mr-2 size-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete?.(attendance)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 size-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        });
    }

    return columns;
}
