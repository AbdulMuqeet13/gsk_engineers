import { useForm } from '@inertiajs/react';
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
import { Textarea } from '@/components/ui/textarea';
import type { AccountHead } from '@/types';
import { store } from '@/actions/App/Http/Controllers/PayrollRunController';

type CreatePayrollDialogProps = {
    open: boolean;
    onClose: () => void;
    paymentAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
};

export function CreatePayrollDialog({
    open,
    onClose,
    paymentAccounts,
}: CreatePayrollDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        period_start: '',
        period_end: '',
        payment_account_id: '',
        description: '',
    });

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
                        Create a new payroll run for a pay period.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-period-start">
                                Period Start
                            </Label>
                            <Input
                                id="create-period-start"
                                type="date"
                                value={data.period_start}
                                onChange={(e) =>
                                    setData('period_start', e.target.value)
                                }
                                required
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
                            <Input
                                id="create-period-end"
                                type="date"
                                value={data.period_end}
                                onChange={(e) =>
                                    setData('period_end', e.target.value)
                                }
                                required
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
