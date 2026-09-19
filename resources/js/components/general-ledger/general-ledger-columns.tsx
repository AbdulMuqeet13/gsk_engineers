import type { JournalLine } from '@/types';

type GeneralLedgerLine = JournalLine & { running_balance: string };

function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

type GeneralLedgerColumn = {
    key: string;
    header: string;
    className?: string;
    render: (line: GeneralLedgerLine) => React.ReactNode;
};

export function getGeneralLedgerColumns(): GeneralLedgerColumn[] {
    return [
        {
            key: 'date',
            header: 'Date',
            render: (line) => line.journal_entry?.date ?? '-',
        },
        {
            key: 'reference',
            header: 'Reference',
            render: (line) => (
                <span className="font-mono text-sm">
                    {line.journal_entry?.reference ?? '-'}
                </span>
            ),
        },
        {
            key: 'description',
            header: 'Description',
            render: (line) => line.journal_entry?.description ?? '-',
        },
        {
            key: 'project',
            header: 'Project',
            render: (line) => line.project?.name ?? '-',
        },
        {
            key: 'debit',
            header: 'Debit',
            className: 'text-right',
            render: (line) => (
                <span className="text-right">
                    {parseFloat(line.debit) > 0 ? formatAmount(line.debit) : ''}
                </span>
            ),
        },
        {
            key: 'credit',
            header: 'Credit',
            className: 'text-right',
            render: (line) => (
                <span className="text-right">
                    {parseFloat(line.credit) > 0
                        ? formatAmount(line.credit)
                        : ''}
                </span>
            ),
        },
        {
            key: 'running_balance',
            header: 'Balance',
            className: 'text-right',
            render: (line) => (
                <span className="text-right font-bold">
                    {formatAmount(line.running_balance)}
                </span>
            ),
        },
    ];
}
