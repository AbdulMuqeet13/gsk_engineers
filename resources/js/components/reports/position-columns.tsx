import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import type { InterProjectPosition } from '@/types';

function formatAmount(amount: string): string {
    return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
    });
}

export function getPositionColumns(): ColumnDef<InterProjectPosition>[] {
    return [
        {
            id: 'project_a',
            header: () => <span>Project A</span>,
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.project_a.code} -{' '}
                    {row.original.project_a.name}
                </Badge>
            ),
        },
        {
            id: 'project_b',
            header: () => <span>Project B</span>,
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.project_b.code} -{' '}
                    {row.original.project_b.name}
                </Badge>
            ),
        },
        {
            id: 'a_to_b',
            header: () => <span className="text-right">A sent to B</span>,
            cell: ({ row }) => (
                <span className="block text-right font-mono text-sm">
                    {formatAmount(row.original.a_to_b)}
                </span>
            ),
        },
        {
            id: 'b_to_a',
            header: () => <span className="text-right">B sent to A</span>,
            cell: ({ row }) => (
                <span className="block text-right font-mono text-sm">
                    {formatAmount(row.original.b_to_a)}
                </span>
            ),
        },
        {
            id: 'net',
            header: () => <span className="text-right">Net (A owes B)</span>,
            cell: ({ row }) => {
                const net = parseFloat(row.original.net);
                const isPositive = net > 0;
                const isNegative = net < 0;

                return (
                    <span
                        className={`block text-right font-mono text-sm font-medium ${
                            isPositive
                                ? 'text-success'
                                : isNegative
                                  ? 'text-destructive'
                                  : 'text-muted-foreground'
                        }`}
                    >
                        {isPositive ? '+' : ''}
                        {formatAmount(row.original.net)}
                    </span>
                );
            },
        },
    ];
}
