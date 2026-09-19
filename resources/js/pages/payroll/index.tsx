import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getPayrollColumns } from '@/components/payroll/payroll-columns';
import { CreatePayrollDialog } from '@/components/payroll/create-payroll-dialog';
import { SubmitPayrollDialog } from '@/components/payroll/submit-payroll-dialog';
import { ApprovePayrollDialog } from '@/components/payroll/approve-payroll-dialog';
import { RejectPayrollDialog } from '@/components/payroll/reject-payroll-dialog';
import { DeletePayrollDialog } from '@/components/payroll/delete-payroll-dialog';
import {
    DataTable,
    DataTableFilter,
    DataTableSearch,
    DataTableToolbar,
} from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useDataTable } from '@/hooks/use-data-table';
import type {
    AccountHead,
    PayrollRun,
    PayrollStatus,
    PaginatedResponse,
} from '@/types';
import { index } from '@/actions/App/Http/Controllers/PayrollRunController';
import { dashboard } from '@/routes';

type PayrollIndexPageProps = {
    payrollRuns: PaginatedResponse<PayrollRun>;
    payrollStatuses: string[];
    paymentAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
};

export default function PayrollIndex({
    payrollRuns,
    payrollStatuses,
    paymentAccounts = [],
}: PayrollIndexPageProps) {
    const { can } = useCan();
    const canRun = can('payroll.run');
    const canApprove = can('payroll.approve');

    const {
        search,
        sort,
        filters,
        setSearch,
        setSort,
        setFilter,
        setPage,
        setPerPage,
    } = useDataTable({ only: ['payrollRuns'] });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [submittingRun, setSubmittingRun] = useState<PayrollRun | null>(null);
    const [approvingRun, setApprovingRun] = useState<PayrollRun | null>(null);
    const [rejectingRun, setRejectingRun] = useState<PayrollRun | null>(null);
    const [deletingRun, setDeletingRun] = useState<PayrollRun | null>(null);

    const columns = useMemo(
        () =>
            getPayrollColumns({
                sort,
                onSort: setSort,
                onSubmit: setSubmittingRun,
                onApprove: setApprovingRun,
                onReject: setRejectingRun,
                onDelete: setDeletingRun,
                canRun,
                canApprove,
            }),
        [sort, setSort, canRun, canApprove],
    );

    const statusFilterOptions = payrollStatuses.map((status) => ({
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
            <Head title="Payroll" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Payroll"
                    description="Manage payroll runs and employee salaries."
                />

                <DataTable
                    columns={columns}
                    data={payrollRuns.data}
                    meta={payrollRuns.meta}
                    sort={sort}
                    onSort={setSort}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    emptyMessage="No payroll runs found."
                    emptyDescription="Get started by creating your first payroll run."
                    toolbar={
                        <DataTableToolbar>
                            <div className="flex flex-1 flex-wrap items-center gap-2">
                                <DataTableSearch
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search reference..."
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
                            </div>

                            {canRun && (
                                <Button
                                    size="sm"
                                    onClick={() => setIsCreateOpen(true)}
                                >
                                    <Plus className="mr-2 size-4" />
                                    New Payroll Run
                                </Button>
                            )}
                        </DataTableToolbar>
                    }
                />
            </div>

            {canRun && (
                <CreatePayrollDialog
                    open={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    paymentAccounts={paymentAccounts}
                />
            )}

            {submittingRun && (
                <SubmitPayrollDialog
                    open={!!submittingRun}
                    onClose={() => setSubmittingRun(null)}
                    payrollRun={submittingRun}
                />
            )}

            {approvingRun && (
                <ApprovePayrollDialog
                    open={!!approvingRun}
                    onClose={() => setApprovingRun(null)}
                    payrollRun={approvingRun}
                />
            )}

            {rejectingRun && (
                <RejectPayrollDialog
                    open={!!rejectingRun}
                    onClose={() => setRejectingRun(null)}
                    payrollRun={rejectingRun}
                />
            )}

            {deletingRun && (
                <DeletePayrollDialog
                    open={!!deletingRun}
                    onClose={() => setDeletingRun(null)}
                    payrollRun={deletingRun}
                />
            )}
        </>
    );
}

PayrollIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Payroll', href: index().url },
    ],
};
