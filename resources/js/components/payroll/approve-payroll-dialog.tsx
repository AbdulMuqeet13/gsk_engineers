import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { PayrollRun } from '@/types';
import { approve } from '@/actions/App/Http/Controllers/PayrollRunController';

type ApprovePayrollDialogProps = {
    open: boolean;
    onClose: () => void;
    payrollRun: PayrollRun;
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

export function ApprovePayrollDialog({
    open,
    onClose,
    payrollRun,
}: ApprovePayrollDialogProps) {
    const [processing, setProcessing] = useState(false);

    function handleApprove() {
        setProcessing(true);

        router.post(approve({ payroll_run: payrollRun.id }).url, {}, {
            onSuccess: () => onClose(),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Approve Payroll Run</DialogTitle>
                    <DialogDescription>
                        Review the payroll details before approving.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted/50 space-y-2 rounded-md border p-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Reference</span>
                        <span className="font-mono font-medium">
                            {payrollRun.reference}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Period</span>
                        <span className="font-medium">
                            {formatDate(payrollRun.period_start)} &ndash;{' '}
                            {formatDate(payrollRun.period_end)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Payslips</span>
                        <span className="font-medium">
                            {payrollRun.payslips_count ?? payrollRun.payslips?.length ?? 0}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Payment Account
                        </span>
                        <span className="font-medium">
                            {payrollRun.payment_account?.name ?? '--'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Amount</span>
                        <span className="font-mono font-medium">
                            {formatAmount(payrollRun.total_amount)}
                        </span>
                    </div>
                </div>

                <p className="text-muted-foreground text-sm">
                    Approving will create a journal entry and process payroll
                    totaling <strong>{formatAmount(payrollRun.total_amount)}</strong>{' '}
                    from <strong>{payrollRun.payment_account?.name}</strong>.
                </p>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleApprove}
                        disabled={processing}
                    >
                        {processing ? 'Approving...' : 'Approve'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
