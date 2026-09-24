import { router } from '@inertiajs/react';
import { useState } from 'react';
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
import { approve } from '@/actions/App/Http/Controllers/LeaveRequestController';

type ApproveLeaveDialogProps = {
    open: boolean;
    onClose: () => void;
    leave: LeaveRequest;
};

export function ApproveLeaveDialog({
    open,
    onClose,
    leave,
}: ApproveLeaveDialogProps) {
    const [processing, setProcessing] = useState(false);

    function handleApprove() {
        setProcessing(true);

        router.post(approve(leave).url, {}, {
            onSuccess: () => onClose(),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Approve Leave Request</DialogTitle>
                    <DialogDescription>
                        Review the leave request details before approving.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted/50 space-y-2 rounded-md border p-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Employee</span>
                        <span className="font-medium">
                            {leave.employee?.name}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Leave Type
                        </span>
                        <span className="font-medium">
                            {leave.leave_type.charAt(0).toUpperCase() +
                                leave.leave_type.slice(1)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Period</span>
                        <span className="font-medium">
                            {leave.start_date} &ndash;{' '}
                            {leave.end_date}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Days</span>
                        <span className="font-medium">{leave.days}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Reason</span>
                        <span className="max-w-[200px] truncate font-medium">
                            {leave.reason}
                        </span>
                    </div>
                </div>

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
                        onClick={handleApprove}
                        disabled={processing}
                    >
                        {processing ? 'Approving...' : 'Approve'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
