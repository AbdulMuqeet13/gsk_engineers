import type { FinancialStatementRow } from '@/types';

function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

type SummaryColumn = {
    key: string;
    header: string;
    className?: string;
    render: (row: FinancialStatementRow) => React.ReactNode;
};

export function getCategoryColumns(): SummaryColumn[] {
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
                <span className="capitalize">{row.type}</span>
            ),
        },
        {
            key: 'balance',
            header: 'Amount',
            className: 'text-right',
            render: (row) => (
                <span className="text-right font-mono text-sm">
                    {formatAmount(row.balance)}
                </span>
            ),
        },
    ];
}

type ProjectSummaryRow = {
    project_id: number;
    project_name: string;
    project_code: string;
    total_income: string;
    total_expenses: string;
    net: string;
};

type ProjectColumn = {
    key: string;
    header: string;
    className?: string;
    render: (row: ProjectSummaryRow) => React.ReactNode;
};

export function getProjectColumns(): ProjectColumn[] {
    return [
        {
            key: 'code',
            header: 'Project Code',
            render: (row) => (
                <span className="font-mono text-sm font-medium">
                    {row.project_code}
                </span>
            ),
        },
        {
            key: 'name',
            header: 'Project Name',
            render: (row) => (
                <span className="font-medium">{row.project_name}</span>
            ),
        },
        {
            key: 'income',
            header: 'Income',
            className: 'text-right',
            render: (row) => (
                <span className="text-right font-mono text-sm text-success">
                    {formatAmount(row.total_income)}
                </span>
            ),
        },
        {
            key: 'expenses',
            header: 'Expenses',
            className: 'text-right',
            render: (row) => (
                <span className="text-right font-mono text-sm text-destructive">
                    {formatAmount(row.total_expenses)}
                </span>
            ),
        },
        {
            key: 'net',
            header: 'Net',
            className: 'text-right',
            render: (row) => {
                const netValue = parseFloat(row.net);
                const isNegative = netValue < 0;

                return (
                    <span
                        className={`text-right font-mono text-sm font-bold ${
                            isNegative
                                ? 'text-destructive'
                                : 'text-success'
                        }`}
                    >
                        {formatAmount(row.net)}
                    </span>
                );
            },
        },
    ];
}
