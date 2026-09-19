import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getExpenseColumns } from '@/components/expenses/expense-columns';
import { CreateExpenseDialog } from '@/components/expenses/create-expense-dialog';
import { EditExpenseDialog } from '@/components/expenses/edit-expense-dialog';
import { SubmitExpenseDialog } from '@/components/expenses/submit-expense-dialog';
import { ApproveExpenseDialog } from '@/components/expenses/approve-expense-dialog';
import { RejectExpenseDialog } from '@/components/expenses/reject-expense-dialog';
import { DeleteExpenseDialog } from '@/components/expenses/delete-expense-dialog';
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
    Expense,
    ExpenseStatus,
    PaginatedResponse,
    Project,
} from '@/types';
import { index } from '@/actions/App/Http/Controllers/ExpenseController';
import { dashboard } from '@/routes';

type ExpensesPageProps = {
    expenses: PaginatedResponse<Expense>;
    expenseStatuses: ExpenseStatus[];
    expenseAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
    paymentAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
};

export default function Expenses({
    expenses,
    expenseStatuses,
    expenseAccounts = [],
    paymentAccounts = [],
    projects = [],
}: ExpensesPageProps) {
    const { can } = useCan();
    const canCreate = can('expenses.create');
    const canUpdate = can('expenses.update');
    const canDelete = can('expenses.delete');
    const canApprove = can('expenses.approve');

    const {
        search,
        sort,
        filters,
        setSearch,
        setSort,
        setFilter,
        setPage,
        setPerPage,
    } = useDataTable({ only: ['expenses'] });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [submittingExpense, setSubmittingExpense] = useState<Expense | null>(
        null,
    );
    const [approvingExpense, setApprovingExpense] = useState<Expense | null>(
        null,
    );
    const [rejectingExpense, setRejectingExpense] = useState<Expense | null>(
        null,
    );
    const [deletingExpense, setDeletingExpense] = useState<Expense | null>(
        null,
    );

    const columns = useMemo(
        () =>
            getExpenseColumns({
                sort,
                onSort: setSort,
                onEdit: setEditingExpense,
                onSubmit: setSubmittingExpense,
                onApprove: setApprovingExpense,
                onReject: setRejectingExpense,
                onDelete: setDeletingExpense,
                canCreate,
                canUpdate,
                canDelete,
                canApprove,
            }),
        [sort, setSort, canCreate, canUpdate, canDelete, canApprove],
    );

    const statusFilterOptions = expenseStatuses.map((status) => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status,
    }));

    const currentStatusFilter = filters.status
        ? Array.isArray(filters.status)
            ? filters.status
            : [filters.status]
        : [];

    return (
        <>
            <Head title="Expenses" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Expenses"
                    description="Track and manage expense records."
                />

                <DataTable
                    columns={columns}
                    data={expenses.data}
                    meta={expenses.meta}
                    sort={sort}
                    onSort={setSort}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    emptyMessage="No expenses found."
                    emptyDescription="Get started by creating your first expense."
                    toolbar={
                        <DataTableToolbar>
                            <div className="flex flex-1 flex-wrap items-center gap-2">
                                <DataTableSearch
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search reference or description..."
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
                                    New Expense
                                </Button>
                            )}
                        </DataTableToolbar>
                    }
                />
            </div>

            {canCreate && (
                <CreateExpenseDialog
                    open={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    expenseAccounts={expenseAccounts}
                    paymentAccounts={paymentAccounts}
                    projects={projects}
                />
            )}

            {editingExpense && (
                <EditExpenseDialog
                    open={!!editingExpense}
                    onClose={() => setEditingExpense(null)}
                    expense={editingExpense}
                    expenseAccounts={expenseAccounts}
                    paymentAccounts={paymentAccounts}
                    projects={projects}
                />
            )}

            {submittingExpense && (
                <SubmitExpenseDialog
                    open={!!submittingExpense}
                    onClose={() => setSubmittingExpense(null)}
                    expense={submittingExpense}
                />
            )}

            {approvingExpense && (
                <ApproveExpenseDialog
                    open={!!approvingExpense}
                    onClose={() => setApprovingExpense(null)}
                    expense={approvingExpense}
                />
            )}

            {rejectingExpense && (
                <RejectExpenseDialog
                    open={!!rejectingExpense}
                    onClose={() => setRejectingExpense(null)}
                    expense={rejectingExpense}
                />
            )}

            {deletingExpense && (
                <DeleteExpenseDialog
                    open={!!deletingExpense}
                    onClose={() => setDeletingExpense(null)}
                    expense={deletingExpense}
                />
            )}
        </>
    );
}

Expenses.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Expenses', href: index().url },
    ],
};
