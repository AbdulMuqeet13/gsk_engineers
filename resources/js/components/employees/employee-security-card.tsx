import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatAmount } from '@/lib/utils';
import type { SecurityRefund } from '@/types';

type EmployeeSecurityCardProps = {
    securityBalance: string;
    refunds: SecurityRefund[];
    canRefund: boolean;
    onRefund: () => void;
};

export function EmployeeSecurityCard({
    securityBalance,
    refunds,
    canRefund,
    onRefund,
}: EmployeeSecurityCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1.5">
                    <CardTitle>Security Deposit</CardTitle>
                    <CardDescription>
                        Held from approved payroll, refundable.
                    </CardDescription>
                </div>
                {canRefund && Number(securityBalance) > 0 && (
                    <Button size="sm" variant="outline" onClick={onRefund}>
                        <Undo2 className="mr-2 size-4" />
                        Refund
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between text-base font-semibold">
                    <span>Balance Held</span>
                    <span className="font-mono">
                        {formatAmount(securityBalance)}
                    </span>
                </div>
                {refunds.length > 0 && (
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Refunds</p>
                        {refunds.map((refund) => (
                            <div
                                key={refund.id}
                                className="flex justify-between gap-2"
                            >
                                <span className="min-w-0 truncate">
                                    {refund.date} ·{' '}
                                    {refund.payment_account?.name}
                                </span>
                                <span className="font-mono">
                                    {formatAmount(refund.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
