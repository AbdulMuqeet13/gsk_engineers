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
import type { SalaryComponent } from '@/types';
import { destroy } from '@/actions/App/Http/Controllers/SalaryComponentController';

type DeleteSalaryComponentDialogProps = {
    open: boolean;
    onClose: () => void;
    salaryComponent: SalaryComponent;
};

export function DeleteSalaryComponentDialog({
    open,
    onClose,
    salaryComponent,
}: DeleteSalaryComponentDialogProps) {
    const { delete: destroyComponent, processing } = useForm({});

    function handleDelete() {
        destroyComponent(destroy(salaryComponent).url, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Salary Component</DialogTitle>
                    <DialogDescription>
                        Delete <strong>{salaryComponent.name}</strong>? It will
                        no longer appear on salary forms. Existing salary
                        records and payslips keep their amounts.
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
