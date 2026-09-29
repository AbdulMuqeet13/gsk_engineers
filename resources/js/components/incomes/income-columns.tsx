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
import type { ProjectIncome, SortState } from '@/types';

type IncomeColumnsOptions = {
    sort?: SortState | null;
    onSort?: (column: string) => void;
    onReverse?: (income: ProjectIncome) => void;
    canCreate: boolean;
};

function formatAmount(amount: string): string {
    return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
    });
}

export function getIncomeColumns({
    sort,
    onSort,
    onReverse,
    canCreate,
}: IncomeColumnsOptions): ColumnDef<ProjectIncome>[] {
    const columns: ColumnDef<ProjectIncome>[] = [
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
            id: 'project',
            header: () => <span>Project</span>,
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.project?.code} - {row.original.project?.name}
                </Badge>
            ),
        },
        {
            accessorKey: 'received_from',
            header: () => <span>Received From</span>,
            cell: ({ row }) => (
                <span className="text-sm">
                    {row.original.received_from ?? '--'}
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
            id: 'deposit_account',
            header: () => <span>Received Into</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.deposit_account?.name ?? '--'}
                </span>
            ),
        },
        {
            id: 'income_account',
            header: () => <span>Income Account</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.income_account?.name ?? '--'}
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
                const income = row.original;
                const isReversed = income.journal_entry?.reversed_by_id != null;

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
                                onClick={() => onReverse?.(income)}
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
