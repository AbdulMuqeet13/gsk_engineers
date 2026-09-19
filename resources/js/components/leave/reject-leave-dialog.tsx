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
import type { LeaveRequest } from '@/types';
import { reject } from '@/actions/App/Http/Controllers/LeaveRequestController';

type RejectLeaveDialogProps = {
    open: boolean;
    onClose: () => void;
    leave: LeaveRequest;
};

export function RejectLeaveDialog({
    open,
    onClose,
    leave,
}: RejectLeaveDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        rejection_reason: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(reject(leave).url, {
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
                    <DialogTitle>Reject Leave Request</DialogTitle>
                    <DialogDescription>
                        Provide a reason for rejecting the leave request from{' '}
                        <strong>{leave.employee?.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reject-reason">Reason</Label>
                        <Textarea
                            id="reject-reason"
                            value={data.rejection_reason}
                            onChange={(e) =>
                                setData('rejection_reason', e.target.value)
                            }
                            placeholder="Why is this leave request being rejected?"
                            rows={3}
                            required
                        />
                        {errors.rejection_reason && (
                            <p className="text-destructive text-sm">
                                {errors.rejection_reason}
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
