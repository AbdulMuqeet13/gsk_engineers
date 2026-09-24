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
import type { Attendance } from '@/types';
import { destroy } from '@/actions/App/Http/Controllers/AttendanceController';

type DeleteAttendanceDialogProps = {
    open: boolean;
    onClose: () => void;
    attendance: Attendance;
};

export function DeleteAttendanceDialog({
    open,
    onClose,
    attendance,
}: DeleteAttendanceDialogProps) {
    const { delete: deleteRequest, processing } = useForm({});

    function handleDelete() {
        deleteRequest(destroy(attendance).url, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Attendance Record</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the attendance record
                        for{' '}
                        <strong>{attendance.employee?.name}</strong> on{' '}
                        <strong>{attendance.date}</strong>? This
                        action cannot be undone.
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
