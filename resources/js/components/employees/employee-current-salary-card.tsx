import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatAmount } from '@/lib/utils';
import type { EmployeeSalary, ProjectAssignment } from '@/types';

type EmployeeCurrentSalaryCardProps = {
    salary: EmployeeSalary | null;
    upcomingSalary: EmployeeSalary | null;
    assignments: ProjectAssignment[];
};

export function EmployeeCurrentSalaryCard({
    salary,
    upcomingSalary,
    assignments,
}: EmployeeCurrentSalaryCardProps) {
    const allowancesTotal = assignments
        .flatMap((assignment) => assignment.allowances ?? [])
        .reduce((total, allowance) => total + Number(allowance.amount), 0);

    if (!salary) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Current Salary</CardTitle>
                    <CardDescription>
                        {upcomingSalary
                            ? `Salary of ${formatAmount(upcomingSalary.gross_salary)} starts ${upcomingSalary.effective_date}.`
                            : 'No salary recorded yet.'}
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const grossWithAllowances = Number(salary.gross_salary) + allowancesTotal;
    const netSalary =
        grossWithAllowances -
        Number(salary.tax_amount) -
        Number(salary.security_amount);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Salary</CardTitle>
                <CardDescription>
                    Effective {salary.effective_date}
                    {upcomingSalary &&
                        ` · changes to ${formatAmount(upcomingSalary.gross_salary)} on ${upcomingSalary.effective_date}`}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                {(salary.components ?? []).map((component) => (
                    <div key={component.id} className="flex justify-between">
                        <span>{component.salary_component?.name}</span>
                        <span className="font-mono">
                            {formatAmount(component.amount)}
                        </span>
                    </div>
                ))}
                <div className="flex justify-between">
                    <span>Project Allowances</span>
                    <span className="font-mono">
                        {formatAmount(allowancesTotal)}
                    </span>
                </div>
                <div className="flex justify-between font-medium">
                    <span>Gross</span>
                    <span className="font-mono">
                        {formatAmount(grossWithAllowances)}
                    </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="text-destructive font-mono">
                        {formatAmount(salary.tax_amount)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Security</span>
                    <span className="text-destructive font-mono">
                        {formatAmount(salary.security_amount)}
                    </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                    <span>Net Salary</span>
                    <span className="font-mono">{formatAmount(netSalary)}</span>
                </div>
            </CardContent>
        </Card>
    );
}
