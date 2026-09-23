import type { CashbookRow } from '@/types';

function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

type CashbookColumn = {
    key: string;
    header: string;
    className?: string;
    render: (row: CashbookRow) => React.ReactNode;
};

export function getProjectCashbookColumns(): CashbookColumn[] {
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
            key: 'money_in',
            header: 'Money In',
            className: 'text-right',
            render: (row) =>
                parseFloat(row.money_in) > 0 ? (
                    <span className="text-success font-mono">
                        {formatAmount(row.money_in)}
                    </span>
                ) : null,
        },
        {
            key: 'money_out',
            header: 'Money Out',
            className: 'text-right',
            render: (row) =>
                parseFloat(row.money_out) > 0 ? (
                    <span className="text-destructive font-mono">
                        {formatAmount(row.money_out)}
                    </span>
                ) : null,
        },
        {
            key: 'balance',
            header: 'Balance',
            className: 'text-right',
            render: (row) => (
                <span className="font-mono font-bold">
                    {formatAmount(row.balance)}
                </span>
            ),
        },
    ];
}
