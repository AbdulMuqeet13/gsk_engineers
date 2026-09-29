import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatAmount } from '@/lib/utils';

export type AllowanceInput = {
    name: string;
    amount: string;
};

type AllowancesFieldProps = {
    idPrefix: string;
    allowances: AllowanceInput[];
    onChange: (allowances: AllowanceInput[]) => void;
    errors: Partial<Record<string, string>>;
};

export function AllowancesField({
    idPrefix,
    allowances,
    onChange,
    errors,
}: AllowancesFieldProps) {
    const total = allowances.reduce(
        (sum, allowance) => sum + (Number(allowance.amount) || 0),
        0,
    );

    function updateAllowance(index: number, changes: Partial<AllowanceInput>) {
        onChange(
            allowances.map((allowance, i) =>
                i === index ? { ...allowance, ...changes } : allowance,
            ),
        );
    }

    return (
        <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium">Monthly Allowances</h3>
                    <p className="text-muted-foreground text-xs">
                        Added to the employee's payroll and charged to this
                        project.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        onChange([...allowances, { name: '', amount: '' }])
                    }
                >
                    <Plus className="mr-1 size-4" />
                    Add
                </Button>
            </div>

            {allowances.map((allowance, index) => (
                <div key={index} className="flex items-start gap-2">
                    <div className="min-w-0 flex-1 space-y-1">
                        <Label
                            htmlFor={`${idPrefix}-allowance-name-${index}`}
                            className="sr-only"
                        >
                            Allowance name
                        </Label>
                        <Input
                            id={`${idPrefix}-allowance-name-${index}`}
                            value={allowance.name}
                            onChange={(e) =>
                                updateAllowance(index, { name: e.target.value })
                            }
                            placeholder="e.g. Site Allowance"
                        />
                        {errors[`allowances.${index}.name`] && (
                            <p className="text-destructive text-sm">
                                {errors[`allowances.${index}.name`]}
                            </p>
                        )}
                    </div>
                    <div className="w-36 space-y-1">
                        <Label
                            htmlFor={`${idPrefix}-allowance-amount-${index}`}
                            className="sr-only"
                        >
                            Amount
                        </Label>
                        <Input
                            id={`${idPrefix}-allowance-amount-${index}`}
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={allowance.amount}
                            onChange={(e) =>
                                updateAllowance(index, {
                                    amount: e.target.value,
                                })
                            }
                            placeholder="0.00"
                        />
                        {errors[`allowances.${index}.amount`] && (
                            <p className="text-destructive text-sm">
                                {errors[`allowances.${index}.amount`]}
                            </p>
                        )}
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            onChange(allowances.filter((_, i) => i !== index))
                        }
                    >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Remove allowance</span>
                    </Button>
                </div>
            ))}

            {allowances.length > 0 && (
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-mono font-medium">
                        {formatAmount(total)}
                    </span>
                </div>
            )}
        </div>
    );
}
