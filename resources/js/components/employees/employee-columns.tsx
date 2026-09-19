import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableSortHeader } from '@/components/data-table/data-table-header';
import type { Employee, SortState } from '@/types';

type EmployeeColumnsOptions = {
    sort: SortState | null;
    onSort: (column: string) => void;
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
};

export function getEmployeeColumns({
    sort,
    onSort,
    onEdit,
    onDelete,
}: EmployeeColumnsOptions): ColumnDef<Employee>[] {
    return [
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
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => row.original.email ?? '—',
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: ({ row }) => row.original.phone ?? '—',
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => (
                <Badge
                    variant={
                        row.original.type === 'internal'
                            ? 'default'
                            : 'secondary'
                    }
                >
                    {row.original.type === 'internal' ? 'Internal' : 'Project'}
                </Badge>
            ),
        },
        {
            accessorKey: 'department',
            header: 'Department',
        },
        {
            accessorKey: 'designation',
            header: 'Designation',
        },
        {
            id: 'project',
            header: 'Project',
            cell: ({ row }) =>
                row.original.type === 'project' && row.original.project
                    ? row.original.project.name
                    : '—',
        },
        {
            accessorKey: 'salary',
            header: 'Salary',
            cell: ({ row }) =>
                new Intl.NumberFormat('en-PK').format(
                    Number(row.original.salary),
                ),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <Badge
                    variant={
                        row.original.is_active ? 'default' : 'secondary'
                    }
                >
                    {row.original.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => onEdit(row.original)}
                        >
                            <Pencil className="mr-2 size-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(row.original)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];
}
