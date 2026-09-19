import { Head, router } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import { useCallback, useState } from 'react';
import { getGeneralLedgerColumns } from '@/components/general-ledger/general-ledger-columns';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
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
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { AccountHead, JournalLine, Project } from '@/types';
import { index } from '@/actions/App/Http/Controllers/GeneralLedgerController';
import { dashboard } from '@/routes';

type GeneralLedgerPageProps = {
    lines: (JournalLine & { running_balance: string })[];
    selectedAccountHead: AccountHead | null;
    accountHeads: Pick<
        AccountHead,
        'id' | 'code' | 'name' | 'type' | 'normal_balance'
    >[];
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
};

const normalBalanceBadgeVariants: Record<string, 'warning-soft' | 'info-soft'> = {
    debit: 'warning-soft',
    credit: 'info-soft',
};

const accountTypeBadgeVariants: Record<string, 'info-soft' | 'destructive-soft' | 'default' | 'success-soft' | 'warning-soft'> = {
    asset: 'info-soft',
    liability: 'destructive-soft',
    equity: 'default',
    income: 'success-soft',
    expense: 'warning-soft',
};

export default function GeneralLedger({
    lines,
    selectedAccountHead,
    accountHeads,
    projects = [],
}: GeneralLedgerPageProps) {
    const [accountHeadId, setAccountHeadId] = useState<string>(
        selectedAccountHead?.id?.toString() ?? '',
    );
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [projectId, setProjectId] = useState<string>('');

    const columns = getGeneralLedgerColumns();

    const reloadData = useCallback(
        (params: Record<string, string>) => {
            router.reload({
                only: ['lines', 'selectedAccountHead'],
                data: {
                    account_head_id: params.account_head_id ?? accountHeadId,
                    date_from: params.date_from ?? dateFrom,
                    date_to: params.date_to ?? dateTo,
                    project_id: params.project_id ?? projectId,
                },
            });
        },
        [accountHeadId, dateFrom, dateTo, projectId],
    );

    function handleAccountChange(value: string) {
        setAccountHeadId(value);
        reloadData({ account_head_id: value });
    }

    function handleDateFromChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setDateFrom(value);
        if (accountHeadId) {
            reloadData({ date_from: value });
        }
    }

    function handleDateToChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setDateTo(value);
        if (accountHeadId) {
            reloadData({ date_to: value });
        }
    }

    function handleProjectChange(value: string) {
        const resolvedValue = value === 'all' ? '' : value;
        setProjectId(resolvedValue);
        if (accountHeadId) {
            reloadData({ project_id: resolvedValue });
        }
    }

    return (
        <>
            <Head title="General Ledger" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="General Ledger"
                    description="View posted transactions by account."
                />

                <div className="flex flex-wrap items-end gap-4">
                    <div className="w-72">
                        <Label htmlFor="account-head">Account</Label>
                        <Select
                            value={accountHeadId}
                            onValueChange={handleAccountChange}
                        >
                            <SelectTrigger id="account-head" className="w-full">
                                <SelectValue placeholder="Select an account..." />
                            </SelectTrigger>
                            <SelectContent>
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
                </div>

                {selectedAccountHead && (
                    <div className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold">
                                {selectedAccountHead.code} -{' '}
                                {selectedAccountHead.name}
                            </h2>
                            <div className="mt-1 flex items-center gap-2">
                                <Badge
                                    variant={
                                        accountTypeBadgeVariants[
                                            selectedAccountHead.type
                                        ] ?? 'secondary'
                                    }
                                >
                                    {selectedAccountHead.type
                                        .charAt(0)
                                        .toUpperCase() +
                                        selectedAccountHead.type.slice(1)}
                                </Badge>
                                <Badge
                                    variant={
                                        normalBalanceBadgeVariants[
                                            selectedAccountHead.normal_balance
                                        ] ?? 'secondary'
                                    }
                                >
                                    Normal:{' '}
                                    {selectedAccountHead.normal_balance
                                        .charAt(0)
                                        .toUpperCase() +
                                        selectedAccountHead.normal_balance.slice(
                                            1,
                                        )}
                                </Badge>
                            </div>
                        </div>
                    </div>
                )}

                {!accountHeadId ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-12">
                        <BookOpen className="text-muted-foreground size-12" />
                        <h3 className="text-lg font-semibold">
                            Select an Account
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Choose an account head from the dropdown above to
                            view its ledger.
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
                            {lines.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="text-muted-foreground h-24 text-center"
                                    >
                                        No transactions found for this account.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                lines.map((line) => (
                                    <TableRow key={line.id}>
                                        {columns.map((col) => (
                                            <TableCell
                                                key={col.key}
                                                className={col.className}
                                            >
                                                {col.render(line)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </>
    );
}

GeneralLedger.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'General Ledger', href: index().url },
    ],
};
