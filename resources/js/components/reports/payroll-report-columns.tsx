function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export type PayrollReportRun = {
    id: number;
    reference: string;
    period_start: string;
    period_end: string;
    total_amount: string;
    payslips_count: number;
    payslips: PayrollReportSlip[];
};

export type PayrollReportSlip = {
    id: number;
    employee_name: string;
    designation: string;
    department: string;
    salary_amount: string;
    allowances_amount: string;
    gross_salary: string;
    tax_amount: string;
    security_amount: string;
    deductions: string;
    net_salary: string;
    days_worked: number;
    days_absent: number;
};

type RunColumn = {
    key: string;
    header: string;
    className?: string;
    render: (row: PayrollReportRun) => React.ReactNode;
};

export function getRunColumns(): RunColumn[] {
    return [
        {
            key: 'reference',
            header: 'Reference',
            render: (row) => (
                <span className="font-mono text-sm font-medium">
                    {row.reference}
                </span>
            ),
        },
        {
            key: 'period',
            header: 'Period',
            render: (row) => (
                <span className="text-sm">
                    {row.period_start} to {row.period_end}
                </span>
            ),
        },
        {
            key: 'employees',
            header: 'Employees',
            className: 'text-right',
            render: (row) => (
                <span className="text-right text-sm">
                    {row.payslips_count}
                </span>
            ),
        },
        {
            key: 'total',
            header: 'Total Amount',
            className: 'text-right',
            render: (row) => (
                <span className="text-right font-mono text-sm font-medium">
                    {formatAmount(row.total_amount)}
                </span>
            ),
        },
    ];
}

type SlipColumn = {
    key: string;
    header: string;
    className?: string;
    render: (row: PayrollReportSlip) => React.ReactNode;
};

export function getSlipColumns(): SlipColumn[] {
    return [
        {
            key: 'employee',
            header: 'Employee',
            render: (row) => (
                <span className="font-medium">{row.employee_name}</span>
            ),
        },
        {
            key: 'designation',
            header: 'Designation',
            render: (row) => (
                <span className="text-muted-foreground text-sm">
                    {row.designation}
                </span>
            ),
        },
        {
            key: 'days_worked',
            header: 'Days Worked',
            className: 'text-right',
            render: (row) => (
                <span className="text-right text-sm">{row.days_worked}</span>
            ),
        },
        {
            key: 'days_absent',
            header: 'Absent',
            className: 'text-right',
            render: (row) => (
                <span className="text-right text-sm">{row.days_absent}</span>
            ),
        },
        {
            key: 'gross_salary',
            header: 'Gross Salary',
            className: 'text-right',
            render: (row) => (
                <span className="text-right font-mono text-sm">
                    {formatAmount(row.gross_salary)}
                </span>
            ),
        },
        {
            key: 'tax_amount',
            header: 'Tax',
            className: 'text-right',
            render: (row) => (
                <span className="text-right font-mono text-sm text-destructive">
                    {formatAmount(row.tax_amount)}
                </span>
            ),
        },
        {
            key: 'security_amount',
            header: 'Security',
            className: 'text-right',
            render: (row) => (
                <span className="text-right font-mono text-sm text-destructive">
                    {formatAmount(row.security_amount)}
                </span>
            ),
        },
        {
            key: 'deductions',
            header: 'Other Ded.',
            className: 'text-right',
            render: (row) => (
                <span className="text-right font-mono text-sm text-destructive">
                    {formatAmount(row.deductions)}
                </span>
            ),
        },
        {
            key: 'net_salary',
            header: 'Net Salary',
            className: 'text-right',
            render: (row) => (
                <span className="text-right font-mono text-sm font-bold">
                    {formatAmount(row.net_salary)}
                </span>
            ),
        },
    ];
}
