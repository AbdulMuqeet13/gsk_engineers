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
import { submit } from '@/actions/App/Http/Controllers/PayrollRunController';

type SubmitPayrollDialogProps = {
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

export function SubmitPayrollDialog({
    open,
    onClose,
    payrollRun,
}: SubmitPayrollDialogProps) {
    const [processing, setProcessing] = useState(false);

    function handleSubmit() {
        setProcessing(true);

        router.post(submit({ payroll_run: payrollRun.id }).url, {}, {
            onSuccess: () => onClose(),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submit Payroll Run</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to submit payroll run{' '}
                        <strong>{payrollRun.reference}</strong> for approval?
                        Once submitted, payslips cannot be edited.
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
                        <span className="text-muted-foreground">Total Amount</span>
                        <span className="font-mono font-medium">
                            {formatAmount(payrollRun.total_amount)}
                        </span>
                    </div>
                </div>

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
                        onClick={handleSubmit}
                        disabled={processing}
                    >
                        {processing ? 'Submitting...' : 'Submit'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
