import { Head } from '@inertiajs/react';
import { CheckCircle2, Send, Trash2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getPayslipColumns } from '@/components/payroll/payslip-columns';
import { SubmitPayrollDialog } from '@/components/payroll/submit-payroll-dialog';
import { ApprovePayrollDialog } from '@/components/payroll/approve-payroll-dialog';
import { RejectPayrollDialog } from '@/components/payroll/reject-payroll-dialog';
import { DeletePayrollDialog } from '@/components/payroll/delete-payroll-dialog';
import { EditPayslipDialog } from '@/components/payroll/edit-payslip-dialog';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import type { PayrollRun, Payslip } from '@/types';
import { index } from '@/actions/App/Http/Controllers/PayrollRunController';
import { dashboard } from '@/routes';

type PayrollShowPageProps = {
    payrollRun: PayrollRun;
};

const statusBadgeVariants: Record<string, 'secondary' | 'info-soft' | 'success-soft' | 'destructive-soft'> = {
    draft: 'secondary',
    submitted: 'info-soft',
    approved: 'success-soft',
    rejected: 'destructive-soft',
};

function formatDate(dateString: string): string {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatAmount(amount: string): string {
    return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
    });
}

export default function PayrollShow({ payrollRun }: PayrollShowPageProps) {
    const { can } = useCan();
    const canRun = can('payroll.run');
    const canApprove = can('payroll.approve');

    const isDraft = payrollRun.status === 'draft';
    const isSubmitted = payrollRun.status === 'submitted';

    const [submittingRun, setSubmittingRun] = useState(false);
    const [approvingRun, setApprovingRun] = useState(false);
    const [rejectingRun, setRejectingRun] = useState(false);
    const [deletingRun, setDeletingRun] = useState(false);
    const [editingPayslip, setEditingPayslip] = useState<Payslip | null>(null);

    const payslipColumns = useMemo(
        () =>
            getPayslipColumns({
                onEdit: setEditingPayslip,
                canRun,
                isDraft,
                payrollRunId: payrollRun.id,
            }),
        [canRun, isDraft, payrollRun.id],
    );

    return (
        <>
            <Head title={`Payroll - ${payrollRun.reference}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={payrollRun.reference}
                        description="Payroll run details and payslips."
                    />
                    <div className="flex items-center gap-2">
                        {isDraft && canRun && (
                            <Button onClick={() => setSubmittingRun(true)}>
                                <Send className="mr-2 size-4" />
                                Submit
                            </Button>
                        )}
                        {isSubmitted && canApprove && (
                            <>
                                <Button onClick={() => setApprovingRun(true)}>
                                    <CheckCircle2 className="mr-2 size-4" />
                                    Approve
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => setRejectingRun(true)}
                                >
                                    <XCircle className="mr-2 size-4" />
                                    Reject
                                </Button>
                            </>
                        )}
                        {isDraft && canRun && (
                            <Button
                                variant="outline"
                                onClick={() => setDeletingRun(true)}
                            >
                                <Trash2 className="mr-2 size-4" />
                                Delete
                            </Button>
                        )}
                    </div>
                </div>

                <div className="bg-muted/50 grid gap-4 rounded-md border p-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Status</p>
                        <Badge
                            variant={statusBadgeVariants[payrollRun.status] ?? 'secondary'}
                        >
                            {payrollRun.status.charAt(0).toUpperCase() +
                                payrollRun.status.slice(1)}
                        </Badge>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Period</p>
                        <p className="text-sm font-medium">
                            {formatDate(payrollRun.period_start)} &ndash;{' '}
                            {formatDate(payrollRun.period_end)}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">
                            Total Amount
                        </p>
                        <p className="font-mono text-sm font-medium">
                            {formatAmount(payrollRun.total_amount)}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">
                            Payment Account
                        </p>
                        <p className="text-sm font-medium">
                            {payrollRun.payment_account
                                ? `${payrollRun.payment_account.code} - ${payrollRun.payment_account.name}`
                                : '--'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">
                            Created By
                        </p>
                        <p className="text-sm font-medium">
                            {payrollRun.creator?.name ?? '--'}
                        </p>
                    </div>
                    {payrollRun.approver && (
                        <div className="space-y-1">
                            <p className="text-muted-foreground text-sm">
                                Approved By
                            </p>
                            <p className="text-sm font-medium">
                                {payrollRun.approver.name}
                                {payrollRun.approved_at && (
                                    <span className="text-muted-foreground ml-1 text-xs">
                                        on {formatDate(payrollRun.approved_at)}
                                    </span>
                                )}
                            </p>
                        </div>
                    )}
                    {payrollRun.journal_entry && (
                        <div className="space-y-1">
                            <p className="text-muted-foreground text-sm">
                                Journal Entry
                            </p>
                            <p className="font-mono text-sm font-medium">
                                {payrollRun.journal_entry.reference}
                            </p>
                        </div>
                    )}
                    {payrollRun.rejection_reason && (
                        <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                            <p className="text-muted-foreground text-sm">
                                Rejection Reason
                            </p>
                            <p className="text-destructive text-sm">
                                {payrollRun.rejection_reason}
                            </p>
                        </div>
                    )}
                    {payrollRun.description && (
                        <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                            <p className="text-muted-foreground text-sm">
                                Description
                            </p>
                            <p className="text-sm">
                                {payrollRun.description}
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Payslips</h3>
                    <DataTable
                        columns={payslipColumns}
                        data={payrollRun.payslips ?? []}
                        emptyMessage="No payslips found."
                        emptyDescription="This payroll run has no payslips."
                    />
                </div>
            </div>

            {submittingRun && (
                <SubmitPayrollDialog
                    open={submittingRun}
                    onClose={() => setSubmittingRun(false)}
                    payrollRun={payrollRun}
                />
            )}

            {approvingRun && (
                <ApprovePayrollDialog
                    open={approvingRun}
                    onClose={() => setApprovingRun(false)}
                    payrollRun={payrollRun}
                />
            )}

            {rejectingRun && (
                <RejectPayrollDialog
                    open={rejectingRun}
                    onClose={() => setRejectingRun(false)}
                    payrollRun={payrollRun}
                />
            )}

            {deletingRun && (
                <DeletePayrollDialog
                    open={deletingRun}
                    onClose={() => setDeletingRun(false)}
                    payrollRun={payrollRun}
                />
            )}

            {editingPayslip && (
                <EditPayslipDialog
                    open={!!editingPayslip}
                    onClose={() => setEditingPayslip(null)}
                    payslip={editingPayslip}
                />
            )}
        </>
    );
}

PayrollShow.layout = (props: PayrollShowPageProps) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Payroll', href: index().url },
        { title: props.payrollRun.reference },
    ],
});
