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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { PayrollRun } from '@/types';
import { reject } from '@/actions/App/Http/Controllers/PayrollRunController';

type RejectPayrollDialogProps = {
    open: boolean;
    onClose: () => void;
    payrollRun: PayrollRun;
};

export function RejectPayrollDialog({
    open,
    onClose,
    payrollRun,
}: RejectPayrollDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        reason: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(reject({ payroll_run: payrollRun.id }).url, {
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
                    <DialogTitle>Reject Payroll Run</DialogTitle>
                    <DialogDescription>
                        Provide a reason for rejecting payroll run{' '}
                        <strong>{payrollRun.reference}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reject-reason">Reason</Label>
                        <Textarea
                            id="reject-reason"
                            value={data.reason}
                            onChange={(e) =>
                                setData('reason', e.target.value)
                            }
                            placeholder="Why is this payroll run being rejected?"
                            rows={3}
                            required
                        />
                        {errors.reason && (
                            <p className="text-destructive text-sm">
                                {errors.reason}
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
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={processing}
                        >
                            {processing ? 'Rejecting...' : 'Reject'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
