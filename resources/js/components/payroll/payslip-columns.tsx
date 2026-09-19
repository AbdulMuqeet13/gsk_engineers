import type { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Payslip } from '@/types';

type PayslipColumnsOptions = {
    onEdit?: (payslip: Payslip) => void;
    canRun: boolean;
    isDraft: boolean;
};

function formatAmount(amount: string): string {
    return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
    });
}

export function getPayslipColumns({
    onEdit,
    canRun,
    isDraft,
}: PayslipColumnsOptions): ColumnDef<Payslip>[] {
    const columns: ColumnDef<Payslip>[] = [
        {
            id: 'employee_name',
            header: () => <span>Employee Name</span>,
            cell: ({ row }) => (
                <span className="text-sm font-medium">
                    {row.original.employee?.name ?? '--'}
                </span>
            ),
        },
        {
            id: 'department',
            header: () => <span>Department</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.employee?.department ?? '--'}
                </span>
            ),
        },
        {
            id: 'designation',
            header: () => <span>Designation</span>,
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.employee?.designation ?? '--'}
                </span>
            ),
        },
        {
            accessorKey: 'basic_salary',
            header: () => <span className="text-right">Basic Salary</span>,
            cell: ({ row }) => (
                <span className="block text-right font-mono text-sm">
                    {formatAmount(row.original.basic_salary)}
                </span>
            ),
        },
        {
            accessorKey: 'deductions',
            header: () => <span className="text-right">Deductions</span>,
            cell: ({ row }) => (
                <span className="block text-right font-mono text-sm">
                    {formatAmount(row.original.deductions)}
                </span>
            ),
        },
        {
            accessorKey: 'net_salary',
            header: () => <span className="text-right">Net Salary</span>,
            cell: ({ row }) => (
                <span className="block text-right font-mono text-sm font-medium">
                    {formatAmount(row.original.net_salary)}
                </span>
            ),
        },
        {
            accessorKey: 'days_worked',
            header: () => <span>Days Worked</span>,
            cell: ({ row }) => (
                <span className="text-sm">{row.original.days_worked}</span>
            ),
        },
        {
            accessorKey: 'days_absent',
            header: () => <span>Days Absent</span>,
            cell: ({ row }) => (
                <span className="text-sm">{row.original.days_absent}</span>
            ),
        },
        {
            accessorKey: 'notes',
            header: () => <span>Notes</span>,
            cell: ({ row }) => (
                <span
                    className="text-muted-foreground block max-w-[150px] truncate text-sm"
                    title={row.original.notes ?? ''}
                >
                    {row.original.notes ?? '--'}
                </span>
            ),
        },
    ];

    if (isDraft && canRun) {
        columns.push({
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => onEdit?.(row.original)}
                >
                    <Pencil className="size-4" />
                    <span className="sr-only">Edit payslip</span>
                </Button>
            ),
        });
    }

    return columns;
}
