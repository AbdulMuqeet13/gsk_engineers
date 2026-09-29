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
import { formatAmount } from '@/lib/utils';
import type { EmployeeSalary } from '@/types';
import { destroy } from '@/actions/App/Http/Controllers/EmployeeSalaryController';

type DeleteSalaryRecordDialogProps = {
    open: boolean;
    onClose: () => void;
    salary: EmployeeSalary;
};

export function DeleteSalaryRecordDialog({
    open,
    onClose,
    salary,
}: DeleteSalaryRecordDialogProps) {
    const { delete: destroySalary, processing } = useForm({});

    function handleDelete() {
        destroySalary(
            destroy({ employee: salary.employee_id, salary: salary.id }).url,
            { onSuccess: () => onClose() },
        );
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Salary Record</DialogTitle>
                    <DialogDescription>
                        Delete the salary of{' '}
                        <strong>{formatAmount(salary.gross_salary)}</strong>{' '}
                        effective {salary.effective_date}? Records already used
                        in payroll cannot be deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
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
