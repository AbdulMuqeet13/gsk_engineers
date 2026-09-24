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
import { store } from '@/actions/App/Http/Controllers/BiometricDeviceController';

type CreateDeviceDialogProps = {
    open: boolean;
    onClose: () => void;
};

export function CreateDeviceDialog({ open, onClose }: CreateDeviceDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        serial_number: '',
        model: '',
        location: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(store().url, {
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
                    <DialogTitle>Add Biometric Device</DialogTitle>
                    <DialogDescription>
                        Register a new ZKTeco biometric device.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="create-name">Name</Label>
                        <Input
                            id="create-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Main Office Device"
                            required
                        />
                        {errors.name && (
                            <p className="text-destructive text-sm">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="create-serial">Serial Number</Label>
                        <Input
                            id="create-serial"
                            value={data.serial_number}
                            onChange={(e) =>
                                setData('serial_number', e.target.value)
                            }
                            placeholder="e.g. ABCD12345678"
                            required
                        />
                        {errors.serial_number && (
                            <p className="text-destructive text-sm">
                                {errors.serial_number}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-model">
                                Model (optional)
                            </Label>
                            <Input
                                id="create-model"
                                value={data.model}
                                onChange={(e) =>
                                    setData('model', e.target.value)
                                }
                                placeholder="e.g. ZK-F22"
                            />
                            {errors.model && (
                                <p className="text-destructive text-sm">
                                    {errors.model}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-location">
                                Location (optional)
                            </Label>
                            <Input
                                id="create-location"
                                value={data.location}
                                onChange={(e) =>
                                    setData('location', e.target.value)
                                }
                                placeholder="e.g. Main Entrance"
                            />
                            {errors.location && (
                                <p className="text-destructive text-sm">
                                    {errors.location}
                                </p>
                            )}
                        </div>
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
                            {processing ? 'Adding...' : 'Add Device'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
