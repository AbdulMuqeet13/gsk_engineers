import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getTransferColumns } from '@/components/transfers/transfer-columns';
import { CreateTransferDialog } from '@/components/transfers/create-transfer-dialog';
import { ReverseTransferDialog } from '@/components/transfers/reverse-transfer-dialog';
import {
    DataTable,
    DataTableSearch,
    DataTableToolbar,
} from '@/components/data-table';
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
import { useCan } from '@/hooks/use-can';
import { useDataTable } from '@/hooks/use-data-table';
import type {
    AccountHead,
    InterProjectTransfer,
    PaginatedResponse,
    Project,
} from '@/types';
import { index } from '@/actions/App/Http/Controllers/InterProjectTransferController';
import { dashboard } from '@/routes';

type TransfersPageProps = {
    transfers: PaginatedResponse<InterProjectTransfer>;
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
    assetAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
};

export default function Transfers({
    transfers,
    projects = [],
    assetAccounts = [],
}: TransfersPageProps) {
    const { can } = useCan();
    const canCreate = can('transfers.create');

    const {
        search,
        sort,
        filters,
        setSearch,
        setSort,
        setFilter,
        setPage,
        setPerPage,
    } = useDataTable({ only: ['transfers'] });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [reversingTransfer, setReversingTransfer] =
        useState<InterProjectTransfer | null>(null);

    const columns = useMemo(
        () =>
            getTransferColumns({
                sort,
                onSort: setSort,
                onReverse: setReversingTransfer,
                canCreate,
            }),
        [sort, setSort, canCreate],
    );

    return (
        <>
            <Head title="Inter-Project Transfers" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Inter-Project Transfers"
                    description="Transfer funds between projects."
                />

                <DataTable
                    columns={columns}
                    data={transfers.data}
                    meta={transfers.meta}
                    sort={sort}
                    onSort={setSort}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    emptyMessage="No transfers found."
                    emptyDescription="Get started by creating your first inter-project transfer."
                    toolbar={
                        <DataTableToolbar>
                            <div className="flex flex-1 flex-wrap items-center gap-2">
                                <DataTableSearch
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search reference or purpose..."
                                />
                                <div className="flex items-center gap-1">
                                    <Label
                                        htmlFor="filter-from-project"
                                        className="text-muted-foreground text-xs"
                                    >
                                        From
                                    </Label>
                                    <Select
                                        value={
                                            (filters.from_project_id as string) ??
                                            ''
                                        }
                                        onValueChange={(value) =>
                                            setFilter(
                                                'from_project_id',
                                                value || undefined,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="filter-from-project"
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
                                        htmlFor="filter-to-project"
                                        className="text-muted-foreground text-xs"
                                    >
                                        To
                                    </Label>
                                    <Select
                                        value={
                                            (filters.to_project_id as string) ??
                                            ''
                                        }
                                        onValueChange={(value) =>
                                            setFilter(
                                                'to_project_id',
                                                value || undefined,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="filter-to-project"
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
                                        htmlFor="date-from"
                                        className="text-muted-foreground text-xs"
                                    >
                                        From
                                    </Label>
                                    <Input
                                        id="date-from"
                                        type="date"
                                        value={
                                            (filters.date_from as string) ?? ''
                                        }
                                        onChange={(e) =>
                                            setFilter(
                                                'date_from',
                                                e.target.value || undefined,
                                            )
                                        }
                                        className="h-8 w-auto"
                                    />
                                </div>
                                <div className="flex items-center gap-1">
                                    <Label
                                        htmlFor="date-to"
                                        className="text-muted-foreground text-xs"
                                    >
                                        To
                                    </Label>
                                    <Input
                                        id="date-to"
                                        type="date"
                                        value={
                                            (filters.date_to as string) ?? ''
                                        }
                                        onChange={(e) =>
                                            setFilter(
                                                'date_to',
                                                e.target.value || undefined,
                                            )
                                        }
                                        className="h-8 w-auto"
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
                <CreateTransferDialog
                    open={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    projects={projects}
                    assetAccounts={assetAccounts}
                />
            )}

            {reversingTransfer && (
                <ReverseTransferDialog
                    open={!!reversingTransfer}
                    onClose={() => setReversingTransfer(null)}
                    transfer={reversingTransfer}
                />
            )}
        </>
    );
}

Transfers.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Transfers', href: index().url },
    ],
};
