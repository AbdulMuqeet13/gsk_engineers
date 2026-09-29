import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { cn, formatAmount } from '@/lib/utils';
import type { EmployeeSalary } from '@/types';

type EmployeeSalaryHistoryCardProps = {
    salaries: EmployeeSalary[];
    upcomingCount: number;
    canUpdate: boolean;
    onAdd: () => void;
    onDelete: (salary: EmployeeSalary) => void;
};

export function EmployeeSalaryHistoryCard({
    salaries,
    upcomingCount,
    canUpdate,
    onAdd,
    onDelete,
}: EmployeeSalaryHistoryCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1.5">
                    <CardTitle>Salary &amp; Employment History</CardTitle>
                    <CardDescription>
                        Every salary change, newest first.
                    </CardDescription>
                </div>
                {canUpdate && (
                    <Button size="sm" onClick={onAdd}>
                        <Plus className="mr-2 size-4" />
                        Add Increment / Revision
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Effective</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Gross</TableHead>
                            <TableHead className="text-right">Change</TableHead>
                            <TableHead className="text-right">Tax</TableHead>
                            <TableHead className="text-right">
                                Security
                            </TableHead>
                            <TableHead>Remarks</TableHead>
                            {canUpdate && (
                                <TableHead className="sr-only">
                                    Actions
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {salaries.map((salary, index) => {
                            const previous = salaries[index + 1];
                            const change = previous
                                ? Number(salary.gross_salary) -
                                  Number(previous.gross_salary)
                                : null;
                            const changePercent =
                                previous && Number(previous.gross_salary) > 0
                                    ? (change! /
                                          Number(previous.gross_salary)) *
                                      100
                                    : null;

                            return (
                                <TableRow key={salary.id}>
                                    <TableCell>
                                        {salary.effective_date}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Badge variant="outline">
                                                {salary.change_type
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    salary.change_type.slice(1)}
                                            </Badge>
                                            {index < upcomingCount && (
                                                <Badge variant="info-soft">
                                                    Upcoming
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {formatAmount(salary.gross_salary)}
                                    </TableCell>
                                    <TableCell
                                        className={cn(
                                            'text-right font-mono',
                                            change !== null &&
                                                change > 0 &&
                                                'text-green-600',
                                            change !== null &&
                                                change < 0 &&
                                                'text-destructive',
                                        )}
                                    >
                                        {change === null
                                            ? '—'
                                            : `${change >= 0 ? '+' : ''}${formatAmount(change)}${
                                                  changePercent !== null
                                                      ? ` (${changePercent.toFixed(1)}%)`
                                                      : ''
                                              }`}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {formatAmount(salary.tax_amount)}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {formatAmount(salary.security_amount)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                                        {salary.remarks ?? '—'}
                                    </TableCell>
                                    {canUpdate && (
                                        <TableCell>
                                            {salaries.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8"
                                                    onClick={() =>
                                                        onDelete(salary)
                                                    }
                                                >
                                                    <Trash2 className="size-4" />
                                                    <span className="sr-only">
                                                        Delete salary record
                                                    </span>
                                                </Button>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
