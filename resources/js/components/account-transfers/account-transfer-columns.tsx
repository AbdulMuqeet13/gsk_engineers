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
import type { AccountTransfer, SortState } from '@/types';

type AccountTransferColumnsOptions = {
    sort?: SortState | null;
    onSort?: (column: string) => void;
    onReverse?: (accountTransfer: AccountTransfer) => void;
    canCreate: boolean;
};

function formatAmount(amount: string): string {
    return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
    });
}

export function getAccountTransferColumns({
    sort,
    onSort,
    onReverse,
    canCreate,
}: AccountTransferColumnsOptions): ColumnDef<AccountTransfer>[] {
    const columns: ColumnDef<AccountTransfer>[] = [
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
                <span className="text-sm">{row.original.date}</span>
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
            id: 'from_account',
            header: () => <span>From Account</span>,
            cell: ({ row }) => (
                <span className="text-sm">
                    {row.original.from_account?.code} -{' '}
                    {row.original.from_account?.name}
                </span>
            ),
        },
        {
            id: 'to_account',
            header: () => <span>To Account</span>,
            cell: ({ row }) => (
                <span className="text-sm">
                    {row.original.to_account?.code} -{' '}
                    {row.original.to_account?.name}
                </span>
            ),
        },
        {
            accessorKey: 'amount',
            header: () => (
                <DataTableSortHeader
                    column="amount"
                    label="Amount"
                    sort={sort}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => (
                <span className="block text-right font-mono text-sm">
                    {formatAmount(row.original.amount)}
                </span>
            ),
        },
        {
            id: 'project',
            header: () => <span>Project</span>,
            cell: ({ row }) =>
                row.original.project ? (
                    <Badge variant="outline">
                        {row.original.project.code} -{' '}
                        {row.original.project.name}
                    </Badge>
                ) : (
                    <span className="text-muted-foreground text-sm">--</span>
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
            accessorKey: 'cheque_number',
            header: () => <span>Cheque No.</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.cheque_number ?? '--'}
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
                const accountTransfer = row.original;
                const isReversed =
                    accountTransfer.journal_entry?.reversed_by_id != null;

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
                                onClick={() => onReverse?.(accountTransfer)}
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
