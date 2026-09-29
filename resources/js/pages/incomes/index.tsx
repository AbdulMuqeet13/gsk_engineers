import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DatePicker } from '@/components/date-picker';
import { CreateIncomeDialog } from '@/components/incomes/create-income-dialog';
import { getIncomeColumns } from '@/components/incomes/income-columns';
import { ReverseIncomeDialog } from '@/components/incomes/reverse-income-dialog';
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
    PaginatedResponse,
    Project,
    ProjectIncome,
} from '@/types';
import { index } from '@/actions/App/Http/Controllers/ProjectIncomeController';
import { dashboard } from '@/routes';

type IncomesPageProps = {
    incomes: PaginatedResponse<ProjectIncome>;
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
    incomeAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
    assetAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
};

export default function Incomes({
    incomes,
    projects = [],
    incomeAccounts = [],
    assetAccounts = [],
}: IncomesPageProps) {
    const { can } = useCan();
    const canCreate = can('incomes.create');

    const {
        search,
        sort,
        filters,
        setSearch,
        setSort,
        setFilter,
        setPage,
        setPerPage,
    } = useDataTable({ only: ['incomes'] });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [reversingIncome, setReversingIncome] =
        useState<ProjectIncome | null>(null);

    const columns = useMemo(
        () =>
            getIncomeColumns({
                sort,
                onSort: setSort,
                onReverse: setReversingIncome,
                canCreate,
            }),
        [sort, setSort, canCreate],
    );

    return (
        <>
            <Head title="Incomes" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Incomes"
                    description="Record payments received for projects."
                />

                <DataTable
                    columns={columns}
                    data={incomes.data}
                    meta={incomes.meta}
                    sort={sort}
                    onSort={setSort}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    emptyMessage="No incomes found."
                    emptyDescription="Get started by recording your first project income."
                    toolbar={
                        <DataTableToolbar>
                            <div className="flex flex-1 flex-wrap items-center gap-2">
                                <DataTableSearch
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search reference, client, description..."
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
                                        htmlFor="filter-deposit-account"
                                        className="text-muted-foreground text-xs"
                                    >
                                        Account
                                    </Label>
                                    <Select
                                        value={
                                            (filters.deposit_account_id as string) ??
                                            ''
                                        }
                                        onValueChange={(value) =>
                                            setFilter(
                                                'deposit_account_id',
                                                value || undefined,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="filter-deposit-account"
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
                                    Record Income
                                </Button>
                            )}
                        </DataTableToolbar>
                    }
                />
            </div>

            {canCreate && (
                <CreateIncomeDialog
                    open={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    projects={projects}
                    incomeAccounts={incomeAccounts}
                    assetAccounts={assetAccounts}
                />
            )}

            {reversingIncome && (
                <ReverseIncomeDialog
                    open={!!reversingIncome}
                    onClose={() => setReversingIncome(null)}
                    income={reversingIncome}
                />
            )}
        </>
    );
}

Incomes.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Incomes', href: index().url },
    ],
};
