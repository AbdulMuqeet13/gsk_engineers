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
import type { BiometricDevice } from '@/types';
import { destroy } from '@/actions/App/Http/Controllers/BiometricDeviceController';

type DeleteDeviceDialogProps = {
    open: boolean;
    onClose: () => void;
    device: BiometricDevice;
};

export function DeleteDeviceDialog({
    open,
    onClose,
    device,
}: DeleteDeviceDialogProps) {
    const { delete: deleteRequest, processing } = useForm({});

    function handleDelete() {
        deleteRequest(destroy(device).url, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Biometric Device</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete{' '}
                        <strong>{device.name}</strong> ({device.serial_number})?
                        This will also remove all queued commands for this
                        device. This action cannot be undone.
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
