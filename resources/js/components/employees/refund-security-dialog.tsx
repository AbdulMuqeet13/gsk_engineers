import { useForm } from '@inertiajs/react';
import { DatePicker } from '@/components/date-picker';
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
import { formatAmount } from '@/lib/utils';
import type { AccountHead, Employee } from '@/types';
import { store } from '@/actions/App/Http/Controllers/SecurityRefundController';

type RefundSecurityDialogProps = {
    open: boolean;
    onClose: () => void;
    employee: Employee;
    securityBalance: string;
    paymentAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
};

export function RefundSecurityDialog({
    open,
    onClose,
    employee,
    securityBalance,
    paymentAccounts,
}: RefundSecurityDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: securityBalance,
        date: '',
        payment_account_id: '',
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Refund Security Deposit</DialogTitle>
                    <DialogDescription>
                        {employee.name} has{' '}
                        <strong>{formatAmount(securityBalance)}</strong> held as
                        security. A journal entry will be posted immediately.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="refund-amount">Amount</Label>
                            <Input
                                id="refund-amount"
                                type="number"
                                min="0.01"
                                max={securityBalance}
                                step="0.01"
                                value={data.amount}
                                onChange={(e) =>
                                    setData('amount', e.target.value)
                                }
                                required
                            />
                            {errors.amount && (
                                <p className="text-destructive text-sm">
                                    {errors.amount}
                                </p>
                            )}
                        </div>
                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="refund-date">Date</Label>
                            <DatePicker
                                id="refund-date"
                                value={data.date}
                                onChange={(value) =>
                                    setData('date', value)
                                }
                            />
                            {errors.date && (
                                <p className="text-destructive text-sm">
                                    {errors.date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="refund-account">Pay From</Label>
                        <Select
                            value={data.payment_account_id}
                            onValueChange={(value) =>
                                setData('payment_account_id', value)
                            }
                        >
                            <SelectTrigger
                                id="refund-account"
                                className="w-full min-w-0"
                            >
                                <SelectValue placeholder="Cash or Bank" />
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
                        <Label htmlFor="refund-remarks">Remarks</Label>
                        <Textarea
                            id="refund-remarks"
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                            placeholder="e.g. Final settlement"
                            rows={2}
                        />
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
                            {processing ? 'Refunding...' : 'Refund'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
