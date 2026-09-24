import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { BiometricDevice } from '@/types';
import { update } from '@/actions/App/Http/Controllers/BiometricDeviceController';

type EditDeviceDialogProps = {
    open: boolean;
    onClose: () => void;
    device: BiometricDevice;
};

export function EditDeviceDialog({
    open,
    onClose,
    device,
}: EditDeviceDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: device.name,
        serial_number: device.serial_number,
        model: device.model ?? '',
        location: device.location ?? '',
        is_active: device.is_active,
    });

    useEffect(() => {
        setData({
            name: device.name,
            serial_number: device.serial_number,
            model: device.model ?? '',
            location: device.location ?? '',
            is_active: device.is_active,
        });
    }, [device]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        put(update(device).url, {
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
                    <DialogTitle>Edit Biometric Device</DialogTitle>
                    <DialogDescription>
                        Update the device details for{' '}
                        <strong>{device.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                            id="edit-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && (
                            <p className="text-destructive text-sm">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-serial">Serial Number</Label>
                        <Input
                            id="edit-serial"
                            value={data.serial_number}
                            onChange={(e) =>
                                setData('serial_number', e.target.value)
                            }
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
                            <Label htmlFor="edit-model">Model (optional)</Label>
                            <Input
                                id="edit-model"
                                value={data.model}
                                onChange={(e) =>
                                    setData('model', e.target.value)
                                }
                            />
                            {errors.model && (
                                <p className="text-destructive text-sm">
                                    {errors.model}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-location">
                                Location (optional)
                            </Label>
                            <Input
                                id="edit-location"
                                value={data.location}
                                onChange={(e) =>
                                    setData('location', e.target.value)
                                }
                            />
                            {errors.location && (
                                <p className="text-destructive text-sm">
                                    {errors.location}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <Select
                            value={data.is_active ? 'active' : 'inactive'}
                            onValueChange={(value) =>
                                setData('is_active', value === 'active')
                            }
                        >
                            <SelectTrigger id="edit-status">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                            </SelectContent>
                        </Select>
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
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
