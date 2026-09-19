import { Head, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ExportButtons } from '@/components/reports/export-buttons';
import { getTrialBalanceColumns } from '@/components/trial-balance/trial-balance-columns';
import Heading from '@/components/heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Project, TrialBalanceRow } from '@/types';
import { index } from '@/actions/App/Http/Controllers/TrialBalanceController';
import { dashboard } from '@/routes';

type TrialBalancePageProps = {
    accounts: TrialBalanceRow[];
    grandTotalDebit: string;
    grandTotalCredit: string;
    isBalanced: boolean;
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
};

function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export default function TrialBalance({
    accounts,
    grandTotalDebit,
    grandTotalCredit,
    isBalanced,
    projects = [],
}: TrialBalancePageProps) {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [projectId, setProjectId] = useState<string>('');

    const columns = getTrialBalanceColumns();

    const reloadData = useCallback(
        (params: Record<string, string>) => {
            router.reload({
                only: [
                    'accounts',
                    'grandTotalDebit',
                    'grandTotalCredit',
                    'isBalanced',
                ],
                data: {
                    date_from: params.date_from ?? dateFrom,
                    date_to: params.date_to ?? dateTo,
                    project_id: params.project_id ?? projectId,
                },
            });
        },
        [dateFrom, dateTo, projectId],
    );

    function handleDateFromChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setDateFrom(value);
        reloadData({ date_from: value });
    }

    function handleDateToChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setDateTo(value);
        reloadData({ date_to: value });
    }

    function handleProjectChange(value: string) {
        const resolvedValue = value === 'all' ? '' : value;
        setProjectId(resolvedValue);
        reloadData({ project_id: resolvedValue });
    }

    return (
        <>
            <Head title="Trial Balance" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Trial Balance"
                    description="Verify that total debits equal total credits."
                />

                <div className="flex flex-wrap items-end gap-4">
                    <div className="w-40">
                        <Label htmlFor="date-from">Date From</Label>
                        <Input
                            id="date-from"
                            type="date"
                            value={dateFrom}
                            onChange={handleDateFromChange}
                        />
                    </div>

                    <div className="w-40">
                        <Label htmlFor="date-to">Date To</Label>
                        <Input
                            id="date-to"
                            type="date"
                            value={dateTo}
                            onChange={handleDateToChange}
                        />
                    </div>

                    <div className="w-48">
                        <Label htmlFor="project">Project</Label>
                        <Select
                            value={projectId || 'all'}
                            onValueChange={handleProjectChange}
                        >
                            <SelectTrigger id="project" className="w-full">
                                <SelectValue placeholder="All Projects" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Projects
                                </SelectItem>
                                {projects.map((project) => (
                                    <SelectItem
                                        key={project.id}
                                        value={project.id.toString()}
                                    >
                                        {project.code} - {project.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <ExportButtons
                            exportUrl="/accounting/trial-balance/export"
                            params={{
                                date_from: dateFrom,
                                date_to: dateTo,
                                project_id: projectId,
                            }}
                        />
                        {isBalanced ? (
                            <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-4 py-2 text-sm font-medium text-success">
                                <CheckCircle2 className="size-4" />
                                Trial balance is in balance
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
                                <AlertTriangle className="size-4" />
                                Trial balance is out of balance!
                            </div>
                        )}
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className={col.className}
                                >
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accounts.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-muted-foreground h-24 text-center"
                                >
                                    No accounts with transactions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            accounts.map((account) => (
                                <TableRow key={account.id}>
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            className={col.className}
                                        >
                                            {col.render(account)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="text-right font-bold"
                            >
                                Grand Total
                            </TableCell>
                            <TableCell className="text-right font-bold">
                                {formatAmount(grandTotalDebit)}
                            </TableCell>
                            <TableCell className="text-right font-bold">
                                {formatAmount(grandTotalCredit)}
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </>
    );
}

TrialBalance.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Trial Balance', href: index().url },
    ],
};
