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
import type { EmployeeType } from '@/types';

type CreateEmployeeDialogProps = {
    open: boolean;
    onClose: () => void;
    employeeTypes: string[];
    projects: Array<{ id: number; name: string; code: string }>;
};

export function CreateEmployeeDialog({
    open,
    onClose,
    employeeTypes,
    projects,
}: CreateEmployeeDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        type: 'internal' as EmployeeType,
        project_id: null as number | null,
        designation: '',
        department: '',
        date_of_joining: '',
        salary: '',
        cnic: '',
        address: '',
        is_active: true,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(EmployeeController.store().url, {
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
                    <DialogTitle>Add Employee</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new employee.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Name</Label>
                            <Input
                                id="create-name"
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
                            <Label htmlFor="create-email">Email</Label>
                            <Input
                                id="create-email"
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
                            <Label htmlFor="create-phone">Phone</Label>
                            <Input
                                id="create-phone"
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
                            <Label htmlFor="create-type">Type</Label>
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
                                <SelectTrigger id="create-type">
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
                                <Label htmlFor="create-project">Project</Label>
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
                                    <SelectTrigger id="create-project">
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
                            <Label htmlFor="create-designation">
                                Designation
                            </Label>
                            <Input
                                id="create-designation"
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
                            <Label htmlFor="create-department">
                                Department
                            </Label>
                            <Input
                                id="create-department"
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
                            <Label htmlFor="create-doj">Date of Joining</Label>
                            <Input
                                id="create-doj"
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
                            <Label htmlFor="create-salary">Salary</Label>
                            <Input
                                id="create-salary"
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
                            <Label htmlFor="create-cnic">CNIC</Label>
                            <Input
                                id="create-cnic"
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
                        <Label htmlFor="create-address">Address</Label>
                        <textarea
                            id="create-address"
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
                            id="create-is-active"
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                setData('is_active', checked === true)
                            }
                        />
                        <Label htmlFor="create-is-active">Active</Label>
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
                            {processing ? 'Saving...' : 'Add Employee'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
