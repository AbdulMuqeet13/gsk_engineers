import { Badge } from '@/components/ui/badge';
import type { ProjectLedgerRow } from '@/types';

function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

const accountTypeBadgeVariants: Record<
    string,
    'info-soft' | 'destructive-soft' | 'default' | 'success-soft' | 'warning-soft'
> = {
    asset: 'info-soft',
    liability: 'destructive-soft',
    equity: 'default',
    income: 'success-soft',
    expense: 'warning-soft',
};

type LedgerColumn = {
    key: string;
    header: string;
    className?: string;
    render: (row: ProjectLedgerRow) => React.ReactNode;
};

export function getProjectLedgerColumns(): LedgerColumn[] {
    return [
        {
            key: 'date',
            header: 'Date',
            render: (row) => row.date,
        },
        {
            key: 'reference',
            header: 'Reference',
            render: (row) => (
                <span className="font-mono text-sm">{row.reference}</span>
            ),
        },
        {
            key: 'description',
            header: 'Description',
            render: (row) => row.description,
        },
        {
            key: 'account',
            header: 'Account',
            render: (row) => (
                <span className="text-muted-foreground text-sm">
                    {row.account.code} - {row.account.name}
                </span>
            ),
        },
        {
            key: 'type',
            header: 'Type',
            render: (row) => (
                <Badge variant={accountTypeBadgeVariants[row.account.type] ?? 'secondary'}>
                    {row.account.type.charAt(0).toUpperCase() + row.account.type.slice(1)}
                </Badge>
            ),
        },
        {
            key: 'debit',
            header: 'Debit',
            className: 'text-right',
            render: (row) =>
                parseFloat(row.debit) > 0 ? (
                    <span className="font-mono">{formatAmount(row.debit)}</span>
                ) : null,
        },
        {
            key: 'credit',
            header: 'Credit',
            className: 'text-right',
            render: (row) =>
                parseFloat(row.credit) > 0 ? (
                    <span className="font-mono">{formatAmount(row.credit)}</span>
                ) : null,
        },
        {
            key: 'balance',
            header: 'Balance',
            className: 'text-right',
            render: (row) =>
                row.balance !== null ? (
                    <span className="font-mono font-bold">
                        {formatAmount(row.balance)}
                    </span>
                ) : (
                    <span className="text-muted-foreground">—</span>
                ),
        },
    ];
}
