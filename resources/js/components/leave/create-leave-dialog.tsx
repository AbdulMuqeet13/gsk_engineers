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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Employee, LeaveType } from '@/types';
import { store } from '@/actions/App/Http/Controllers/LeaveRequestController';

type CreateLeaveDialogProps = {
    open: boolean;
    onClose: () => void;
    employees: Pick<Employee, 'id' | 'name'>[];
    leaveTypes: LeaveType[];
};

export function CreateLeaveDialog({
    open,
    onClose,
    employees,
    leaveTypes,
}: CreateLeaveDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: '',
        leave_type: '',
        start_date: '',
        end_date: '',
        reason: '',
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
                    <DialogTitle>Create Leave Request</DialogTitle>
                    <DialogDescription>
                        Submit a new leave request for an employee.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="create-employee">Employee</Label>
                        <Select
                            value={data.employee_id}
                            onValueChange={(value) =>
                                setData('employee_id', value)
                            }
                        >
                            <SelectTrigger id="create-employee">
                                <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((employee) => (
                                    <SelectItem
                                        key={employee.id}
                                        value={String(employee.id)}
                                    >
                                        {employee.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.employee_id && (
                            <p className="text-destructive text-sm">
                                {errors.employee_id}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="create-leave-type">Leave Type</Label>
                        <Select
                            value={data.leave_type}
                            onValueChange={(value) =>
                                setData('leave_type', value)
                            }
                        >
                            <SelectTrigger id="create-leave-type">
                                <SelectValue placeholder="Select leave type" />
                            </SelectTrigger>
                            <SelectContent>
                                {leaveTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type.charAt(0).toUpperCase() +
                                            type.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.leave_type && (
                            <p className="text-destructive text-sm">
                                {errors.leave_type}
                            </p>
                        )}
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
                                required
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
                                required
                            />
                            {errors.end_date && (
                                <p className="text-destructive text-sm">
                                    {errors.end_date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="create-reason">Reason</Label>
                        <Textarea
                            id="create-reason"
                            value={data.reason}
                            onChange={(e) =>
                                setData('reason', e.target.value)
                            }
                            placeholder="Reason for leave"
                            rows={3}
                            required
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
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
