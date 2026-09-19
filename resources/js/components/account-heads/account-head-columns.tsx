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
import type { AccountHead, SortState } from '@/types';

type AccountHeadColumnsOptions = {
    sort?: SortState | null;
    onSort?: (column: string) => void;
    onEdit?: (accountHead: AccountHead) => void;
    onDelete?: (accountHead: AccountHead) => void;
    canManage: boolean;
};

const accountTypeBadgeVariants: Record<string, 'info-soft' | 'destructive-soft' | 'default' | 'success-soft' | 'warning-soft'> = {
    asset: 'info-soft',
    liability: 'destructive-soft',
    equity: 'default',
    income: 'success-soft',
    expense: 'warning-soft',
};

const normalBalanceBadgeVariants: Record<string, 'warning-soft' | 'info-soft'> = {
    debit: 'warning-soft',
    credit: 'info-soft',
};

export function getAccountHeadColumns({
    sort,
    onSort,
    onEdit,
    onDelete,
    canManage,
}: AccountHeadColumnsOptions): ColumnDef<AccountHead>[] {
    const columns: ColumnDef<AccountHead>[] = [
        {
            accessorKey: 'code',
            header: () => (
                <DataTableSortHeader
                    column="code"
                    label="Code"
                    sort={sort}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => (
                <span className="font-mono text-sm font-medium">
                    {row.original.code}
                </span>
            ),
        },
        {
            accessorKey: 'name',
            header: () => (
                <DataTableSortHeader
                    column="name"
                    label="Name"
                    sort={sort}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => (
                <span className="font-medium">{row.original.name}</span>
            ),
        },
        {
            accessorKey: 'type',
            header: () => <span>Type</span>,
            cell: ({ row }) => (
                <Badge
                    variant={accountTypeBadgeVariants[row.original.type] ?? 'secondary'}
                >
                    {row.original.type.charAt(0).toUpperCase() +
                        row.original.type.slice(1)}
                </Badge>
            ),
        },
        {
            accessorKey: 'normal_balance',
            header: () => <span>Normal Balance</span>,
            cell: ({ row }) => (
                <Badge
                    variant={normalBalanceBadgeVariants[row.original.normal_balance] ?? 'secondary'}
                >
                    {row.original.normal_balance.charAt(0).toUpperCase() +
                        row.original.normal_balance.slice(1)}
                </Badge>
            ),
        },
        {
            accessorKey: 'parent',
            header: () => <span>Parent</span>,
            cell: ({ row }) =>
                row.original.parent ? (
                    <span className="text-muted-foreground text-sm">
                        {row.original.parent.code} - {row.original.parent.name}
                    </span>
                ) : (
                    <span className="text-muted-foreground/50 text-sm">--</span>
                ),
        },
        {
            accessorKey: 'is_active',
            header: () => <span>Status</span>,
            cell: ({ row }) => (
                <Badge
                    variant={row.original.is_active ? 'default' : 'secondary'}
                >
                    {row.original.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
    ];

    if (canManage) {
        columns.push({
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => onEdit?.(row.original)}
                        >
                            <Pencil className="mr-2 size-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete?.(row.original)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        });
    }

    return columns;
}
