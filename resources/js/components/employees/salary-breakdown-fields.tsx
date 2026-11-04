import { SalaryComponentAmountField } from '@/components/employees/salary-component-amount-field';
import { formatAmount } from '@/lib/utils';
import type { SalaryComponent } from '@/types';

export type SalaryComponentAmount = {
    salary_component_id: number;
    amount: string;
};

type SalaryBreakdownFieldsProps = {
    idPrefix: string;
    salaryComponents: Pick<SalaryComponent, 'id' | 'name' | 'type'>[];
    components: SalaryComponentAmount[];
    taxAmount: string;
    securityAmount: string;
    onComponentChange: (index: number, amount: string) => void;
    onTaxChange: (amount: string) => void;
    onSecurityChange: (amount: string) => void;
    errors: Partial<Record<string, string>>;
};

export function buildComponentAmounts(
    salaryComponents: Pick<SalaryComponent, 'id' | 'name' | 'type'>[],
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
    const indexedComponents = salaryComponents.map((salaryComponent, index) => ({
        salaryComponent,
        index,
        amount: components[index]?.amount ?? '',
    }));
    const earnings = indexedComponents.filter(
        ({ salaryComponent }) => salaryComponent.type !== 'deduction',
    );
    const deductions = indexedComponents.filter(
        ({ salaryComponent }) => salaryComponent.type === 'deduction',
    );
    const sumAmounts = (items: typeof indexedComponents) =>
        items.reduce((total, item) => total + (Number(item.amount) || 0), 0);

    const grossSalary = sumAmounts(earnings);
    const totalDeductions =
        sumAmounts(deductions) +
        (Number(taxAmount) || 0) +
        (Number(securityAmount) || 0);
    const netSalary = grossSalary - totalDeductions;

    return (
        <div className="space-y-4 rounded-lg border p-4">
            <div>
                <h3 className="text-sm font-medium">Salary Breakdown</h3>
                <p className="text-muted-foreground text-xs">
                    Monthly amounts. Project allowances are added from project
                    assignments.
                </p>
            </div>

            <div className="space-y-3">
                <h4 className="text-sm font-medium">Earnings</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {earnings.map(({ salaryComponent, index, amount }) => (
                        <SalaryComponentAmountField
                            key={salaryComponent.id}
                            id={`${idPrefix}-component-${salaryComponent.id}`}
                            label={salaryComponent.name}
                            value={amount}
                            error={errors[`components.${index}.amount`]}
                            onChange={(value) => onComponentChange(index, value)}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-sm font-medium">Deductions</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SalaryComponentAmountField
                        id={`${idPrefix}-tax`}
                        label="Monthly Tax"
                        value={taxAmount}
                        error={errors.tax_amount}
                        onChange={onTaxChange}
                    />
                    <SalaryComponentAmountField
                        id={`${idPrefix}-security`}
                        label="Monthly Security Deduction"
                        value={securityAmount}
                        error={errors.security_amount}
                        onChange={onSecurityChange}
                    />
                    {deductions.map(({ salaryComponent, index, amount }) => (
                        <SalaryComponentAmountField
                            key={salaryComponent.id}
                            id={`${idPrefix}-component-${salaryComponent.id}`}
                            label={salaryComponent.name}
                            value={amount}
                            error={errors[`components.${index}.amount`]}
                            onChange={(value) => onComponentChange(index, value)}
                        />
                    ))}
                </div>
            </div>

            {errors.components && (
                <p className="text-destructive text-sm">{errors.components}</p>
            )}

            <div className="bg-muted/50 grid grid-cols-2 gap-2 rounded-md p-3 text-sm">
                <span className="text-muted-foreground">Gross Salary</span>
                <span className="text-right font-mono font-medium">
                    {formatAmount(grossSalary)}
                </span>
                <span className="text-muted-foreground">Total Deductions</span>
                <span className="text-destructive text-right font-mono font-medium">
                    {formatAmount(totalDeductions)}
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
