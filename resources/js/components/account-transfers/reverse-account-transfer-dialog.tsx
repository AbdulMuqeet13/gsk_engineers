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
import type { AccountTransfer } from '@/types';
import { reverse } from '@/actions/App/Http/Controllers/AccountTransferController';

type ReverseAccountTransferDialogProps = {
    open: boolean;
    onClose: () => void;
    accountTransfer: AccountTransfer;
};

export function ReverseAccountTransferDialog({
    open,
    onClose,
    accountTransfer,
}: ReverseAccountTransferDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        reason: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(reverse(accountTransfer).url, {
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
                    <DialogTitle>Reverse Account Transfer</DialogTitle>
                    <DialogDescription>
                        This will create a reversing journal entry for transfer{' '}
                        <strong>{accountTransfer.reference}</strong> of{' '}
                        <strong>{formatAmount(accountTransfer.amount)}</strong>{' '}
                        from <strong>{accountTransfer.from_account?.name}</strong>{' '}
                        to <strong>{accountTransfer.to_account?.name}</strong>.
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
                            placeholder="Why is this transfer being reversed?"
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
