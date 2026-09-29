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
import type { ProjectIncome } from '@/types';
import { reverse } from '@/actions/App/Http/Controllers/ProjectIncomeController';

type ReverseIncomeDialogProps = {
    open: boolean;
    onClose: () => void;
    income: ProjectIncome;
};

export function ReverseIncomeDialog({
    open,
    onClose,
    income,
}: ReverseIncomeDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        reason: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(reverse(income).url, {
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

    function formatAmount(amount: string): string {
        return parseFloat(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reverse Income</DialogTitle>
                    <DialogDescription>
                        This will create a reversing journal entry for income{' '}
                        <strong>{income.reference}</strong> of{' '}
                        <strong>{formatAmount(income.amount)}</strong> for{' '}
                        <strong>{income.project?.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reverse-reason">
                            Reason (optional)
                        </Label>
                        <Textarea
                            id="reverse-reason"
                            value={data.reason}
                            onChange={(e) =>
                                setData('reason', e.target.value)
                            }
                            placeholder="Why is this income being reversed?"
                            rows={3}
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
                            {processing ? 'Reversing...' : 'Reverse'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
