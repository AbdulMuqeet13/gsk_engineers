import { type ColumnDef, tableFeatures, useTable } from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { PaginationMeta, SortState } from '@/types';
import { DataTableEmpty } from './data-table-empty';
import { DataTablePagination } from './data-table-pagination';
import { DataTableSkeleton } from './data-table-skeleton';

const features = tableFeatures({});

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<typeof features, TData, TValue>[];
    data: TData[];
    meta?: PaginationMeta;
    sort?: SortState | null;
    onSort?: (column: string) => void;
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    isLoading?: boolean;
    emptyMessage?: string;
    emptyDescription?: string;
    toolbar?: React.ReactNode;
};

export function DataTable<TData, TValue>({
    columns,
    data,
    meta,
    sort,
    onSort,
    onPageChange,
    onPerPageChange,
    isLoading = false,
    emptyMessage = 'No results found.',
    emptyDescription = 'Try adjusting your search or filters.',
    toolbar,
}: DataTableProps<TData, TValue>) {
    const table = useTable({
        features,
        data,
        columns,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        rowCount: meta?.total ?? 0,
    });

    return (
        <div className="space-y-4">
            {toolbar}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : (
                                                <table.FlexRender
                                                    header={header}
                                                />
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <DataTableSkeleton
                                columnCount={columns.length}
                            />
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-48"
                                >
                                    <DataTableEmpty
                                        message={emptyMessage}
                                        description={emptyDescription}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {meta && (
                <DataTablePagination
                    meta={meta}
                    onPageChange={onPageChange}
                    onPerPageChange={onPerPageChange}
                />
            )}
        </div>
    );
}
