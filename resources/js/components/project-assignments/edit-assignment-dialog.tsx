import { useForm } from '@inertiajs/react';
import ProjectAssignmentController from '@/actions/App/Http/Controllers/ProjectAssignmentController';
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
import type { ProjectAssignment } from '@/types';

type EditAssignmentDialogProps = {
    open: boolean;
    onClose: () => void;
    assignment: ProjectAssignment;
    employees: Array<{ id: number; name: string }>;
    projects: Array<{ id: number; name: string; code: string }>;
};

export function EditAssignmentDialog({
    open,
    onClose,
    assignment,
    employees,
    projects,
}: EditAssignmentDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        employee_id: String(assignment.employee_id),
        project_id: String(assignment.project_id),
        role: assignment.role,
        allocation_percent: assignment.allocation_percent,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(ProjectAssignmentController.update(assignment).url, {
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
                    <DialogTitle>Edit Assignment</DialogTitle>
                    <DialogDescription>
                        Update the assignment details for{' '}
                        {assignment.employee?.name ?? 'this employee'}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-employee_id">Employee</Label>
                        <Select
                            value={data.employee_id}
                            onValueChange={(value) =>
                                setData('employee_id', value)
                            }
                        >
                            <SelectTrigger
                                id="edit-employee_id"
                                className="w-full"
                            >
                                <SelectValue placeholder="Select an employee" />
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
                        <Label htmlFor="edit-project_id">Project</Label>
                        <Select
                            value={data.project_id}
                            onValueChange={(value) =>
                                setData('project_id', value)
                            }
                        >
                            <SelectTrigger
                                id="edit-project_id"
                                className="w-full"
                            >
                                <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map((project) => (
                                    <SelectItem
                                        key={project.id}
                                        value={String(project.id)}
                                    >
                                        {project.name} ({project.code})
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

                    <div className="space-y-2">
                        <Label htmlFor="edit-role">Role</Label>
                        <Input
                            id="edit-role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            placeholder="e.g. Site Engineer, Surveyor"
                        />
                        {errors.role && (
                            <p className="text-destructive text-sm">
                                {errors.role}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-allocation_percent">
                            Allocation (%)
                        </Label>
                        <Input
                            id="edit-allocation_percent"
                            type="number"
                            min={0}
                            max={100}
                            value={data.allocation_percent}
                            onChange={(e) =>
                                setData('allocation_percent', e.target.value)
                            }
                        />
                        {errors.allocation_percent && (
                            <p className="text-destructive text-sm">
                                {errors.allocation_percent}
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
