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
import { submit } from '@/actions/App/Http/Controllers/ExpenseController';

type SubmitExpenseDialogProps = {
    open: boolean;
    onClose: () => void;
    expense: Expense;
};

export function SubmitExpenseDialog({
    open,
    onClose,
    expense,
}: SubmitExpenseDialogProps) {
    const [processing, setProcessing] = useState(false);

    function handleSubmit() {
        setProcessing(true);

        router.post(submit(expense).url, {}, {
            onSuccess: () => onClose(),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submit Expense</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to submit expense{' '}
                        <strong>{expense.reference}</strong> for approval? Once
                        submitted, it cannot be edited.
                    </DialogDescription>
                </DialogHeader>

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
