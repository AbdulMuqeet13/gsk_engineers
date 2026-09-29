import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatAmount } from '@/lib/utils';
import type { Payslip } from '@/types';

type PayslipBreakdownDialogProps = {
    open: boolean;
    onClose: () => void;
    payslip: Payslip;
};

export function PayslipBreakdownDialog({
    open,
    onClose,
    payslip,
}: PayslipBreakdownDialogProps) {
    const earnings = payslip.items ?? [];
    const deductions = [
        { label: 'Income Tax', amount: payslip.tax_amount },
        { label: 'Security Deposit', amount: payslip.security_amount },
        { label: 'Other Deductions', amount: payslip.deductions },
    ];

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Payslip Breakdown</DialogTitle>
                    <DialogDescription>
                        {payslip.employee?.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 text-sm">
                    <p className="font-medium">Earnings</p>
                    {earnings.length === 0 ? (
                        <div className="flex justify-between">
                            <span>Salary</span>
                            <span className="font-mono">
                                {formatAmount(payslip.salary_amount)}
                            </span>
                        </div>
                    ) : (
                        earnings.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between gap-4"
                            >
                                <span className="min-w-0 truncate">
                                    {item.name}
                                    {item.project && (
                                        <span className="text-muted-foreground">
                                            {' '}
                                            ({item.project.code})
                                        </span>
                                    )}
                                </span>
                                <span className="font-mono">
                                    {formatAmount(item.amount)}
                                </span>
                            </div>
                        ))
                    )}
                    <div className="flex justify-between font-medium">
                        <span>Gross Salary</span>
                        <span className="font-mono">
                            {formatAmount(payslip.gross_salary)}
                        </span>
                    </div>

                    <Separator />

                    <p className="font-medium">Deductions</p>
                    {deductions.map((deduction) => (
                        <div
                            key={deduction.label}
                            className="flex justify-between"
                        >
                            <span>{deduction.label}</span>
                            <span className="text-destructive font-mono">
                                {formatAmount(deduction.amount)}
                            </span>
                        </div>
                    ))}

                    <Separator />

                    <div className="flex justify-between text-base font-semibold">
                        <span>Net Salary</span>
                        <span className="font-mono">
                            {formatAmount(payslip.net_salary)}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
