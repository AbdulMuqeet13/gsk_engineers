import type { ColumnDef } from '@tanstack/react-table';
import { Link } from '@inertiajs/react';
import { CheckCircle2, Eye, MoreHorizontal, Send, Trash2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableSortHeader } from '@/components/data-table/data-table-header';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { PayrollRun, SortState } from '@/types';
import { show } from '@/actions/App/Http/Controllers/PayrollRunController';

type PayrollColumnsOptions = {
    sort?: SortState | null;
    onSort?: (column: string) => void;
    onSubmit?: (run: PayrollRun) => void;
    onApprove?: (run: PayrollRun) => void;
    onReject?: (run: PayrollRun) => void;
    onDelete?: (run: PayrollRun) => void;
    canRun: boolean;
    canApprove: boolean;
};

const statusBadgeVariants: Record<string, 'secondary' | 'info-soft' | 'success-soft' | 'destructive-soft'> = {
    draft: 'secondary',
    submitted: 'info-soft',
    approved: 'success-soft',
    rejected: 'destructive-soft',
};

function formatAmount(amount: string): string {
    return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
    });
}

export function getPayrollColumns({
    sort,
    onSort,
    onSubmit,
    onApprove,
    onReject,
    onDelete,
    canRun,
    canApprove,
}: PayrollColumnsOptions): ColumnDef<PayrollRun>[] {
    const columns: ColumnDef<PayrollRun>[] = [
        {
            accessorKey: 'reference',
            header: () => (
                <DataTableSortHeader
                    column="reference"
                    label="Reference"
                    sort={sort}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => (
                <Link
                    href={show({ payroll_run: row.original.id }).url}
                    className="font-mono text-sm font-medium hover:underline"
                >
                    {row.original.reference}
                </Link>
            ),
        },
        {
            id: 'period',
            header: () => (
                <DataTableSortHeader
                    column="period_start"
                    label="Period"
                    sort={sort}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => (
                <span className="text-sm">
                    {row.original.period_start} &ndash;{' '}
                    {row.original.period_end}
                </span>
            ),
        },
        {
            accessorKey: 'total_amount',
            header: () => <span className="text-right">Total Amount</span>,
            cell: ({ row }) => (
                <span className="block text-right font-mono text-sm">
                    {formatAmount(row.original.total_amount)}
                </span>
            ),
        },
        {
            id: 'payslips_count',
            header: () => <span>Payslips</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.payslips_count ?? 0}
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
        {
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const run = row.original;
                const isDraft = run.status === 'draft';
                const isSubmitted = run.status === 'submitted';

                const showSubmit = isDraft && canRun;
                const showApprove = isSubmitted && canApprove;
                const showReject = isSubmitted && canApprove;
                const showDelete = isDraft && canRun;

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
                            <DropdownMenuItem asChild>
                                <Link
                                    href={show({ payroll_run: run.id }).url}
                                >
                                    <Eye className="mr-2 size-4" />
                                    View
                                </Link>
                            </DropdownMenuItem>
                            {showSubmit && (
                                <DropdownMenuItem
                                    onClick={() => onSubmit?.(run)}
                                >
                                    <Send className="mr-2 size-4" />
                                    Submit
                                </DropdownMenuItem>
                            )}
                            {showApprove && (
                                <DropdownMenuItem
                                    onClick={() => onApprove?.(run)}
                                >
                                    <CheckCircle2 className="mr-2 size-4" />
                                    Approve
                                </DropdownMenuItem>
                            )}
                            {showReject && (
                                <DropdownMenuItem
                                    onClick={() => onReject?.(run)}
                                >
                                    <XCircle className="mr-2 size-4" />
                                    Reject
                                </DropdownMenuItem>
                            )}
                            {showDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete?.(run)}
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
        },
    ];

    return columns;
}
