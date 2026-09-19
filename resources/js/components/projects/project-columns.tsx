import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableSortHeader } from '@/components/data-table/data-table-header';
import type { Project, ProjectStatus, SortState } from '@/types';

type ProjectColumnsOptions = {
    sort?: SortState | null;
    onSort?: (column: string) => void;
    onEdit?: (project: Project) => void;
    onDelete?: (project: Project) => void;
};

const statusConfig: Record<
    ProjectStatus,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'info-soft' | 'success' | 'warning-soft' }
> = {
    planning: { label: 'Planning', variant: 'info-soft' },
    active: { label: 'Active', variant: 'success' },
    on_hold: { label: 'On Hold', variant: 'warning-soft' },
    completed: { label: 'Completed', variant: 'secondary' },
    cancelled: { label: 'Cancelled', variant: 'destructive' },
};

function formatBudget(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
    }).format(Number(value));
}

function formatDate(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleDateString();
}

export function getProjectColumns({
    sort,
    onSort,
    onEdit,
    onDelete,
}: ProjectColumnsOptions): ColumnDef<Project>[] {
    return [
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
                <span className="font-mono text-sm">{row.original.code}</span>
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
            accessorKey: 'client',
            header: () => <span>Client</span>,
            cell: ({ row }) => row.original.client ?? '-',
        },
        {
            accessorKey: 'status',
            header: () => <span>Status</span>,
            cell: ({ row }) => {
                const config = statusConfig[row.original.status];

                return (
                    <Badge variant={config.variant}>
                        {config.label}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'budget',
            header: () => <span>Budget</span>,
            cell: ({ row }) => formatBudget(row.original.budget),
        },
        {
            accessorKey: 'start_date',
            header: () => <span>Start Date</span>,
            cell: ({ row }) => formatDate(row.original.start_date),
        },
        {
            accessorKey: 'end_date',
            header: () => <span>End Date</span>,
            cell: ({ row }) => formatDate(row.original.end_date),
        },
        {
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => onEdit(row.original)}
                        >
                            <Pencil className="size-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive size-8"
                            onClick={() => onDelete(row.original)}
                        >
                            <Trash2 className="size-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    )}
                </div>
            ),
        },
    ];
}
