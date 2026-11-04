import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SalaryComponentAmountFieldProps = {
    id: string;
    label: string;
    value: string;
    error?: string;
    onChange: (amount: string) => void;
};

export function SalaryComponentAmountField({
    id,
    label,
    value,
    error,
    onChange,
}: SalaryComponentAmountFieldProps) {
    return (
        <div className="min-w-0 space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
    );
}
