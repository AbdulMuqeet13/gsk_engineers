import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableSortHeader } from '@/components/data-table/data-table-header';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ProjectAssignment, SortState } from '@/types';

type AssignmentColumnsOptions = {
    sort?: SortState | null;
    onSort?: (column: string) => void;
    onEdit: (assignment: ProjectAssignment) => void;
    onDelete: (assignment: ProjectAssignment) => void;
};

export function getAssignmentColumns({
    sort,
    onSort,
    onEdit,
    onDelete,
}: AssignmentColumnsOptions): ColumnDef<ProjectAssignment>[] {
    return [
        {
            accessorKey: 'employee.name',
            header: () => (
                <DataTableSortHeader
                    column="employee_name"
                    label="Employee"
                    sort={sort}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => row.original.employee?.name ?? '-',
        },
        {
            accessorKey: 'project.name',
            header: () => (
                <DataTableSortHeader
                    column="project_name"
                    label="Project"
                    sort={sort}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => {
                const project = row.original.project;

                if (!project) {
                    return '-';
                }

                return (
                    <span>
                        {project.name}{' '}
                        <span className="text-muted-foreground text-xs">
                            ({project.code})
                        </span>
                    </span>
                );
            },
        },
        {
            accessorKey: 'role',
            header: () => (
                <DataTableSortHeader
                    column="role"
                    label="Role"
                    sort={sort}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => row.original.role,
        },
        {
            accessorKey: 'allocation_percent',
            header: () => (
                <DataTableSortHeader
                    column="allocation_percent"
                    label="Allocation %"
                    sort={sort}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => `${row.original.allocation_percent}%`,
        },
        {
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const assignment = row.original;

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
                                onClick={() => onEdit(assignment)}
                            >
                                <Pencil className="mr-2 size-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(assignment)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 size-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}
