import { useForm } from '@inertiajs/react';
import { DatePicker } from '@/components/date-picker';
import {
    buildComponentAmounts,
    SalaryBreakdownFields,
} from '@/components/employees/salary-breakdown-fields';
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
import type {
    Employee,
    EmployeeSalary,
    SalaryChangeType,
    SalaryComponent,
} from '@/types';
import { store } from '@/actions/App/Http/Controllers/EmployeeSalaryController';

type AddSalaryRecordDialogProps = {
    open: boolean;
    onClose: () => void;
    employee: Employee;
    currentSalary: EmployeeSalary | null;
    salaryComponents: Pick<SalaryComponent, 'id' | 'name'>[];
    salaryChangeTypes: SalaryChangeType[];
};

export function AddSalaryRecordDialog({
    open,
    onClose,
    employee,
    currentSalary,
    salaryComponents,
    salaryChangeTypes,
}: AddSalaryRecordDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        effective_date: '',
        change_type: 'increment' as SalaryChangeType,
        components: buildComponentAmounts(
            salaryComponents,
            currentSalary?.components?.map((component) => ({
                salary_component_id: component.salary_component_id,
                amount: component.amount,
            })),
        ),
        tax_amount: currentSalary?.tax_amount ?? '',
        security_amount: currentSalary?.security_amount ?? '',
        remarks: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(store(employee).url, {
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
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Increment / Revision</DialogTitle>
                    <DialogDescription>
                        Record a new salary for {employee.name}. Payroll uses
                        the latest record effective on or before the period end.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="salary-effective-date">
                                Effective Date
                            </Label>
                            <DatePicker
                                id="salary-effective-date"
                                value={data.effective_date}
                                onChange={(value) =>
                                    setData('effective_date', value)
                                }
                            />
                            {errors.effective_date && (
                                <p className="text-destructive text-sm">
                                    {errors.effective_date}
                                </p>
                            )}
                        </div>

                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="salary-change-type">Type</Label>
                            <Select
                                value={data.change_type}
                                onValueChange={(value) =>
                                    setData(
                                        'change_type',
                                        value as SalaryChangeType,
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="salary-change-type"
                                    className="w-full"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {salaryChangeTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.charAt(0).toUpperCase() +
                                                type.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.change_type && (
                                <p className="text-destructive text-sm">
                                    {errors.change_type}
                                </p>
                            )}
                        </div>
                    </div>

                    <SalaryBreakdownFields
                        idPrefix="salary-record"
                        salaryComponents={salaryComponents}
                        components={data.components}
                        taxAmount={data.tax_amount}
                        securityAmount={data.security_amount}
                        onComponentChange={(index, amount) =>
                            setData(
                                'components',
                                data.components.map((component, i) =>
                                    i === index
                                        ? { ...component, amount }
                                        : component,
                                ),
                            )
                        }
                        onTaxChange={(amount) => setData('tax_amount', amount)}
                        onSecurityChange={(amount) =>
                            setData('security_amount', amount)
                        }
                        errors={errors as Partial<Record<string, string>>}
                    />

                    <div className="space-y-2">
                        <Label htmlFor="salary-remarks">Remarks</Label>
                        <Textarea
                            id="salary-remarks"
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                            placeholder="e.g. Annual increment 2026"
                            rows={2}
                        />
                        {errors.remarks && (
                            <p className="text-destructive text-sm">
                                {errors.remarks}
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
                            {processing ? 'Saving...' : 'Save Salary'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
