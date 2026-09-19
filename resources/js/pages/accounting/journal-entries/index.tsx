import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getJournalEntryColumns } from '@/components/journal-entries/journal-entry-columns';
import { CreateJournalEntryDialog } from '@/components/journal-entries/create-journal-entry-dialog';
import { EditJournalEntryDialog } from '@/components/journal-entries/edit-journal-entry-dialog';
import { PostJournalEntryDialog } from '@/components/journal-entries/post-journal-entry-dialog';
import { DeleteJournalEntryDialog } from '@/components/journal-entries/delete-journal-entry-dialog';
import { ReverseJournalEntryDialog } from '@/components/journal-entries/reverse-journal-entry-dialog';
import {
    DataTable,
    DataTableFilter,
    DataTableSearch,
    DataTableToolbar,
} from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCan } from '@/hooks/use-can';
import { useDataTable } from '@/hooks/use-data-table';
import type {
    AccountHead,
    JournalEntry,
    JournalEntryStatus,
    JournalEntryType,
    PaginatedResponse,
    Project,
} from '@/types';
import { index } from '@/actions/App/Http/Controllers/JournalEntryController';
import { dashboard } from '@/routes';

type JournalEntriesPageProps = {
    journalEntries: PaginatedResponse<JournalEntry>;
    entryTypes: JournalEntryType[];
    entryStatuses: JournalEntryStatus[];
    accountHeads: Pick<AccountHead, 'id' | 'code' | 'name' | 'type' | 'normal_balance'>[];
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
};

export default function JournalEntries({
    journalEntries,
    entryTypes,
    entryStatuses,
    accountHeads = [],
    projects = [],
}: JournalEntriesPageProps) {
    const { can } = useCan();
    const canCreate = can('accounting.create');
    const canPost = can('accounting.post');
    const canReverse = can('accounting.reverse');

    const {
        search,
        sort,
        filters,
        setSearch,
        setSort,
        setFilter,
        setPage,
        setPerPage,
    } = useDataTable({ only: ['journalEntries'] });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
    const [postingEntry, setPostingEntry] = useState<JournalEntry | null>(null);
    const [reversingEntry, setReversingEntry] = useState<JournalEntry | null>(
        null,
    );
    const [deletingEntry, setDeletingEntry] = useState<JournalEntry | null>(
        null,
    );

    const columns = useMemo(
        () =>
            getJournalEntryColumns({
                sort,
                onSort: setSort,
                onEdit: setEditingEntry,
                onPost: setPostingEntry,
                onReverse: setReversingEntry,
                onDelete: setDeletingEntry,
                canCreate,
                canPost,
                canReverse,
            }),
        [sort, setSort, canCreate, canPost, canReverse],
    );

    const typeFilterOptions = entryTypes.map((type) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type,
    }));

    const statusFilterOptions = entryStatuses.map((status) => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status,
    }));

    const currentTypeFilter = filters.type
        ? Array.isArray(filters.type)
            ? filters.type
            : [filters.type]
        : [];

    const currentStatusFilter = filters.status
        ? Array.isArray(filters.status)
            ? filters.status
            : [filters.status]
        : [];

    return (
        <>
            <Head title="Journal Entries" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Journal Entries"
                    description="Manage double-entry journal entries."
                />

                <DataTable
                    columns={columns}
                    data={journalEntries.data}
                    meta={journalEntries.meta}
                    sort={sort}
                    onSort={setSort}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    emptyMessage="No journal entries found."
                    emptyDescription="Get started by creating your first journal entry."
                    toolbar={
                        <DataTableToolbar>
                            <div className="flex flex-1 flex-wrap items-center gap-2">
                                <DataTableSearch
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search reference or description..."
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
                                <DataTableFilter
                                    title="Status"
                                    options={statusFilterOptions}
                                    value={currentStatusFilter}
                                    onChange={(value) =>
                                        setFilter(
                                            'status',
                                            value.length > 0
                                                ? value.join(',')
                                                : undefined,
                                        )
                                    }
                                />
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
                                    New Entry
                                </Button>
                            )}
                        </DataTableToolbar>
                    }
                />
            </div>

            {canCreate && (
                <CreateJournalEntryDialog
                    open={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    entryTypes={entryTypes}
                    accountHeads={accountHeads}
                    projects={projects}
                />
            )}

            {editingEntry && (
                <EditJournalEntryDialog
                    open={!!editingEntry}
                    onClose={() => setEditingEntry(null)}
                    journalEntry={editingEntry}
                    entryTypes={entryTypes}
                    accountHeads={accountHeads}
                    projects={projects}
                />
            )}

            {postingEntry && (
                <PostJournalEntryDialog
                    open={!!postingEntry}
                    onClose={() => setPostingEntry(null)}
                    journalEntry={postingEntry}
                />
            )}

            {reversingEntry && (
                <ReverseJournalEntryDialog
                    open={!!reversingEntry}
                    onClose={() => setReversingEntry(null)}
                    journalEntry={reversingEntry}
                />
            )}

            {deletingEntry && (
                <DeleteJournalEntryDialog
                    open={!!deletingEntry}
                    onClose={() => setDeletingEntry(null)}
                    journalEntry={deletingEntry}
                />
            )}
        </>
    );
}

JournalEntries.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Journal Entries', href: index().url },
    ],
};
