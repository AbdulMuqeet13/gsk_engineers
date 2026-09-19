import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, MoreHorizontal, Pencil, Send, Trash2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableSortHeader } from '@/components/data-table/data-table-header';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Expense, SortState } from '@/types';

type ExpenseColumnsOptions = {
    sort?: SortState | null;
    onSort?: (column: string) => void;
    onEdit?: (expense: Expense) => void;
    onSubmit?: (expense: Expense) => void;
    onApprove?: (expense: Expense) => void;
    onReject?: (expense: Expense) => void;
    onDelete?: (expense: Expense) => void;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canApprove: boolean;
};

const statusBadgeVariants: Record<string, 'secondary' | 'info-soft' | 'success-soft' | 'destructive-soft'> = {
    draft: 'secondary',
    submitted: 'info-soft',
    approved: 'success-soft',
    rejected: 'destructive-soft',
};

function formatDate(dateString: string): string {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatAmount(amount: string): string {
    return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
    });
}

export function getExpenseColumns({
    sort,
    onSort,
    onEdit,
    onSubmit,
    onApprove,
    onReject,
    onDelete,
    canCreate,
    canUpdate,
    canDelete,
    canApprove,
}: ExpenseColumnsOptions): ColumnDef<Expense>[] {
    const columns: ColumnDef<Expense>[] = [
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
                <span className="text-sm">{formatDate(row.original.date)}</span>
            ),
        },
        {
            accessorKey: 'reference',
            header: () => <span>Reference</span>,
            cell: ({ row }) => (
                <span className="font-mono text-sm font-medium">
                    {row.original.reference}
                </span>
            ),
        },
        {
            accessorKey: 'description',
            header: () => <span>Description</span>,
            cell: ({ row }) => (
                <span
                    className="text-muted-foreground block max-w-[200px] truncate text-sm"
                    title={row.original.description}
                >
                    {row.original.description}
                </span>
            ),
        },
        {
            id: 'category',
            header: () => <span>Category</span>,
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.account_head?.name}
                </Badge>
            ),
        },
        {
            id: 'project',
            header: () => <span>Project</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.project?.name ?? '--'}
                </span>
            ),
        },
        {
            accessorKey: 'amount',
            header: () => <span className="text-right">Amount</span>,
            cell: ({ row }) => (
                <span className="block text-right font-mono text-sm">
                    {formatAmount(row.original.amount)}
                </span>
            ),
        },
        {
            id: 'payment',
            header: () => <span>Payment</span>,
            cell: ({ row }) => (
                <Badge variant="outline" className="text-xs">
                    {row.original.payment_account?.name}
                </Badge>
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

    const hasActions = canCreate || canUpdate || canDelete || canApprove;

    if (hasActions) {
        columns.push({
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const expense = row.original;
                const isDraft = expense.status === 'draft';
                const isSubmitted = expense.status === 'submitted';

                const showEdit = isDraft && canUpdate;
                const showSubmit = isDraft && canCreate;
                const showApprove = isSubmitted && canApprove;
                const showReject = isSubmitted && canApprove;
                const showDelete = isDraft && canDelete;

                if (!showEdit && !showSubmit && !showApprove && !showReject && !showDelete) {
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
                            {showEdit && (
                                <DropdownMenuItem
                                    onClick={() => onEdit?.(expense)}
                                >
                                    <Pencil className="mr-2 size-4" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {showSubmit && (
                                <DropdownMenuItem
                                    onClick={() => onSubmit?.(expense)}
                                >
                                    <Send className="mr-2 size-4" />
                                    Submit
                                </DropdownMenuItem>
                            )}
                            {showApprove && (
                                <DropdownMenuItem
                                    onClick={() => onApprove?.(expense)}
                                >
                                    <CheckCircle2 className="mr-2 size-4" />
                                    Approve
                                </DropdownMenuItem>
                            )}
                            {showReject && (
                                <DropdownMenuItem
                                    onClick={() => onReject?.(expense)}
                                >
                                    <XCircle className="mr-2 size-4" />
                                    Reject
                                </DropdownMenuItem>
                            )}
                            {showDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete?.(expense)}
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
