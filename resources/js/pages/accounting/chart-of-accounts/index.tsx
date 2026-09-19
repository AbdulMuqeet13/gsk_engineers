import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getAccountHeadColumns } from '@/components/account-heads/account-head-columns';
import { CreateAccountHeadDialog } from '@/components/account-heads/create-account-head-dialog';
import { DeleteAccountHeadDialog } from '@/components/account-heads/delete-account-head-dialog';
import { EditAccountHeadDialog } from '@/components/account-heads/edit-account-head-dialog';
import {
    DataTable,
    DataTableFilter,
    DataTableSearch,
    DataTableToolbar,
} from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useDataTable } from '@/hooks/use-data-table';
import type {
    AccountHead,
    AccountType,
    NormalBalance,
    PaginatedResponse,
} from '@/types';
import { index } from '@/actions/App/Http/Controllers/AccountHeadController';
import { dashboard } from '@/routes';

type ChartOfAccountsPageProps = {
    accountHeads: PaginatedResponse<AccountHead>;
    accountTypes: AccountType[];
    normalBalances: NormalBalance[];
    parentAccounts: Pick<AccountHead, 'id' | 'name' | 'code'>[];
};

export default function ChartOfAccounts({
    accountHeads,
    accountTypes,
    normalBalances,
    parentAccounts = [],
}: ChartOfAccountsPageProps) {
    const { can } = useCan();
    const canManage = can('chart-of-accounts.manage');

    const {
        search,
        sort,
        filters,
        setSearch,
        setSort,
        setFilter,
        setPage,
        setPerPage,
    } = useDataTable({ only: ['accountHeads'] });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<AccountHead | null>(
        null,
    );
    const [deletingAccount, setDeletingAccount] = useState<AccountHead | null>(
        null,
    );

    const columns = useMemo(
        () =>
            getAccountHeadColumns({
                sort,
                onSort: setSort,
                onEdit: setEditingAccount,
                onDelete: setDeletingAccount,
                canManage,
            }),
        [sort, setSort, canManage],
    );

    const typeFilterOptions = accountTypes.map((type) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type,
    }));

    const currentTypeFilter = filters.type
        ? Array.isArray(filters.type)
            ? filters.type
            : [filters.type]
        : [];

    return (
        <>
            <Head title="Chart of Accounts" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    columns={columns}
                    data={accountHeads.data}
                    meta={accountHeads.meta}
                    sort={sort}
                    onSort={setSort}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    emptyMessage="No account heads found."
                    emptyDescription="Get started by creating your first account head."
                    toolbar={
                        <DataTableToolbar>
                            <div className="flex flex-1 items-center gap-2">
                                <DataTableSearch
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search accounts..."
                                />
                                <DataTableFilter
                                    title="Type"
                                    options={typeFilterOptions}
                                    value={currentTypeFilter}
                                    onChange={(value) =>
                                        setFilter(
                                            'type',
                                            value.length > 0
                                                ? value.join(',')
                                                : undefined,
                                        )
                                    }
                                />
                            </div>

                            {canManage && (
                                <Button
                                    size="sm"
                                    onClick={() => setIsCreateOpen(true)}
                                >
                                    <Plus className="mr-2 size-4" />
                                    Add Account
                                </Button>
                            )}
                        </DataTableToolbar>
                    }
                />
            </div>

            {canManage && (
                <>
                    <CreateAccountHeadDialog
                        open={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        accountTypes={accountTypes}
                        normalBalances={normalBalances}
                        parentAccounts={parentAccounts}
                    />

                    {editingAccount && (
                        <EditAccountHeadDialog
                            open={!!editingAccount}
                            onClose={() => setEditingAccount(null)}
                            accountHead={editingAccount}
                            accountTypes={accountTypes}
                            normalBalances={normalBalances}
                            parentAccounts={parentAccounts}
                        />
                    )}

                    {deletingAccount && (
                        <DeleteAccountHeadDialog
                            open={!!deletingAccount}
                            onClose={() => setDeletingAccount(null)}
                            accountHead={deletingAccount}
                        />
                    )}
                </>
            )}
        </>
    );
}

ChartOfAccounts.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Chart of Accounts', href: index().url },
    ],
};
