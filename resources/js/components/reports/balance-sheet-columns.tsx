import type { FinancialStatementRow } from '@/types';

function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

type FinancialStatementColumn = {
    key: string;
    header: string;
    className?: string;
    render: (row: FinancialStatementRow) => React.ReactNode;
};

export function getBalanceSheetColumns(): FinancialStatementColumn[] {
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
            key: 'balance',
            header: 'Balance',
            className: 'text-right',
            render: (row) => (
                <span className="text-right font-mono text-sm">
                    {formatAmount(row.balance)}
                </span>
            ),
        },
    ];
}
