import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, RotateCcw, Send, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableSortHeader } from '@/components/data-table/data-table-header';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { JournalEntry, SortState } from '@/types';

type JournalEntryColumnsOptions = {
    sort?: SortState | null;
    onSort?: (column: string) => void;
    onEdit?: (entry: JournalEntry) => void;
    onPost?: (entry: JournalEntry) => void;
    onReverse?: (entry: JournalEntry) => void;
    onDelete?: (entry: JournalEntry) => void;
    canCreate: boolean;
    canPost: boolean;
    canReverse: boolean;
};

const typeBadgeVariants: Record<string, 'info-soft' | 'secondary' | 'default' | 'warning-soft' | 'outline'> = {
    standard: 'info-soft',
    simple: 'secondary',
    payroll: 'default',
    transfer: 'warning-soft',
    opening: 'outline',
};

function computeTotal(entry: JournalEntry): string {
    if (!entry.lines || entry.lines.length === 0) {
        return '0.00';
    }

    let total = 0;

    for (const line of entry.lines) {
        total += parseFloat(line.debit || '0');
    }

    return total.toFixed(2);
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function getJournalEntryColumns({
    sort,
    onSort,
    onEdit,
    onPost,
    onReverse,
    onDelete,
    canCreate,
    canPost,
    canReverse,
}: JournalEntryColumnsOptions): ColumnDef<JournalEntry>[] {
    const columns: ColumnDef<JournalEntry>[] = [
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
            accessorKey: 'type',
            header: () => <span>Type</span>,
            cell: ({ row }) => (
                <Badge
                    variant={typeBadgeVariants[row.original.type] ?? 'secondary'}
                >
                    {row.original.type.charAt(0).toUpperCase() +
                        row.original.type.slice(1)}
                </Badge>
            ),
        },
        {
            accessorKey: 'status',
            header: () => <span>Status</span>,
            cell: ({ row }) => (
                <Badge
                    variant={
                        row.original.status === 'posted' ? 'success-soft' : 'secondary'
                    }
                >
                    {row.original.status.charAt(0).toUpperCase() +
                        row.original.status.slice(1)}
                </Badge>
            ),
        },
        {
            accessorKey: 'lines_count',
            header: () => <span>Lines</span>,
            cell: ({ row }) => (
                <span className="text-sm">{row.original.lines_count ?? 0}</span>
            ),
        },
        {
            id: 'total',
            header: () => <span>Total</span>,
            cell: ({ row }) => (
                <span className="font-mono text-sm">
                    {computeTotal(row.original)}
                </span>
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
    ];

    const hasActions = canCreate || canPost || canReverse;

    if (hasActions) {
        columns.push({
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const entry = row.original;
                const isDraft = entry.status === 'draft';
                const isPosted = entry.status === 'posted';
                const isReversed = !!entry.reversed_by_id;

                const showEdit = isDraft && canCreate;
                const showPost = isDraft && canPost;
                const showReverse = isPosted && !isReversed && canReverse;
                const showDelete = isDraft && canCreate;

                if (!showEdit && !showPost && !showReverse && !showDelete) {
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
                            {showEdit && (
                                <DropdownMenuItem
                                    onClick={() => onEdit?.(entry)}
                                >
                                    <Pencil className="mr-2 size-4" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {showPost && (
                                <DropdownMenuItem
                                    onClick={() => onPost?.(entry)}
                                >
                                    <Send className="mr-2 size-4" />
                                    Post
                                </DropdownMenuItem>
                            )}
                            {showReverse && (
                                <DropdownMenuItem
                                    onClick={() => onReverse?.(entry)}
                                >
                                    <RotateCcw className="mr-2 size-4" />
                                    Reverse
                                </DropdownMenuItem>
                            )}
                            {showDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete?.(entry)}
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
        });
    }

    return columns;
}
