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
import type { Expense } from '@/types';
import { approve } from '@/actions/App/Http/Controllers/ExpenseController';

type ApproveExpenseDialogProps = {
    open: boolean;
    onClose: () => void;
    expense: Expense;
};

function formatAmount(amount: string): string {
    return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
    });
}

export function ApproveExpenseDialog({
    open,
    onClose,
    expense,
}: ApproveExpenseDialogProps) {
    const [processing, setProcessing] = useState(false);

    function handleApprove() {
        setProcessing(true);

        router.post(approve(expense).url, {}, {
            onSuccess: () => onClose(),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Approve Expense</DialogTitle>
                    <DialogDescription>
                        Review the expense details before approving.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted/50 space-y-2 rounded-md border p-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Reference</span>
                        <span className="font-mono font-medium">
                            {expense.reference}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{expense.date}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Description
                        </span>
                        <span className="max-w-[200px] truncate font-medium">
                            {expense.description}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-mono font-medium">
                            {formatAmount(expense.amount)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">
                            {expense.account_head?.name}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Payment Method
                        </span>
                        <span className="font-medium">
                            {expense.payment_account?.name}
                        </span>
                    </div>
                </div>

                <p className="text-muted-foreground text-sm">
                    This will create a journal entry debiting{' '}
                    <strong>{expense.account_head?.name}</strong> and crediting{' '}
                    <strong>{expense.payment_account?.name}</strong> for{' '}
                    <strong>{formatAmount(expense.amount)}</strong>.
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
