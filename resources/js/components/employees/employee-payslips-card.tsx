import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatAmount } from '@/lib/utils';
import type { Payslip } from '@/types';
import { show } from '@/actions/App/Http/Controllers/PayrollRunController';

type EmployeePayslipsCardProps = {
    payslips: Payslip[];
};

export function EmployeePayslipsCard({ payslips }: EmployeePayslipsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Payslips</CardTitle>
                <CardDescription>Last 12 payroll runs.</CardDescription>
            </CardHeader>
            <CardContent>
                {payslips.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                        No payslips yet.
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Run</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Gross
                                </TableHead>
                                <TableHead className="text-right">
                                    Tax
                                </TableHead>
                                <TableHead className="text-right">
                                    Security
                                </TableHead>
                                <TableHead className="text-right">
                                    Net
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payslips.map((payslip) => (
                                <TableRow key={payslip.id}>
                                    <TableCell>
                                        {payslip.payroll_run && (
                                            <Link
                                                href={
                                                    show(payslip.payroll_run.id)
                                                        .url
                                                }
                                                className="font-mono hover:underline"
                                            >
                                                {payslip.payroll_run.reference}
                                            </Link>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {payslip.payroll_run?.period_start} –{' '}
                                        {payslip.payroll_run?.period_end}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {payslip.payroll_run?.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {formatAmount(payslip.gross_salary)}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {formatAmount(payslip.tax_amount)}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {formatAmount(payslip.security_amount)}
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-medium">
                                        {formatAmount(payslip.net_salary)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
