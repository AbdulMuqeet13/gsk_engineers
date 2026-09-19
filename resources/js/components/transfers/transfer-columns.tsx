import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Undo2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableSortHeader } from '@/components/data-table/data-table-header';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { InterProjectTransfer, SortState } from '@/types';

type TransferColumnsOptions = {
    sort?: SortState | null;
    onSort?: (column: string) => void;
    onReverse?: (transfer: InterProjectTransfer) => void;
    canCreate: boolean;
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

export function getTransferColumns({
    sort,
    onSort,
    onReverse,
    canCreate,
}: TransferColumnsOptions): ColumnDef<InterProjectTransfer>[] {
    const columns: ColumnDef<InterProjectTransfer>[] = [
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
            id: 'from_project',
            header: () => <span>From Project</span>,
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.from_project?.code} -{' '}
                    {row.original.from_project?.name}
                </Badge>
            ),
        },
        {
            id: 'to_project',
            header: () => <span>To Project</span>,
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.to_project?.code} -{' '}
                    {row.original.to_project?.name}
                </Badge>
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
            id: 'from_account',
            header: () => <span>From Account</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.from_account?.name ?? '--'}
                </span>
            ),
        },
        {
            id: 'to_account',
            header: () => <span>To Account</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.to_account?.name ?? '--'}
                </span>
            ),
        },
        {
            accessorKey: 'purpose',
            header: () => <span>Purpose</span>,
            cell: ({ row }) => (
                <span
                    className="text-muted-foreground block max-w-[200px] truncate text-sm"
                    title={row.original.purpose}
                >
                    {row.original.purpose}
                </span>
            ),
        },
        {
            id: 'status',
            header: () => <span>Status</span>,
            cell: ({ row }) => {
                const isReversed =
                    row.original.journal_entry?.reversed_by_id != null;

                return (
                    <Badge
                        variant={isReversed ? 'destructive-soft' : 'success-soft'}
                    >
                        {isReversed ? 'Reversed' : 'Posted'}
                    </Badge>
                );
            },
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

    if (canCreate) {
        columns.push({
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const transfer = row.original;
                const isReversed =
                    transfer.journal_entry?.reversed_by_id != null;

                if (isReversed) {
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
                            <DropdownMenuItem
                                onClick={() => onReverse?.(transfer)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Undo2 className="mr-2 size-4" />
                                Reverse
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        });
    }

    return columns;
}
