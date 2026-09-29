import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DatePicker } from '@/components/date-picker';
import { getAccountTransferColumns } from '@/components/account-transfers/account-transfer-columns';
import { CreateAccountTransferDialog } from '@/components/account-transfers/create-account-transfer-dialog';
import { ReverseAccountTransferDialog } from '@/components/account-transfers/reverse-account-transfer-dialog';
import {
    DataTable,
    DataTableSearch,
    DataTableToolbar,
} from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCan } from '@/hooks/use-can';
import { useDataTable } from '@/hooks/use-data-table';
import type {
    AccountHead,
    AccountTransfer,
    PaginatedResponse,
    Project,
} from '@/types';
import { index } from '@/actions/App/Http/Controllers/AccountTransferController';
import { dashboard } from '@/routes';

type AccountTransfersPageProps = {
    accountTransfers: PaginatedResponse<AccountTransfer>;
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
    assetAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
};

export default function AccountTransfers({
    accountTransfers,
    projects = [],
    assetAccounts = [],
}: AccountTransfersPageProps) {
    const { can } = useCan();
    const canCreate = can('account-transfers.create');

    const {
        search,
        sort,
        filters,
        setSearch,
        setSort,
        setFilter,
        setPage,
        setPerPage,
    } = useDataTable({ only: ['accountTransfers'] });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [reversingAccountTransfer, setReversingAccountTransfer] =
        useState<AccountTransfer | null>(null);

    const columns = useMemo(
        () =>
            getAccountTransferColumns({
                sort,
                onSort: setSort,
                onReverse: setReversingAccountTransfer,
                canCreate,
            }),
        [sort, setSort, canCreate],
    );

    return (
        <>
            <Head title="Account Transfers" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Account Transfers"
                    description="Move funds between accounts, e.g. Bank to Cash or Receivable to Bank."
                />

                <DataTable
                    columns={columns}
                    data={accountTransfers.data}
                    meta={accountTransfers.meta}
                    sort={sort}
                    onSort={setSort}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    emptyMessage="No account transfers found."
                    emptyDescription="Get started by moving funds between two accounts."
                    toolbar={
                        <DataTableToolbar>
                            <div className="flex flex-1 flex-wrap items-center gap-2">
                                <DataTableSearch
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search reference or description..."
                                />
                                <div className="flex items-center gap-1">
                                    <Label
                                        htmlFor="filter-project"
                                        className="text-muted-foreground text-xs"
                                    >
                                        Project
                                    </Label>
                                    <Select
                                        value={
                                            (filters.project_id as string) ?? ''
                                        }
                                        onValueChange={(value) =>
                                            setFilter(
                                                'project_id',
                                                value || undefined,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="filter-project"
                                            className="h-8 w-[160px]"
                                        >
                                            <SelectValue placeholder="All projects" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All</SelectItem>
                                            {projects.map((project) => (
                                                <SelectItem
                                                    key={project.id}
                                                    value={String(project.id)}
                                                >
                                                    {project.code} -{' '}
                                                    {project.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Label
                                        htmlFor="filter-account"
                                        className="text-muted-foreground text-xs"
                                    >
                                        Account
                                    </Label>
                                    <Select
                                        value={
                                            (filters.account_id as string) ?? ''
                                        }
                                        onValueChange={(value) =>
                                            setFilter(
                                                'account_id',
                                                value || undefined,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="filter-account"
                                            className="h-8 w-[160px]"
                                        >
                                            <SelectValue placeholder="All accounts" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All</SelectItem>
                                            {assetAccounts.map((account) => (
                                                <SelectItem
                                                    key={account.id}
                                                    value={String(account.id)}
                                                >
                                                    {account.code} -{' '}
                                                    {account.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Label
                                        htmlFor="date-from"
                                        className="text-muted-foreground text-xs"
                                    >
                                        From
                                    </Label>
                                    <DatePicker
                                        id="date-from"
                                        value={
                                            (filters.date_from as string) ?? ''
                                        }
                                        onChange={(value) =>
                                            setFilter('date_from', value || undefined)
                                        }
                                        clearable
                                        size="sm"
                                        className="w-[150px]"
                                    />
                                </div>
                                <div className="flex items-center gap-1">
                                    <Label
                                        htmlFor="date-to"
                                        className="text-muted-foreground text-xs"
                                    >
                                        To
                                    </Label>
                                    <DatePicker
                                        id="date-to"
                                        value={
                                            (filters.date_to as string) ?? ''
                                        }
                                        onChange={(value) =>
                                            setFilter('date_to', value || undefined)
                                        }
                                        clearable
                                        size="sm"
                                        className="w-[150px]"
                                    />
                                </div>
                            </div>

                            {canCreate && (
                                <Button
                                    size="sm"
                                    onClick={() => setIsCreateOpen(true)}
                                >
                                    <Plus className="mr-2 size-4" />
                                    New Transfer
                                </Button>
                            )}
                        </DataTableToolbar>
                    }
                />
            </div>

            {canCreate && (
                <CreateAccountTransferDialog
                    open={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    projects={projects}
                    assetAccounts={assetAccounts}
                />
            )}

            {reversingAccountTransfer && (
                <ReverseAccountTransferDialog
                    open={!!reversingAccountTransfer}
                    onClose={() => setReversingAccountTransfer(null)}
                    accountTransfer={reversingAccountTransfer}
                />
            )}
        </>
    );
}

AccountTransfers.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Account Transfers', href: index().url },
    ],
};
