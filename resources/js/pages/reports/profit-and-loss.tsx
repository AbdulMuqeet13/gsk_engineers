import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { ExportButtons } from '@/components/reports/export-buttons';
import { getProfitAndLossColumns } from '@/components/reports/profit-and-loss-columns';
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
import type { FinancialStatementRow, Project } from '@/types';
import { index } from '@/actions/App/Http/Controllers/ProfitAndLossController';
import { dashboard } from '@/routes';

type ProfitAndLossPageProps = {
    incomeAccounts: FinancialStatementRow[];
    expenseAccounts: FinancialStatementRow[];
    totalIncome: string;
    totalExpenses: string;
    netProfit: string;
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
};

function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export default function ProfitAndLoss({
    incomeAccounts,
    expenseAccounts,
    totalIncome,
    totalExpenses,
    netProfit,
    projects = [],
}: ProfitAndLossPageProps) {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [projectId, setProjectId] = useState<string>('');

    const columns = getProfitAndLossColumns();

    const reloadData = useCallback(
        (params: Record<string, string>) => {
            router.reload({
                only: [
                    'incomeAccounts',
                    'expenseAccounts',
                    'totalIncome',
                    'totalExpenses',
                    'netProfit',
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

    const netProfitValue = parseFloat(netProfit);
    const isLoss = netProfitValue < 0;

    return (
        <>
            <Head title="Profit & Loss" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Profit & Loss"
                    description="Income and expenses over a period."
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

                    <div className="ml-auto">
                        <ExportButtons
                            exportUrl="/reports/profit-and-loss/export"
                            params={{
                                date_from: dateFrom,
                                date_to: dateTo,
                                project_id: projectId,
                            }}
                        />
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
                        {/* Income Section */}
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="bg-muted/50 font-semibold"
                            >
                                Income
                            </TableCell>
                        </TableRow>
                        {incomeAccounts.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-muted-foreground text-center italic"
                                >
                                    No income accounts with transactions.
                                </TableCell>
                            </TableRow>
                        ) : (
                            incomeAccounts.map((account) => (
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
                        <TableRow className="border-t-2">
                            <TableCell
                                colSpan={2}
                                className="text-right font-bold"
                            >
                                Total Income
                            </TableCell>
                            <TableCell className="text-right font-bold font-mono text-sm">
                                {formatAmount(totalIncome)}
                            </TableCell>
                        </TableRow>

                        {/* Expense Section */}
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="bg-muted/50 font-semibold"
                            >
                                Expenses
                            </TableCell>
                        </TableRow>
                        {expenseAccounts.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-muted-foreground text-center italic"
                                >
                                    No expense accounts with transactions.
                                </TableCell>
                            </TableRow>
                        ) : (
                            expenseAccounts.map((account) => (
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
                        <TableRow className="border-t-2">
                            <TableCell
                                colSpan={2}
                                className="text-right font-bold"
                            >
                                Total Expenses
                            </TableCell>
                            <TableCell className="text-right font-bold font-mono text-sm">
                                {formatAmount(totalExpenses)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell
                                colSpan={2}
                                className="text-right text-base font-bold"
                            >
                                {isLoss ? 'Net Loss' : 'Net Profit'}
                            </TableCell>
                            <TableCell
                                className={`text-right text-base font-bold font-mono ${
                                    isLoss
                                        ? 'text-destructive'
                                        : 'text-success'
                                }`}
                            >
                                {formatAmount(netProfit)}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </>
    );
}

ProfitAndLoss.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Profit & Loss', href: index().url },
    ],
};
