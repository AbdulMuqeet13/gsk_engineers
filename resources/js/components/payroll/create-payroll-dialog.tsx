import { useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { DatePicker } from '@/components/date-picker';
import { EmployeeMultiSelect } from '@/components/payroll/employee-multi-select';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AccountHead, Employee, Project } from '@/types';
import { store } from '@/actions/App/Http/Controllers/PayrollRunController';

type CreatePayrollDialogProps = {
    open: boolean;
    onClose: () => void;
    paymentAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
    employees: (Pick<Employee, 'id' | 'name' | 'designation' | 'project_id'> & {
        assignments?: { project_id: number }[];
    })[];
};

const ALL_EMPLOYEES = 'all';

export function CreatePayrollDialog({
    open,
    onClose,
    paymentAccounts,
    projects,
    employees,
}: CreatePayrollDialogProps) {
    const { data, setData, transform, post, processing, errors, reset } = useForm({
        period_start: '',
        period_end: '',
        payment_account_id: '',
        description: '',
        project_id: '',
        employee_ids: [] as string[],
    });

    const employeesInScope = useMemo(() => {
        if (!data.project_id) {
            return employees;
        }

        const projectId = Number(data.project_id);

        return employees.filter(
            (employee) =>
                employee.project_id === projectId ||
                employee.assignments?.some(
                    (assignment) => assignment.project_id === projectId,
                ),
        );
    }, [employees, data.project_id]);

    transform((formData) => ({
        ...formData,
        project_id: formData.project_id || null,
    }));

    function handleProjectChange(value: string) {
        setData((previous) => ({
            ...previous,
            project_id: value === ALL_EMPLOYEES ? '' : value,
            employee_ids: [],
        }));
    }

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
                    <DialogTitle>Create Payroll Run</DialogTitle>
                    <DialogDescription>
                        Create a payroll run for a pay period, for everyone or
                        for one project or selected employees.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-period-start">
                                Period Start
                            </Label>
                            <DatePicker
                                id="create-period-start"
                                value={data.period_start}
                                onChange={(value) =>
                                    setData('period_start', value)
                                }
                            />
                            {errors.period_start && (
                                <p className="text-destructive text-sm">
                                    {errors.period_start}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-period-end">
                                Period End
                            </Label>
                            <DatePicker
                                id="create-period-end"
                                value={data.period_end}
                                onChange={(value) =>
                                    setData('period_end', value)
                                }
                            />
                            {errors.period_end && (
                                <p className="text-destructive text-sm">
                                    {errors.period_end}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="create-payment-account">
                            Payment Account
                        </Label>
                        <Select
                            value={data.payment_account_id}
                            onValueChange={(value) =>
                                setData('payment_account_id', value)
                            }
                        >
                            <SelectTrigger id="create-payment-account">
                                <SelectValue placeholder="Select payment account" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentAccounts.map((account) => (
                                    <SelectItem
                                        key={account.id}
                                        value={String(account.id)}
                                    >
                                        {account.code} - {account.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.payment_account_id && (
                            <p className="text-destructive text-sm">
                                {errors.payment_account_id}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="create-project">Project</Label>
                        <Select
                            value={data.project_id || ALL_EMPLOYEES}
                            onValueChange={handleProjectChange}
                        >
                            <SelectTrigger id="create-project">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL_EMPLOYEES}>
                                    All projects
                                </SelectItem>
                                {projects.map((project) => (
                                    <SelectItem
                                        key={project.id}
                                        value={String(project.id)}
                                    >
                                        {project.code} - {project.name}
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
                        <Label htmlFor="create-employees">
                            Employees (optional)
                        </Label>
                        <EmployeeMultiSelect
                            id="create-employees"
                            employees={employeesInScope}
                            value={data.employee_ids}
                            onChange={(value) => setData('employee_ids', value)}
                            placeholder={
                                data.project_id
                                    ? 'All employees of the project'
                                    : 'All active employees'
                            }
                        />
                        <p className="text-muted-foreground text-xs">
                            Leave empty to include everyone in scope. Employees
                            already in another payroll run for this period are
                            skipped.
                        </p>
                        {(errors.employee_ids ||
                            Object.entries(errors).find(([key]) =>
                                key.startsWith('employee_ids.'),
                            )) && (
                            <p className="text-destructive text-sm">
                                {errors.employee_ids ??
                                    'One of the selected employees is not active.'}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="create-description">
                            Description (optional)
                        </Label>
                        <Textarea
                            id="create-description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Payroll run description"
                            rows={3}
                        />
                        {errors.description && (
                            <p className="text-destructive text-sm">
                                {errors.description}
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
