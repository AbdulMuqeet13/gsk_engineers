import { Head, router } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import { useCallback, useState } from 'react';
import { DatePicker } from '@/components/date-picker';
import { ExportButtons } from '@/components/reports/export-buttons';
import { getProjectLedgerColumns } from '@/components/reports/project-ledger-columns';
import Heading from '@/components/heading';
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
import type {
    AccountHead,
    Employee,
    Project,
    ProjectLedgerRow,
} from '@/types';
import { index } from '@/actions/App/Http/Controllers/ProjectLedgerController';
import { dashboard } from '@/routes';

type ProjectLedgerPageProps = {
    rows: ProjectLedgerRow[];
    totalDebit: string;
    totalCredit: string;
    accountHeads: Pick<
        AccountHead,
        'id' | 'code' | 'name' | 'type' | 'normal_balance'
    >[];
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
    employees: Pick<Employee, 'id' | 'name' | 'designation'>[];
};

function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export default function ProjectLedger({
    rows,
    totalDebit,
    totalCredit,
    accountHeads,
    projects = [],
    employees = [],
}: ProjectLedgerPageProps) {
    const [projectId, setProjectId] = useState<string>('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [accountHeadId, setAccountHeadId] = useState<string>('');
    const [employeeId, setEmployeeId] = useState<string>('');

    const columns = getProjectLedgerColumns();

    const reloadData = useCallback(
        (params: Record<string, string>) => {
            router.reload({
                only: ['rows', 'totalDebit', 'totalCredit', 'employees'],
                data: {
                    project_id: params.project_id ?? projectId,
                    date_from: params.date_from ?? dateFrom,
                    date_to: params.date_to ?? dateTo,
                    account_head_id: params.account_head_id ?? accountHeadId,
                    employee_id: params.employee_id ?? employeeId,
                },
            });
        },
        [projectId, dateFrom, dateTo, accountHeadId, employeeId],
    );

    function handleProjectChange(value: string) {
        setProjectId(value);
        setEmployeeId('');
        reloadData({ project_id: value, employee_id: '' });
    }

    function handleDateFromChange(value: string) {
        setDateFrom(value);
        if (projectId) {
            reloadData({ date_from: value });
        }
    }

    function handleDateToChange(value: string) {
        setDateTo(value);
        if (projectId) {
            reloadData({ date_to: value });
        }
    }

    function handleAccountChange(value: string) {
        const resolvedValue = value === 'all' ? '' : value;
        setAccountHeadId(resolvedValue);
        if (projectId) {
            reloadData({ account_head_id: resolvedValue });
        }
    }

    function handleEmployeeChange(value: string) {
        const resolvedValue = value === 'all' ? '' : value;
        setEmployeeId(resolvedValue);
        reloadData({ employee_id: resolvedValue });
    }

    return (
        <>
            <Head title="Project Ledger" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Project Ledger"
                    description="All posted transactions for a project."
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
                        <DatePicker
                            id="date-from"
                            value={dateFrom}
                            onChange={handleDateFromChange}
                            clearable
                        />
                    </div>

                    <div className="w-40">
                        <Label htmlFor="date-to">Date To</Label>
                        <DatePicker
                            id="date-to"
                            value={dateTo}
                            onChange={handleDateToChange}
                            clearable
                        />
                    </div>

                    <div className="w-64">
                        <Label htmlFor="account-head">Account</Label>
                        <Select
                            value={accountHeadId || 'all'}
                            onValueChange={handleAccountChange}
                        >
                            <SelectTrigger id="account-head" className="w-full">
                                <SelectValue placeholder="All Accounts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Accounts
                                </SelectItem>
                                {accountHeads.map((account) => (
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

                    <div className="w-56">
                        <Label htmlFor="employee">Employee</Label>
                        <Select
                            value={employeeId || 'all'}
                            onValueChange={handleEmployeeChange}
                            disabled={!projectId}
                        >
                            <SelectTrigger id="employee" className="w-full">
                                <SelectValue placeholder="All Employees" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Employees</SelectItem>
                                {employees.map((employee) => (
                                    <SelectItem
                                        key={employee.id}
                                        value={employee.id.toString()}
                                    >
                                        {employee.name} — {employee.designation}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {projectId && (
                        <div className="ml-auto">
                            <ExportButtons
                                exportUrl="/reports/project-ledger/export"
                                params={{
                                    project_id: projectId,
                                    date_from: dateFrom,
                                    date_to: dateTo,
                                    account_head_id: accountHeadId,
                                    employee_id: employeeId,
                                }}
                            />
                        </div>
                    )}
                </div>

                {employeeId && (
                    <p className="text-muted-foreground text-sm">
                        Showing this employee's project allowances from
                        approved payroll runs.
                    </p>
                )}

                {!projectId ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-12">
                        <BookOpen className="text-muted-foreground size-12" />
                        <h3 className="text-lg font-semibold">
                            Select a Project
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Choose a project from the dropdown above to view its
                            ledger.
                        </p>
                    </div>
                ) : (
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
                                        No transactions found for this project.
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
                                    colSpan={5}
                                    className="text-right font-bold"
                                >
                                    Totals
                                </TableCell>
                                <TableCell className="text-right font-mono font-bold">
                                    {formatAmount(totalDebit)}
                                </TableCell>
                                <TableCell className="text-right font-mono font-bold">
                                    {formatAmount(totalCredit)}
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        </TableFooter>
                    </Table>
                )}
            </div>
        </>
    );
}

ProjectLedger.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Project Ledger', href: index().url },
    ],
};
