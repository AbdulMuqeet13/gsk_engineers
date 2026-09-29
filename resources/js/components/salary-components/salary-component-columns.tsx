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
import type { SalaryComponent } from '@/types';

type SalaryComponentColumnsOptions = {
    onEdit: (salaryComponent: SalaryComponent) => void;
    onDelete: (salaryComponent: SalaryComponent) => void;
    canManage: boolean;
};

export function getSalaryComponentColumns({
    onEdit,
    onDelete,
    canManage,
}: SalaryComponentColumnsOptions): ColumnDef<SalaryComponent>[] {
    const columns: ColumnDef<SalaryComponent>[] = [
        {
            accessorKey: 'sort_order',
            header: () => <span>Order</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.sort_order}
                </span>
            ),
        },
        {
            accessorKey: 'name',
            header: () => <span>Name</span>,
            cell: ({ row }) => (
                <span className="font-medium">{row.original.name}</span>
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
                        <DropdownMenuItem onClick={() => onEdit(row.original)}>
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
        });
    }

    return columns;
}
