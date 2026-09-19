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
import type { PayrollRun } from '@/types';
import { destroy } from '@/actions/App/Http/Controllers/PayrollRunController';

type DeletePayrollDialogProps = {
    open: boolean;
    onClose: () => void;
    payrollRun: PayrollRun;
};

export function DeletePayrollDialog({
    open,
    onClose,
    payrollRun,
}: DeletePayrollDialogProps) {
    const { delete: deleteRequest, processing } = useForm({});

    function handleDelete() {
        deleteRequest(destroy({ payroll_run: payrollRun.id }).url, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Payroll Run</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete payroll run{' '}
                        <strong>{payrollRun.reference}</strong>? This action
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
