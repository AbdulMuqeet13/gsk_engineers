import { useForm } from '@inertiajs/react';
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
import { destroy } from '@/actions/App/Http/Controllers/ExpenseController';

type DeleteExpenseDialogProps = {
    open: boolean;
    onClose: () => void;
    expense: Expense;
};

export function DeleteExpenseDialog({
    open,
    onClose,
    expense,
}: DeleteExpenseDialogProps) {
    const { delete: deleteRequest, processing } = useForm({});

    function handleDelete() {
        deleteRequest(destroy(expense).url, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Expense</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the expense{' '}
                        <strong>{expense.reference}</strong>? This action
                        cannot be undone.
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
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        {processing ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
