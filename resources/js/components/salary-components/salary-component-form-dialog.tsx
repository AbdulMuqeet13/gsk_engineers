import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { SalaryComponent } from '@/types';
import {
    store,
    update,
} from '@/actions/App/Http/Controllers/SalaryComponentController';

type SalaryComponentFormDialogProps = {
    open: boolean;
    onClose: () => void;
    salaryComponent?: SalaryComponent | null;
    nextSortOrder: number;
};

export function SalaryComponentFormDialog({
    open,
    onClose,
    salaryComponent,
    nextSortOrder,
}: SalaryComponentFormDialogProps) {
    const isEditing = !!salaryComponent;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: salaryComponent?.name ?? '',
        sort_order: String(salaryComponent?.sort_order ?? nextSortOrder),
        is_active: salaryComponent?.is_active ?? true,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                reset();
                onClose();
            },
        };

        if (salaryComponent) {
            put(update(salaryComponent).url, options);
        } else {
            post(store().url, options);
        }
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
                    <DialogTitle>
                        {isEditing
                            ? 'Edit Salary Component'
                            : 'Add Salary Component'}
                    </DialogTitle>
                    <DialogDescription>
                        Components make up an employee's salary breakdown, e.g.
                        Basic Salary or House Rent.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="min-w-0 space-y-2 sm:col-span-2">
                            <Label htmlFor="salary-component-name">Name</Label>
                            <Input
                                id="salary-component-name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                            />
                            {errors.name && (
                                <p className="text-destructive text-sm">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="salary-component-order">
                                Order
                            </Label>
                            <Input
                                id="salary-component-order"
                                type="number"
                                min="0"
                                value={data.sort_order}
                                onChange={(e) =>
                                    setData('sort_order', e.target.value)
                                }
                                required
                            />
                            {errors.sort_order && (
                                <p className="text-destructive text-sm">
                                    {errors.sort_order}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="salary-component-active"
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                setData('is_active', checked === true)
                            }
                        />
                        <Label htmlFor="salary-component-active">
                            Active (shown on salary forms)
                        </Label>
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
                            {processing ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
