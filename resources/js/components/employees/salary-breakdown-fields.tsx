import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatAmount } from '@/lib/utils';
import type { SalaryComponent } from '@/types';

export type SalaryComponentAmount = {
    salary_component_id: number;
    amount: string;
};

type SalaryBreakdownFieldsProps = {
    idPrefix: string;
    salaryComponents: Pick<SalaryComponent, 'id' | 'name'>[];
    components: SalaryComponentAmount[];
    taxAmount: string;
    securityAmount: string;
    onComponentChange: (index: number, amount: string) => void;
    onTaxChange: (amount: string) => void;
    onSecurityChange: (amount: string) => void;
    errors: Partial<Record<string, string>>;
};

export function buildComponentAmounts(
    salaryComponents: Pick<SalaryComponent, 'id' | 'name'>[],
    existing: SalaryComponentAmount[] = [],
): SalaryComponentAmount[] {
    return salaryComponents.map((component) => ({
        salary_component_id: component.id,
        amount:
            existing.find((item) => item.salary_component_id === component.id)
                ?.amount ?? '',
    }));
}

export function SalaryBreakdownFields({
    idPrefix,
    salaryComponents,
    components,
    taxAmount,
    securityAmount,
    onComponentChange,
    onTaxChange,
    onSecurityChange,
    errors,
}: SalaryBreakdownFieldsProps) {
    const grossSalary = components.reduce(
        (total, component) => total + (Number(component.amount) || 0),
        0,
    );
    const netSalary =
        grossSalary - (Number(taxAmount) || 0) - (Number(securityAmount) || 0);

    return (
        <div className="space-y-4 rounded-lg border p-4">
            <div>
                <h3 className="text-sm font-medium">Salary Breakdown</h3>
                <p className="text-muted-foreground text-xs">
                    Monthly amounts. Project allowances are added from project
                    assignments.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {salaryComponents.map((salaryComponent, index) => (
                    <div key={salaryComponent.id} className="min-w-0 space-y-2">
                        <Label
                            htmlFor={`${idPrefix}-component-${salaryComponent.id}`}
                        >
                            {salaryComponent.name}
                        </Label>
                        <Input
                            id={`${idPrefix}-component-${salaryComponent.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={components[index]?.amount ?? ''}
                            onChange={(e) =>
                                onComponentChange(index, e.target.value)
                            }
                        />
                        {errors[`components.${index}.amount`] && (
                            <p className="text-destructive text-sm">
                                {errors[`components.${index}.amount`]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            {errors.components && (
                <p className="text-destructive text-sm">{errors.components}</p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0 space-y-2">
                    <Label htmlFor={`${idPrefix}-tax`}>Monthly Tax</Label>
                    <Input
                        id={`${idPrefix}-tax`}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={taxAmount}
                        onChange={(e) => onTaxChange(e.target.value)}
                    />
                    {errors.tax_amount && (
                        <p className="text-destructive text-sm">
                            {errors.tax_amount}
                        </p>
                    )}
                </div>

                <div className="min-w-0 space-y-2">
                    <Label htmlFor={`${idPrefix}-security`}>
                        Monthly Security Deduction
                    </Label>
                    <Input
                        id={`${idPrefix}-security`}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={securityAmount}
                        onChange={(e) => onSecurityChange(e.target.value)}
                    />
                    {errors.security_amount && (
                        <p className="text-destructive text-sm">
                            {errors.security_amount}
                        </p>
                    )}
                </div>
            </div>

            <div className="bg-muted/50 grid grid-cols-2 gap-2 rounded-md p-3 text-sm">
                <span className="text-muted-foreground">Gross Salary</span>
                <span className="text-right font-mono font-medium">
                    {formatAmount(grossSalary)}
                </span>
                <span className="text-muted-foreground">
                    Net (before allowances)
                </span>
                <span className="text-right font-mono font-medium">
                    {formatAmount(netSalary)}
                </span>
            </div>
        </div>
    );
}
