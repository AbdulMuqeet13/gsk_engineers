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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Payslip } from '@/types';
import { updatePayslip } from '@/actions/App/Http/Controllers/PayrollRunController';

type EditPayslipDialogProps = {
    open: boolean;
    onClose: () => void;
    payslip: Payslip;
};

export function EditPayslipDialog({
    open,
    onClose,
    payslip,
}: EditPayslipDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        deductions: payslip.deductions,
        notes: payslip.notes ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        put(updatePayslip({ payroll_run: payslip.payroll_run_id, payslip: payslip.id }).url, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    }

    function handleOpenChange(isOpen: boolean) {
        if (!isOpen) {
            reset();
            onClose();
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Payslip</DialogTitle>
                    <DialogDescription>
                        Update payslip for{' '}
                        <strong>{payslip.employee?.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-deductions">Deductions</Label>
                        <Input
                            id="edit-deductions"
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.deductions}
                            onChange={(e) =>
                                setData('deductions', e.target.value)
                            }
                            placeholder="0.00"
                            required
                        />
                        {errors.deductions && (
                            <p className="text-destructive text-sm">
                                {errors.deductions}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Textarea
                            id="edit-notes"
                            value={data.notes}
                            onChange={(e) =>
                                setData('notes', e.target.value)
                            }
                            placeholder="Additional notes"
                            rows={3}
                        />
                        {errors.notes && (
                            <p className="text-destructive text-sm">
                                {errors.notes}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
