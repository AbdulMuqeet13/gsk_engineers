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
import { Textarea } from '@/components/ui/textarea';
import { toInputDate } from '@/lib/utils';
import type { Attendance, Employee } from '@/types';
import { update } from '@/actions/App/Http/Controllers/AttendanceController';

type EditAttendanceDialogProps = {
    open: boolean;
    onClose: () => void;
    attendance: Attendance;
    employees: Pick<Employee, 'id' | 'name'>[];
    attendanceStatuses: string[];
};

export function EditAttendanceDialog({
    open,
    onClose,
    attendance,
    employees,
    attendanceStatuses,
}: EditAttendanceDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        employee_id: String(attendance.employee_id),
        date: toInputDate(attendance.date),
        status: attendance.status,
        check_in: attendance.check_in ?? '',
        check_out: attendance.check_out ?? '',
        notes: attendance.notes ?? '',
    });

    useEffect(() => {
        setData({
            employee_id: String(attendance.employee_id),
            date: toInputDate(attendance.date),
            status: attendance.status,
            check_in: attendance.check_in ?? '',
            check_out: attendance.check_out ?? '',
            notes: attendance.notes ?? '',
        });
    }, [attendance]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        put(update(attendance).url, {
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
                    <DialogTitle>Edit Attendance</DialogTitle>
                    <DialogDescription>
                        Update the attendance record for{' '}
                        <strong>{attendance.employee?.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-employee">Employee</Label>
                            <Select
                                value={data.employee_id}
                                onValueChange={(value) =>
                                    setData('employee_id', value)
                                }
                            >
                                <SelectTrigger id="edit-employee">
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
                            <Label htmlFor="edit-date">Date</Label>
                            <Input
                                id="edit-date"
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
                        <Label htmlFor="edit-status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value) =>
                                setData('status', value)
                            }
                        >
                            <SelectTrigger id="edit-status">
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
                            <Label htmlFor="edit-check-in">
                                Check In (optional)
                            </Label>
                            <Input
                                id="edit-check-in"
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
                            <Label htmlFor="edit-check-out">
                                Check Out (optional)
                            </Label>
                            <Input
                                id="edit-check-out"
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
                        <Label htmlFor="edit-notes">Notes (optional)</Label>
                        <Textarea
                            id="edit-notes"
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
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
