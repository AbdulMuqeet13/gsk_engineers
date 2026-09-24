import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, MoreHorizontal, Trash2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableSortHeader } from '@/components/data-table/data-table-header';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { LeaveRequest, SortState } from '@/types';

type LeaveColumnsOptions = {
    sort?: SortState | null;
    onSort?: (column: string) => void;
    onApprove?: (leave: LeaveRequest) => void;
    onReject?: (leave: LeaveRequest) => void;
    onDelete?: (leave: LeaveRequest) => void;
    canManage: boolean;
    canApprove: boolean;
};

const statusBadgeVariants: Record<string, 'warning-soft' | 'success-soft' | 'destructive-soft'> = {
    pending: 'warning-soft',
    approved: 'success-soft',
    rejected: 'destructive-soft',
};

const leaveTypeBadgeVariants: Record<string, 'info-soft' | 'warning-soft' | 'default' | 'secondary'> = {
    annual: 'info-soft',
    sick: 'warning-soft',
    casual: 'default',
    unpaid: 'secondary',
};

export function getLeaveColumns({
    sort,
    onSort,
    onApprove,
    onReject,
    onDelete,
    canManage,
    canApprove,
}: LeaveColumnsOptions): ColumnDef<LeaveRequest>[] {
    const columns: ColumnDef<LeaveRequest>[] = [
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
            accessorKey: 'leave_type',
            header: () => <span>Leave Type</span>,
            cell: ({ row }) => (
                <Badge
                    variant={leaveTypeBadgeVariants[row.original.leave_type] ?? 'secondary'}
                >
                    {row.original.leave_type.charAt(0).toUpperCase() +
                        row.original.leave_type.slice(1)}
                </Badge>
            ),
        },
        {
            accessorKey: 'start_date',
            header: () => (
                <DataTableSortHeader
                    column="start_date"
                    label="Period"
                    sort={sort}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => (
                <span className="text-sm">
                    {row.original.start_date} &ndash;{' '}
                    {row.original.end_date}
                </span>
            ),
        },
        {
            accessorKey: 'days',
            header: () => <span className="text-right">Days</span>,
            cell: ({ row }) => (
                <span className="block text-right text-sm font-medium">
                    {row.original.days}
                </span>
            ),
        },
        {
            accessorKey: 'reason',
            header: () => <span>Reason</span>,
            cell: ({ row }) => (
                <span
                    className="text-muted-foreground block max-w-[200px] truncate text-sm"
                    title={row.original.reason}
                >
                    {row.original.reason}
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
                    {row.original.status.charAt(0).toUpperCase() +
                        row.original.status.slice(1)}
                </Badge>
            ),
        },
        {
            id: 'creator',
            header: () => <span>Created By</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.creator?.name ?? '--'}
                </span>
            ),
        },
    ];

    const hasActions = canManage || canApprove;

    if (hasActions) {
        columns.push({
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const leave = row.original;
                const isPending = leave.status === 'pending';

                const showApprove = isPending && canApprove;
                const showReject = isPending && canApprove;
                const showDelete = isPending && canManage;

                if (!showApprove && !showReject && !showDelete) {
                    return null;
                }

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
                            {showApprove && (
                                <DropdownMenuItem
                                    onClick={() => onApprove?.(leave)}
                                >
                                    <CheckCircle2 className="mr-2 size-4" />
                                    Approve
                                </DropdownMenuItem>
                            )}
                            {showReject && (
                                <DropdownMenuItem
                                    onClick={() => onReject?.(leave)}
                                >
                                    <XCircle className="mr-2 size-4" />
                                    Reject
                                </DropdownMenuItem>
                            )}
                            {showDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete?.(leave)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 size-4" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        });
    }

    return columns;
}
