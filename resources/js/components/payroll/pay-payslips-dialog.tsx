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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toIsoDate } from '@/lib/dates';
import { formatAmount } from '@/lib/utils';
import type { AccountHead, PayrollRun, Payslip } from '@/types';
import { pay } from '@/actions/App/Http/Controllers/PayrollRunController';

type PayPayslipsDialogProps = {
    open: boolean;
    onClose: () => void;
    payrollRun: PayrollRun;
    payslips: Payslip[];
    paymentAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
};

export function PayPayslipsDialog({
    open,
    onClose,
    payrollRun,
    payslips,
    paymentAccounts,
}: PayPayslipsDialogProps) {
    const { data, setData, post, processing, errors } = useForm({
        payslip_ids: payslips.map((payslip) => payslip.id),
        payment_account_id: String(payrollRun.payment_account_id),
        paid_at: toIsoDate(new Date()),
    });

    const total = payslips
        .reduce((sum, payslip) => sum + parseFloat(payslip.net_salary), 0)
        .toFixed(2);
    const isSingle = payslips.length === 1;
    const payslipError = Object.entries(errors).find(([key]) =>
        key.startsWith('payslip_ids'),
    )?.[1];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(pay({ payroll_run: payrollRun.id }).url, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isSingle ? 'Pay Salary' : 'Pay Unpaid Salaries'}
                    </DialogTitle>
                    <DialogDescription>
                        {isSingle
                            ? `Pay the net salary of ${payslips[0].employee?.name ?? 'this employee'}.`
                            : `Pay the net salaries of ${payslips.length} employees in one entry.`}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-muted/50 space-y-2 rounded-md border p-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Payroll Run
                            </span>
                            <span className="font-mono font-medium">
                                {payrollRun.reference}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                {isSingle ? 'Employee' : 'Employees'}
                            </span>
                            <span className="font-medium">
                                {isSingle
                                    ? (payslips[0].employee?.name ?? '--')
                                    : payslips.length}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Net Amount
                            </span>
                            <span className="font-mono font-medium">
                                {formatAmount(total)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pay-payment-account">Pay From</Label>
                        <Select
                            value={data.payment_account_id}
                            onValueChange={(value) =>
                                setData('payment_account_id', value)
                            }
                        >
                            <SelectTrigger id="pay-payment-account">
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
                        <Label htmlFor="pay-paid-at">Payment Date</Label>
                        <DatePicker
                            id="pay-paid-at"
                            value={data.paid_at}
                            onChange={(value) => setData('paid_at', value)}
                        />
                        {errors.paid_at && (
                            <p className="text-destructive text-sm">
                                {errors.paid_at}
                            </p>
                        )}
                    </div>

                    {payslipError && (
                        <p className="text-destructive text-sm">
                            {payslipError}
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Paying...' : 'Pay'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
