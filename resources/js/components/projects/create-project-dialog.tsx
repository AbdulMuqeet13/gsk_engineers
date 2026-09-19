import { useForm } from '@inertiajs/react';
import type React from 'react';
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
import { store } from '@/actions/App/Http/Controllers/ProjectController';

type CreateProjectDialogProps = {
    open: boolean;
    onClose: () => void;
    statuses: string[];
};

export function CreateProjectDialog({
    open,
    onClose,
    statuses,
}: CreateProjectDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        name: '',
        client: '',
        status: 'planning',
        start_date: '',
        end_date: '',
        budget: '',
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
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                        Add a new project to the system.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-code">Code</Label>
                            <Input
                                id="create-code"
                                value={data.code}
                                onChange={(e) =>
                                    setData('code', e.target.value)
                                }
                                placeholder="PRJ-001"
                            />
                            {errors.code && (
                                <p className="text-destructive text-sm">
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-name">Name</Label>
                            <Input
                                id="create-name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Project name"
                            />
                            {errors.name && (
                                <p className="text-destructive text-sm">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="create-client">Client</Label>
                        <Input
                            id="create-client"
                            value={data.client}
                            onChange={(e) =>
                                setData('client', e.target.value)
                            }
                            placeholder="Client name (optional)"
                        />
                        {errors.client && (
                            <p className="text-destructive text-sm">
                                {errors.client}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value) =>
                                    setData('status', value)
                                }
                            >
                                <SelectTrigger id="create-status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((status) => (
                                        <SelectItem
                                            key={status}
                                            value={status}
                                        >
                                            {status
                                                .replace('_', ' ')
                                                .replace(/\b\w/g, (c) =>
                                                    c.toUpperCase(),
                                                )}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-destructive text-sm">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-budget">Budget</Label>
                            <Input
                                id="create-budget"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.budget}
                                onChange={(e) =>
                                    setData('budget', e.target.value)
                                }
                                placeholder="0.00"
                            />
                            {errors.budget && (
                                <p className="text-destructive text-sm">
                                    {errors.budget}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-start-date">
                                Start Date
                            </Label>
                            <Input
                                id="create-start-date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData('start_date', e.target.value)
                                }
                            />
                            {errors.start_date && (
                                <p className="text-destructive text-sm">
                                    {errors.start_date}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-end-date">End Date</Label>
                            <Input
                                id="create-end-date"
                                type="date"
                                value={data.end_date}
                                onChange={(e) =>
                                    setData('end_date', e.target.value)
                                }
                            />
                            {errors.end_date && (
                                <p className="text-destructive text-sm">
                                    {errors.end_date}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Create Project
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
