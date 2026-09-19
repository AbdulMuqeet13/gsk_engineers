import { Head, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ExportButtons } from '@/components/reports/export-buttons';
import { getBalanceSheetColumns } from '@/components/reports/balance-sheet-columns';
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
import { index } from '@/actions/App/Http/Controllers/BalanceSheetController';
import { dashboard } from '@/routes';

type BalanceSheetPageProps = {
    assetAccounts: FinancialStatementRow[];
    liabilityAccounts: FinancialStatementRow[];
    equityAccounts: FinancialStatementRow[];
    totalAssets: string;
    totalLiabilities: string;
    totalEquity: string;
    isBalanced: boolean;
    netProfit: string;
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
};

function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export default function BalanceSheet({
    assetAccounts,
    liabilityAccounts,
    equityAccounts,
    totalAssets,
    totalLiabilities,
    totalEquity,
    isBalanced,
    netProfit,
    projects = [],
}: BalanceSheetPageProps) {
    const [asAtDate, setAsAtDate] = useState('');
    const [projectId, setProjectId] = useState<string>('');

    const columns = getBalanceSheetColumns();

    const reloadData = useCallback(
        (params: Record<string, string>) => {
            router.reload({
                only: [
                    'assetAccounts',
                    'liabilityAccounts',
                    'equityAccounts',
                    'totalAssets',
                    'totalLiabilities',
                    'totalEquity',
                    'isBalanced',
                    'netProfit',
                ],
                data: {
                    as_at_date: params.as_at_date ?? asAtDate,
                    project_id: params.project_id ?? projectId,
                },
            });
        },
        [asAtDate, projectId],
    );

    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setAsAtDate(value);
        reloadData({ as_at_date: value });
    }

    function handleProjectChange(value: string) {
        const resolvedValue = value === 'all' ? '' : value;
        setProjectId(resolvedValue);
        reloadData({ project_id: resolvedValue });
    }

    const totalLiabilitiesAndEquity = (
        parseFloat(totalLiabilities) + parseFloat(totalEquity)
    ).toFixed(2);

    return (
        <>
            <Head title="Balance Sheet" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Balance Sheet"
                    description="Assets, liabilities, and equity as at a point in time."
                />

                <div className="flex flex-wrap items-end gap-4">
                    <div className="w-40">
                        <Label htmlFor="as-at-date">As At Date</Label>
                        <Input
                            id="as-at-date"
                            type="date"
                            value={asAtDate}
                            onChange={handleDateChange}
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
                            exportUrl="/reports/balance-sheet/export"
                            params={{
                                as_at_date: asAtDate,
                                project_id: projectId,
                            }}
                        />
                        {isBalanced ? (
                            <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-4 py-2 text-sm font-medium text-success">
                                <CheckCircle2 className="size-4" />
                                Balance sheet is balanced
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
                                <AlertTriangle className="size-4" />
                                Balance sheet is out of balance!
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
                        {/* Assets Section */}
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="bg-muted/50 font-semibold"
                            >
                                Assets
                            </TableCell>
                        </TableRow>
                        {assetAccounts.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-muted-foreground text-center italic"
                                >
                                    No asset accounts with balances.
                                </TableCell>
                            </TableRow>
                        ) : (
                            assetAccounts.map((account) => (
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
                                Total Assets
                            </TableCell>
                            <TableCell className="text-right font-bold font-mono text-sm">
                                {formatAmount(totalAssets)}
                            </TableCell>
                        </TableRow>

                        {/* Liabilities Section */}
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="bg-muted/50 font-semibold"
                            >
                                Liabilities
                            </TableCell>
                        </TableRow>
                        {liabilityAccounts.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-muted-foreground text-center italic"
                                >
                                    No liability accounts with balances.
                                </TableCell>
                            </TableRow>
                        ) : (
                            liabilityAccounts.map((account) => (
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
                                Total Liabilities
                            </TableCell>
                            <TableCell className="text-right font-bold font-mono text-sm">
                                {formatAmount(totalLiabilities)}
                            </TableCell>
                        </TableRow>

                        {/* Equity Section */}
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="bg-muted/50 font-semibold"
                            >
                                Equity
                            </TableCell>
                        </TableRow>
                        {equityAccounts.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-muted-foreground text-center italic"
                                >
                                    No equity accounts with balances.
                                </TableCell>
                            </TableRow>
                        ) : (
                            equityAccounts.map((account) => (
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
                                Total Equity
                            </TableCell>
                            <TableCell className="text-right font-bold font-mono text-sm">
                                {formatAmount(totalEquity)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell
                                colSpan={2}
                                className="text-right text-base font-bold"
                            >
                                Total Liabilities + Equity
                            </TableCell>
                            <TableCell className="text-right text-base font-bold font-mono">
                                {formatAmount(totalLiabilitiesAndEquity)}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </>
    );
}

BalanceSheet.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Balance Sheet', href: index().url },
    ],
};
