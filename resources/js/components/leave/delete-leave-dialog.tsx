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
import type { LeaveRequest } from '@/types';
import { destroy } from '@/actions/App/Http/Controllers/LeaveRequestController';

type DeleteLeaveDialogProps = {
    open: boolean;
    onClose: () => void;
    leave: LeaveRequest;
};

export function DeleteLeaveDialog({
    open,
    onClose,
    leave,
}: DeleteLeaveDialogProps) {
    const { delete: deleteRequest, processing } = useForm({});

    function handleDelete() {
        deleteRequest(destroy(leave).url, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Leave Request</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the leave request for{' '}
                        <strong>{leave.employee?.name}</strong> (
                        {leave.leave_type}, {leave.days} days)? This action
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
