import { Badge } from '@/components/ui/badge';
import type { TrialBalanceRow } from '@/types';

const accountTypeBadgeVariants: Record<string, 'info-soft' | 'destructive-soft' | 'default' | 'success-soft' | 'warning-soft'> = {
    asset: 'info-soft',
    liability: 'destructive-soft',
    equity: 'default',
    income: 'success-soft',
    expense: 'warning-soft',
};

function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

type TrialBalanceColumn = {
    key: string;
    header: string;
    className?: string;
    render: (row: TrialBalanceRow) => React.ReactNode;
};

export function getTrialBalanceColumns(): TrialBalanceColumn[] {
    return [
        {
            key: 'code',
            header: 'Code',
            render: (row) => (
                <span className="font-mono text-sm font-medium">
                    {row.code}
                </span>
            ),
        },
        {
            key: 'name',
            header: 'Account Name',
            render: (row) => (
                <span className="font-medium">{row.name}</span>
            ),
        },
        {
            key: 'type',
            header: 'Type',
            render: (row) => (
                <Badge
                    variant={accountTypeBadgeVariants[row.type] ?? 'secondary'}
                >
                    {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
                </Badge>
            ),
        },
        {
            key: 'total_debit',
            header: 'Total Debit',
            className: 'text-right',
            render: (row) => (
                <span className="text-right">
                    {formatAmount(row.total_debit)}
                </span>
            ),
        },
        {
            key: 'total_credit',
            header: 'Total Credit',
            className: 'text-right',
            render: (row) => (
                <span className="text-right">
                    {formatAmount(row.total_credit)}
                </span>
            ),
        },
        {
            key: 'balance',
            header: 'Balance',
            className: 'text-right',
            render: (row) => {
                const balanceValue = parseFloat(row.balance);
                const isNegative = balanceValue < 0;

                return (
                    <span
                        className={`text-right font-bold ${isNegative ? 'text-destructive' : ''}`}
                    >
                        {formatAmount(row.balance)}
                    </span>
                );
            },
        },
    ];
}
