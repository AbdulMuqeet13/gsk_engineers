import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import EmployeeController from '@/actions/App/Http/Controllers/EmployeeController';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Employee, EmployeeType } from '@/types';

type EditEmployeeDialogProps = {
    open: boolean;
    onClose: () => void;
    employee: Employee;
    employeeTypes: string[];
    projects: Array<{ id: number; name: string; code: string }>;
};

export function EditEmployeeDialog({
    open,
    onClose,
    employee,
    employeeTypes,
    projects,
}: EditEmployeeDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: employee.name,
        email: employee.email ?? '',
        phone: employee.phone ?? '',
        type: employee.type as EmployeeType,
        project_id: employee.project_id,
        designation: employee.designation,
        department: employee.department,
        date_of_joining: employee.date_of_joining,
        salary: employee.salary,
        cnic: employee.cnic,
        address: employee.address,
        is_active: employee.is_active,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put(EmployeeController.update(employee).url, {
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
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Employee</DialogTitle>
                    <DialogDescription>
                        Update the employee details below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="text-destructive text-sm">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                            {errors.email && (
                                <p className="text-destructive text-sm">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">Phone</Label>
                            <Input
                                id="edit-phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                            />
                            {errors.phone && (
                                <p className="text-destructive text-sm">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-type">Type</Label>
                            <Select
                                value={data.type}
                                onValueChange={(value: EmployeeType) => {
                                    setData((prev) => ({
                                        ...prev,
                                        type: value,
                                        project_id:
                                            value === 'internal'
                                                ? null
                                                : prev.project_id,
                                    }));
                                }}
                            >
                                <SelectTrigger id="edit-type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {employeeTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.charAt(0).toUpperCase() +
                                                type.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-destructive text-sm">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        {data.type === 'project' && (
                            <div className="space-y-2">
                                <Label htmlFor="edit-project">Project</Label>
                                <Select
                                    value={
                                        data.project_id !== null
                                            ? String(data.project_id)
                                            : ''
                                    }
                                    onValueChange={(value) =>
                                        setData('project_id', Number(value))
                                    }
                                >
                                    <SelectTrigger id="edit-project">
                                        <SelectValue placeholder="Select project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map((project) => (
                                            <SelectItem
                                                key={project.id}
                                                value={String(project.id)}
                                            >
                                                {project.code} — {project.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.project_id && (
                                    <p className="text-destructive text-sm">
                                        {errors.project_id}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="edit-designation">
                                Designation
                            </Label>
                            <Input
                                id="edit-designation"
                                value={data.designation}
                                onChange={(e) =>
                                    setData('designation', e.target.value)
                                }
                            />
                            {errors.designation && (
                                <p className="text-destructive text-sm">
                                    {errors.designation}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-department">Department</Label>
                            <Input
                                id="edit-department"
                                value={data.department}
                                onChange={(e) =>
                                    setData('department', e.target.value)
                                }
                            />
                            {errors.department && (
                                <p className="text-destructive text-sm">
                                    {errors.department}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-doj">Date of Joining</Label>
                            <Input
                                id="edit-doj"
                                type="date"
                                value={data.date_of_joining}
                                onChange={(e) =>
                                    setData('date_of_joining', e.target.value)
                                }
                            />
                            {errors.date_of_joining && (
                                <p className="text-destructive text-sm">
                                    {errors.date_of_joining}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-salary">Salary</Label>
                            <Input
                                id="edit-salary"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.salary}
                                onChange={(e) =>
                                    setData('salary', e.target.value)
                                }
                            />
                            {errors.salary && (
                                <p className="text-destructive text-sm">
                                    {errors.salary}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-cnic">CNIC</Label>
                            <Input
                                id="edit-cnic"
                                value={data.cnic}
                                onChange={(e) =>
                                    setData('cnic', e.target.value)
                                }
                            />
                            {errors.cnic && (
                                <p className="text-destructive text-sm">
                                    {errors.cnic}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-address">Address</Label>
                        <textarea
                            id="edit-address"
                            className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm shadow-xs focus-visible:ring-[3px] focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            rows={3}
                        />
                        {errors.address && (
                            <p className="text-destructive text-sm">
                                {errors.address}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="edit-is-active"
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                setData('is_active', checked === true)
                            }
                        />
                        <Label htmlFor="edit-is-active">Active</Label>
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
                            {processing ? 'Saving...' : 'Update Employee'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
