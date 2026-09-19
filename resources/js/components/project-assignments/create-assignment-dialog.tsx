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

type CreateAssignmentDialogProps = {
    open: boolean;
    onClose: () => void;
    employees: Array<{ id: number; name: string }>;
    projects: Array<{ id: number; name: string; code: string }>;
};

export function CreateAssignmentDialog({
    open,
    onClose,
    employees,
    projects,
}: CreateAssignmentDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: '',
        project_id: '',
        role: '',
        allocation_percent: '100',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(ProjectAssignmentController.store().url, {
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
                    <DialogTitle>Assign Employee</DialogTitle>
                    <DialogDescription>
                        Assign an employee to a project with a specific role and
                        allocation.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="employee_id">Employee</Label>
                        <Select
                            value={data.employee_id}
                            onValueChange={(value) =>
                                setData('employee_id', value)
                            }
                        >
                            <SelectTrigger id="employee_id" className="w-full">
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
                        <Label htmlFor="project_id">Project</Label>
                        <Select
                            value={data.project_id}
                            onValueChange={(value) =>
                                setData('project_id', value)
                            }
                        >
                            <SelectTrigger id="project_id" className="w-full">
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
                        <Label htmlFor="role">Role</Label>
                        <Input
                            id="role"
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
                        <Label htmlFor="allocation_percent">
                            Allocation (%)
                        </Label>
                        <Input
                            id="allocation_percent"
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
                            {processing ? 'Assigning...' : 'Assign'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
