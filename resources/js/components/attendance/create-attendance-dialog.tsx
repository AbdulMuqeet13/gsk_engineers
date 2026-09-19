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
import type { Employee } from '@/types';
import { store } from '@/actions/App/Http/Controllers/AttendanceController';

type CreateAttendanceDialogProps = {
    open: boolean;
    onClose: () => void;
    employees: Pick<Employee, 'id' | 'name'>[];
    attendanceStatuses: string[];
};

export function CreateAttendanceDialog({
    open,
    onClose,
    employees,
    attendanceStatuses,
}: CreateAttendanceDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: '',
        date: '',
        status: '',
        check_in: '',
        check_out: '',
        notes: '',
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

    const statusLabels: Record<string, string> = {
        present: 'Present',
        absent: 'Absent',
        half_day: 'Half Day',
        leave: 'Leave',
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mark Attendance</DialogTitle>
                    <DialogDescription>
                        Record attendance for an employee.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
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
                            <Label htmlFor="create-date">Date</Label>
                            <Input
                                id="create-date"
                                type="date"
                                value={data.date}
                                onChange={(e) =>
                                    setData('date', e.target.value)
                                }
                                required
                            />
                            {errors.date && (
                                <p className="text-destructive text-sm">
                                    {errors.date}
                                </p>
                            )}
                        </div>
                    </div>

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
                                {attendanceStatuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {statusLabels[status] ?? status}
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

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-check-in">
                                Check In (optional)
                            </Label>
                            <Input
                                id="create-check-in"
                                type="time"
                                value={data.check_in}
                                onChange={(e) =>
                                    setData('check_in', e.target.value)
                                }
                            />
                            {errors.check_in && (
                                <p className="text-destructive text-sm">
                                    {errors.check_in}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-check-out">
                                Check Out (optional)
                            </Label>
                            <Input
                                id="create-check-out"
                                type="time"
                                value={data.check_out}
                                onChange={(e) =>
                                    setData('check_out', e.target.value)
                                }
                            />
                            {errors.check_out && (
                                <p className="text-destructive text-sm">
                                    {errors.check_out}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="create-notes">Notes (optional)</Label>
                        <Textarea
                            id="create-notes"
                            value={data.notes}
                            onChange={(e) =>
                                setData('notes', e.target.value)
                            }
                            placeholder="Additional notes"
                            rows={3}
                        />
                        {errors.notes && (
                            <p className="text-destructive text-sm">
                                {errors.notes}
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
                            {processing ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
