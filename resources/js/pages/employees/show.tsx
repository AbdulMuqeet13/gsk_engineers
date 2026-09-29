import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { AddSalaryRecordDialog } from '@/components/employees/add-salary-record-dialog';
import { DeleteSalaryRecordDialog } from '@/components/employees/delete-salary-record-dialog';
import { EmployeeAssignmentsCard } from '@/components/employees/employee-assignments-card';
import { EmployeeCurrentSalaryCard } from '@/components/employees/employee-current-salary-card';
import { EmployeePayslipsCard } from '@/components/employees/employee-payslips-card';
import { EmployeeSalaryHistoryCard } from '@/components/employees/employee-salary-history-card';
import { EmployeeSecurityCard } from '@/components/employees/employee-security-card';
import { RefundSecurityDialog } from '@/components/employees/refund-security-dialog';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { useCan } from '@/hooks/use-can';
import type {
    AccountHead,
    Employee,
    EmployeeSalary,
    Payslip,
    SalaryChangeType,
    SalaryComponent,
} from '@/types';
import { index } from '@/actions/App/Http/Controllers/EmployeeController';
import { dashboard } from '@/routes';

type EmployeeShowPageProps = {
    employee: Employee;
    securityBalance: string;
    currentSalaryId: number | null;
    payslips: Payslip[];
    salaryComponents?: Pick<SalaryComponent, 'id' | 'name'>[];
    salaryChangeTypes: SalaryChangeType[];
    paymentAccounts?: Pick<AccountHead, 'id' | 'code' | 'name'>[];
};

export default function EmployeeShow({
    employee,
    securityBalance,
    currentSalaryId,
    payslips,
    salaryComponents = [],
    salaryChangeTypes,
    paymentAccounts = [],
}: EmployeeShowPageProps) {
    const { can } = useCan();
    const canUpdate = can('employees.update');
    const canRefund = can('payroll.approve');

    const [isAddingSalary, setIsAddingSalary] = useState(false);
    const [deletingSalary, setDeletingSalary] = useState<EmployeeSalary | null>(
        null,
    );
    const [isRefunding, setIsRefunding] = useState(false);

    const salaries = employee.salaries ?? [];
    const currentIndex = salaries.findIndex(
        (salary) => salary.id === currentSalaryId,
    );
    const currentSalary = currentIndex >= 0 ? salaries[currentIndex] : null;
    const upcomingSalary = currentIndex > 0 ? salaries[currentIndex - 1] : null;
    const assignments = employee.assignments ?? [];

    return (
        <>
            <Head title={employee.name} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <Heading
                        title={employee.name}
                        description={`${employee.designation} · ${employee.department} · Joined ${employee.date_of_joining}`}
                    />
                    <Badge
                        variant={employee.is_active ? 'default' : 'secondary'}
                    >
                        {employee.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    {employee.project && (
                        <Badge variant="outline">
                            {employee.project.code} - {employee.project.name}
                        </Badge>
                    )}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <EmployeeCurrentSalaryCard
                        salary={currentSalary}
                        upcomingSalary={upcomingSalary}
                        assignments={assignments}
                    />
                    <EmployeeAssignmentsCard assignments={assignments} />
                    <EmployeeSecurityCard
                        securityBalance={securityBalance}
                        refunds={employee.security_refunds ?? []}
                        canRefund={canRefund}
                        onRefund={() => setIsRefunding(true)}
                    />
                </div>

                <EmployeeSalaryHistoryCard
                    salaries={salaries}
                    upcomingCount={Math.max(currentIndex, 0)}
                    canUpdate={canUpdate}
                    onAdd={() => setIsAddingSalary(true)}
                    onDelete={setDeletingSalary}
                />

                <EmployeePayslipsCard payslips={payslips} />
            </div>

            {isAddingSalary && (
                <AddSalaryRecordDialog
                    open={isAddingSalary}
                    onClose={() => setIsAddingSalary(false)}
                    employee={employee}
                    currentSalary={salaries[0] ?? null}
                    salaryComponents={salaryComponents}
                    salaryChangeTypes={salaryChangeTypes}
                />
            )}

            {deletingSalary && (
                <DeleteSalaryRecordDialog
                    open={!!deletingSalary}
                    onClose={() => setDeletingSalary(null)}
                    salary={deletingSalary}
                />
            )}

            {isRefunding && (
                <RefundSecurityDialog
                    open={isRefunding}
                    onClose={() => setIsRefunding(false)}
                    employee={employee}
                    securityBalance={securityBalance}
                    paymentAccounts={paymentAccounts}
                />
            )}
        </>
    );
}

EmployeeShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Employees', href: index().url },
    ],
};
