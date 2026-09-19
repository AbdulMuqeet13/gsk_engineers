import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { ExportButtons } from '@/components/reports/export-buttons';
import {
    getCategoryColumns,
    getProjectColumns,
} from '@/components/reports/income-expense-summary-columns';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
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
import { index } from '@/actions/App/Http/Controllers/IncomeExpenseSummaryController';
import { dashboard } from '@/routes';

type ProjectSummaryRow = {
    project_id: number;
    project_name: string;
    project_code: string;
    total_income: string;
    total_expenses: string;
    net: string;
};

type IncomeExpenseSummaryPageProps = {
    rows: FinancialStatementRow[] | ProjectSummaryRow[];
    totalIncome: string;
    totalExpenses: string;
    netProfit: string;
    groupBy: 'category' | 'project';
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
};

function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export default function IncomeExpenseSummary({
    rows,
    totalIncome,
    totalExpenses,
    netProfit,
    groupBy,
    projects = [],
}: IncomeExpenseSummaryPageProps) {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [projectId, setProjectId] = useState<string>('');
    const [currentGroupBy, setCurrentGroupBy] = useState(groupBy);

    const reloadData = useCallback(
        (params: Record<string, string>) => {
            router.reload({
                only: ['rows', 'totalIncome', 'totalExpenses', 'netProfit', 'groupBy'],
                data: {
                    date_from: params.date_from ?? dateFrom,
                    date_to: params.date_to ?? dateTo,
                    project_id: params.project_id ?? projectId,
                    group_by: params.group_by ?? currentGroupBy,
                },
            });
        },
        [dateFrom, dateTo, projectId, currentGroupBy],
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

    function handleGroupByChange(value: string) {
        setCurrentGroupBy(value as 'category' | 'project');
        reloadData({ group_by: value });
    }

    const netProfitValue = parseFloat(netProfit);
    const isLoss = netProfitValue < 0;

    const categoryColumns = getCategoryColumns();
    const projectColumns = getProjectColumns();

    return (
        <>
            <Head title="Income & Expense Summary" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Income & Expense Summary"
                    description="Summary of income and expenses by category or project."
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

                    <div className="flex gap-1">
                        <Button
                            variant={
                                currentGroupBy === 'category'
                                    ? 'default'
                                    : 'outline'
                            }
                            size="sm"
                            onClick={() => handleGroupByChange('category')}
                        >
                            By Category
                        </Button>
                        <Button
                            variant={
                                currentGroupBy === 'project'
                                    ? 'default'
                                    : 'outline'
                            }
                            size="sm"
                            onClick={() => handleGroupByChange('project')}
                        >
                            By Project
                        </Button>
                    </div>

                    <div className="ml-auto">
                        <ExportButtons
                            exportUrl="/reports/income-expense-summary/export"
                            params={{
                                date_from: dateFrom,
                                date_to: dateTo,
                                project_id: projectId,
                                group_by: currentGroupBy,
                            }}
                        />
                    </div>
                </div>

                {currentGroupBy === 'category' ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {categoryColumns.map((col) => (
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
                            {(rows as FinancialStatementRow[]).length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={categoryColumns.length}
                                        className="text-muted-foreground h-24 text-center"
                                    >
                                        No accounts with transactions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                (rows as FinancialStatementRow[]).map(
                                    (row) => (
                                        <TableRow key={row.id}>
                                            {categoryColumns.map((col) => (
                                                <TableCell
                                                    key={col.key}
                                                    className={col.className}
                                                >
                                                    {col.render(row)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ),
                                )
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} className="text-right font-bold">
                                    Income / Expenses / Net
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                    <div className="text-success">
                                        {formatAmount(totalIncome)}
                                    </div>
                                    <div className="text-destructive">
                                        {formatAmount(totalExpenses)}
                                    </div>
                                    <div
                                        className={`font-bold ${
                                            isLoss
                                                ? 'text-destructive'
                                                : 'text-success'
                                        }`}
                                    >
                                        {formatAmount(netProfit)}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {projectColumns.map((col) => (
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
                            {(rows as ProjectSummaryRow[]).length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={projectColumns.length}
                                        className="text-muted-foreground h-24 text-center"
                                    >
                                        No project transactions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                (rows as ProjectSummaryRow[]).map((row) => (
                                    <TableRow key={row.project_id}>
                                        {projectColumns.map((col) => (
                                            <TableCell
                                                key={col.key}
                                                className={col.className}
                                            >
                                                {col.render(row)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="text-right font-bold"
                                >
                                    Totals
                                </TableCell>
                                <TableCell className="text-right font-bold font-mono text-sm text-success">
                                    {formatAmount(totalIncome)}
                                </TableCell>
                                <TableCell className="text-right font-bold font-mono text-sm text-destructive">
                                    {formatAmount(totalExpenses)}
                                </TableCell>
                                <TableCell
                                    className={`text-right font-bold font-mono text-sm ${
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
                )}
            </div>
        </>
    );
}

IncomeExpenseSummary.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Income & Expense Summary', href: index().url },
    ],
};
