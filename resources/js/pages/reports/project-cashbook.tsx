import { Head, router } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ExportButtons } from '@/components/reports/export-buttons';
import { getProjectCashbookColumns } from '@/components/reports/project-cashbook-columns';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { AccountHead, CashbookRow, CashbookSummary, Project } from '@/types';
import { index } from '@/actions/App/Http/Controllers/ProjectCashbookController';
import { dashboard } from '@/routes';

type ProjectCashbookPageProps = {
    rows: CashbookRow[];
    summary: CashbookSummary;
    cashAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
};

function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export default function ProjectCashbook({
    rows,
    summary,
    cashAccounts,
    projects = [],
}: ProjectCashbookPageProps) {
    const [projectId, setProjectId] = useState<string>('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [accountId, setAccountId] = useState<string>('');

    const columns = getProjectCashbookColumns();

    const reloadData = useCallback(
        (params: Record<string, string>) => {
            router.reload({
                only: ['rows', 'summary'],
                data: {
                    project_id: params.project_id ?? projectId,
                    date_from: params.date_from ?? dateFrom,
                    date_to: params.date_to ?? dateTo,
                    account_id: params.account_id ?? accountId,
                },
            });
        },
        [projectId, dateFrom, dateTo, accountId],
    );

    function handleProjectChange(value: string) {
        setProjectId(value);
        reloadData({ project_id: value });
    }

    function handleDateFromChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setDateFrom(value);
        if (projectId) {
            reloadData({ date_from: value });
        }
    }

    function handleDateToChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setDateTo(value);
        if (projectId) {
            reloadData({ date_to: value });
        }
    }

    function handleAccountChange(value: string) {
        const resolvedValue = value === 'all' ? '' : value;
        setAccountId(resolvedValue);
        if (projectId) {
            reloadData({ account_id: resolvedValue });
        }
    }

    return (
        <>
            <Head title="Project Cashbook" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Project Cashbook"
                    description="Cash inflows and outflows for a project."
                />

                <div className="flex flex-wrap items-end gap-4">
                    <div className="w-56">
                        <Label htmlFor="project">Project</Label>
                        <Select
                            value={projectId || undefined}
                            onValueChange={handleProjectChange}
                        >
                            <SelectTrigger id="project" className="w-full">
                                <SelectValue placeholder="Select a project..." />
                            </SelectTrigger>
                            <SelectContent>
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
                        <Label htmlFor="account">Account</Label>
                        <Select
                            value={accountId || 'all'}
                            onValueChange={handleAccountChange}
                        >
                            <SelectTrigger id="account" className="w-full">
                                <SelectValue placeholder="All Accounts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Accounts</SelectItem>
                                {cashAccounts.map((account) => (
                                    <SelectItem
                                        key={account.id}
                                        value={account.id.toString()}
                                    >
                                        {account.code} - {account.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {projectId && (
                        <div className="ml-auto">
                            <ExportButtons
                                exportUrl="/reports/project-cashbook/export"
                                params={{
                                    project_id: projectId,
                                    date_from: dateFrom,
                                    date_to: dateTo,
                                    account_id: accountId,
                                }}
                            />
                        </div>
                    )}
                </div>

                {!projectId ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-12">
                        <BookOpen className="text-muted-foreground size-12" />
                        <h3 className="text-lg font-semibold">
                            Select a Project
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Choose a project from the dropdown above to view its
                            cashbook.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-muted-foreground text-sm font-medium">
                                        Opening Balance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl font-bold font-mono">
                                        {formatAmount(summary.openingBalance)}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-muted-foreground text-sm font-medium">
                                        Total In
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl font-bold font-mono text-success">
                                        {formatAmount(summary.totalIn)}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-muted-foreground text-sm font-medium">
                                        Total Out
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl font-bold font-mono text-destructive">
                                        {formatAmount(summary.totalOut)}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-muted-foreground text-sm font-medium">
                                        Closing Balance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl font-bold font-mono">
                                        {formatAmount(summary.closingBalance)}
                                    </div>
                                </CardContent>
                            </Card>
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
                                {rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="text-muted-foreground h-24 text-center"
                                        >
                                            No cash transactions found for this
                                            project.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {columns.map((col) => (
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
                                        colSpan={4}
                                        className="text-right font-bold"
                                    >
                                        Totals
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold text-success">
                                        {formatAmount(summary.totalIn)}
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold text-destructive">
                                        {formatAmount(summary.totalOut)}
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold">
                                        {formatAmount(summary.closingBalance)}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </>
                )}
            </div>
        </>
    );
}

ProjectCashbook.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Project Cashbook', href: index().url },
    ],
};
