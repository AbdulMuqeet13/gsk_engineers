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
import { formatAmount } from '@/lib/utils';
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
        tax_amount: payslip.tax_amount,
        security_amount: payslip.security_amount,
        deductions: payslip.deductions,
        notes: payslip.notes ?? '',
    });

    const netSalary =
        Number(payslip.gross_salary) -
        (Number(data.tax_amount) || 0) -
        (Number(data.security_amount) || 0) -
        (Number(data.deductions) || 0);

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
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="edit-tax">Tax</Label>
                            <Input
                                id="edit-tax"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.tax_amount}
                                onChange={(e) =>
                                    setData('tax_amount', e.target.value)
                                }
                                placeholder="0.00"
                                required
                            />
                            {errors.tax_amount && (
                                <p className="text-destructive text-sm">
                                    {errors.tax_amount}
                                </p>
                            )}
                        </div>
                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="edit-security">Security</Label>
                            <Input
                                id="edit-security"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.security_amount}
                                onChange={(e) =>
                                    setData('security_amount', e.target.value)
                                }
                                placeholder="0.00"
                                required
                            />
                            {errors.security_amount && (
                                <p className="text-destructive text-sm">
                                    {errors.security_amount}
                                </p>
                            )}
                        </div>
                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="edit-deductions">Other Deductions</Label>
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
                    </div>

                    <div className="bg-muted/50 grid grid-cols-2 gap-2 rounded-md p-3 text-sm">
                        <span className="text-muted-foreground">
                            Gross Salary
                        </span>
                        <span className="text-right font-mono">
                            {formatAmount(payslip.gross_salary)}
                        </span>
                        <span className="text-muted-foreground">
                            Net Salary
                        </span>
                        <span className="text-right font-mono font-medium">
                            {formatAmount(netSalary)}
                        </span>
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
