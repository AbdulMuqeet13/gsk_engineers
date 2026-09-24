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
import type { BiometricDevice, SortState } from '@/types';

type DeviceColumnsOptions = {
    sort?: SortState | null;
    onSort?: (column: string) => void;
    onEdit?: (device: BiometricDevice) => void;
    onDelete?: (device: BiometricDevice) => void;
};

export function getDeviceColumns({
    sort,
    onSort,
    onEdit,
    onDelete,
}: DeviceColumnsOptions): ColumnDef<BiometricDevice>[] {
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
                <span className="text-sm font-medium">
                    {row.original.name}
                </span>
            ),
        },
        {
            accessorKey: 'serial_number',
            header: () => <span>Serial Number</span>,
            cell: ({ row }) => (
                <code className="text-muted-foreground text-sm">
                    {row.original.serial_number}
                </code>
            ),
        },
        {
            accessorKey: 'model',
            header: () => <span>Model</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.model ?? '--'}
                </span>
            ),
        },
        {
            accessorKey: 'location',
            header: () => <span>Location</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.location ?? '--'}
                </span>
            ),
        },
        {
            accessorKey: 'last_heartbeat_at',
            header: () => <span>Last Heartbeat</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.last_heartbeat_at ?? 'Never'}
                </span>
            ),
        },
        {
            accessorKey: 'is_active',
            header: () => <span>Status</span>,
            cell: ({ row }) => (
                <Badge
                    variant={
                        row.original.is_active
                            ? 'success-soft'
                            : 'destructive-soft'
                    }
                >
                    {row.original.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const device = row.original;

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
                                onClick={() => onEdit?.(device)}
                            >
                                <Pencil className="mr-2 size-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete?.(device)}
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
