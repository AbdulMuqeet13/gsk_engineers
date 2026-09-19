import { Head, router } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Users, Wallet } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ExportButtons } from '@/components/reports/export-buttons';
import {
    getRunColumns,
    getSlipColumns,
    type PayrollReportRun,
} from '@/components/reports/payroll-report-columns';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index } from '@/actions/App/Http/Controllers/PayrollReportController';
import { dashboard } from '@/routes';

type PayrollReportPageProps = {
    runs: PayrollReportRun[];
    totalRuns: number;
    totalEmployees: number;
    totalDisbursed: string;
};

function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export default function PayrollReport({
    runs,
    totalRuns,
    totalEmployees,
    totalDisbursed,
}: PayrollReportPageProps) {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [expandedRuns, setExpandedRuns] = useState<Set<number>>(new Set());

    const runColumns = getRunColumns();
    const slipColumns = getSlipColumns();

    const reloadData = useCallback(
        (params: Record<string, string>) => {
            router.reload({
                only: ['runs', 'totalRuns', 'totalEmployees', 'totalDisbursed'],
                data: {
                    date_from: params.date_from ?? dateFrom,
                    date_to: params.date_to ?? dateTo,
                },
            });
        },
        [dateFrom, dateTo],
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

    function toggleRun(runId: number) {
        setExpandedRuns((prev) => {
            const next = new Set(prev);
            if (next.has(runId)) {
                next.delete(runId);
            } else {
                next.add(runId);
            }

            return next;
        });
    }

    return (
        <>
            <Head title="Payroll Report" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Payroll Report"
                    description="Summary of approved payroll runs with employee breakdowns."
                />

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">
                                Payroll Runs
                            </CardTitle>
                            <Wallet className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalRuns}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">
                                Employees Paid
                            </CardTitle>
                            <Users className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalEmployees}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">
                                Total Disbursed
                            </CardTitle>
                            <Wallet className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatAmount(totalDisbursed)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-end gap-4">
                    <div className="w-40">
                        <Label htmlFor="date-from">Period From</Label>
                        <Input
                            id="date-from"
                            type="date"
                            value={dateFrom}
                            onChange={handleDateFromChange}
                        />
                    </div>
                    <div className="w-40">
                        <Label htmlFor="date-to">Period To</Label>
                        <Input
                            id="date-to"
                            type="date"
                            value={dateTo}
                            onChange={handleDateToChange}
                        />
                    </div>
                    <div className="ml-auto">
                        <ExportButtons
                            exportUrl="/reports/payroll/export"
                            params={{
                                date_from: dateFrom,
                                date_to: dateTo,
                            }}
                        />
                    </div>
                </div>

                {/* Payroll Runs Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-8" />
                            {runColumns.map((col) => (
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
                        {runs.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={runColumns.length + 1}
                                    className="text-muted-foreground h-24 text-center"
                                >
                                    No approved payroll runs found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            runs.map((run) => {
                                const isExpanded = expandedRuns.has(run.id);

                                return (
                                    <>
                                        <TableRow
                                            key={run.id}
                                            className="cursor-pointer"
                                            onClick={() => toggleRun(run.id)}
                                        >
                                            <TableCell className="w-8">
                                                {isExpanded ? (
                                                    <ChevronDown className="size-4" />
                                                ) : (
                                                    <ChevronRight className="size-4" />
                                                )}
                                            </TableCell>
                                            {runColumns.map((col) => (
                                                <TableCell
                                                    key={col.key}
                                                    className={col.className}
                                                >
                                                    {col.render(run)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        {isExpanded && (
                                            <TableRow key={`${run.id}-detail`}>
                                                <TableCell
                                                    colSpan={
                                                        runColumns.length + 1
                                                    }
                                                    className="bg-muted/30 p-0"
                                                >
                                                    <div className="px-8 py-2">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    {slipColumns.map(
                                                                        (
                                                                            col,
                                                                        ) => (
                                                                            <TableHead
                                                                                key={
                                                                                    col.key
                                                                                }
                                                                                className={
                                                                                    col.className
                                                                                }
                                                                            >
                                                                                {
                                                                                    col.header
                                                                                }
                                                                            </TableHead>
                                                                        ),
                                                                    )}
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {run.payslips.map(
                                                                    (slip) => (
                                                                        <TableRow
                                                                            key={
                                                                                slip.id
                                                                            }
                                                                        >
                                                                            {slipColumns.map(
                                                                                (
                                                                                    col,
                                                                                ) => (
                                                                                    <TableCell
                                                                                        key={
                                                                                            col.key
                                                                                        }
                                                                                        className={
                                                                                            col.className
                                                                                        }
                                                                                    >
                                                                                        {col.render(
                                                                                            slip,
                                                                                        )}
                                                                                    </TableCell>
                                                                                ),
                                                                            )}
                                                                        </TableRow>
                                                                    ),
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

PayrollReport.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Payroll Report', href: index().url },
    ],
};
