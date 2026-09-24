export type AccountType = 'asset' | 'liability' | 'equity' | 'income' | 'expense';
export type NormalBalance = 'debit' | 'credit';
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type EmployeeType = 'internal' | 'project';

export type AccountHead = {
    id: number;
    code: string;
    name: string;
    type: AccountType;
    normal_balance: NormalBalance;
    parent_id: number | null;
    parent?: Pick<AccountHead, 'id' | 'name' | 'code'> | null;
    is_active: boolean;
    children_count?: number;
    created_at: string;
    updated_at: string;
};

export type Project = {
    id: number;
    name: string;
    code: string;
    client: string | null;
    status: ProjectStatus;
    start_date: string | null;
    end_date: string | null;
    budget: string | null;
    attachments?: Attachment[];
    created_at: string;
    updated_at: string;
};

export type Employee = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    type: EmployeeType;
    project_id: number | null;
    project?: Pick<Project, 'id' | 'name' | 'code'> | null;
    designation: string;
    department: string;
    date_of_joining: string;
    salary: string;
    cnic: string;
    address: string;
    is_active: boolean;
    attachments?: Attachment[];
    fingerprints?: EmployeeFingerprint[];
    created_at: string;
    updated_at: string;
};

export type ProjectAssignment = {
    id: number;
    employee_id: number;
    project_id: number;
    employee?: Pick<Employee, 'id' | 'name' | 'type'>;
    project?: Pick<Project, 'id' | 'name' | 'code'>;
    role: string;
    allocation_percent: string;
    created_at: string;
    updated_at: string;
};

export type JournalEntryType = 'standard' | 'simple' | 'payroll' | 'transfer' | 'opening' | 'expense';
export type JournalEntryStatus = 'draft' | 'posted';

export type JournalEntry = {
    id: number;
    date: string;
    reference: string;
    description: string;
    type: JournalEntryType;
    status: JournalEntryStatus;
    created_by: number;
    reversed_by_id: number | null;
    reversal_of_id: number | null;
    creator?: { id: number; name: string };
    lines?: JournalLine[];
    lines_count?: number;
    reversed_by?: { id: number; reference: string } | null;
    reversal_of?: { id: number; reference: string } | null;
    attachments?: Attachment[];
    created_at: string;
    updated_at: string;
};

export type JournalLine = {
    id: number;
    journal_entry_id: number;
    account_head_id: number;
    project_id: number | null;
    debit: string;
    credit: string;
    memo: string | null;
    account_head?: Pick<AccountHead, 'id' | 'code' | 'name' | 'type' | 'normal_balance'>;
    project?: Pick<Project, 'id' | 'name' | 'code'> | null;
    journal_entry?: { id: number; date: string; reference: string; description: string };
    running_balance?: string;
    created_at: string;
    updated_at: string;
};

export type ExpenseStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export type Expense = {
    id: number;
    reference: string;
    date: string;
    description: string;
    amount: string;
    status: ExpenseStatus;
    account_head_id: number;
    payment_account_id: number;
    project_id: number | null;
    journal_entry_id: number | null;
    created_by: number;
    approved_by: number | null;
    approved_at: string | null;
    rejection_reason: string | null;
    notes: string | null;
    cheque_number: string | null;
    account_head?: Pick<AccountHead, 'id' | 'code' | 'name'>;
    payment_account?: Pick<AccountHead, 'id' | 'code' | 'name'>;
    project?: Pick<Project, 'id' | 'name' | 'code'> | null;
    journal_entry?: Pick<JournalEntry, 'id' | 'reference'> | null;
    creator?: { id: number; name: string };
    approver?: { id: number; name: string } | null;
    attachments?: Attachment[];
    created_at: string;
    updated_at: string;
};

export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave';
export type AttendanceSource = 'manual' | 'biometric';

export type Attendance = {
    id: number;
    employee_id: number;
    date: string;
    status: AttendanceStatus;
    check_in: string | null;
    check_out: string | null;
    notes: string | null;
    source: AttendanceSource;
    marked_by: number | null;
    employee?: Pick<Employee, 'id' | 'name'>;
    marker?: { id: number; name: string } | null;
    created_at: string;
    updated_at: string;
};

export type LeaveType = 'annual' | 'sick' | 'casual' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type LeaveRequest = {
    id: number;
    employee_id: number;
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    days: number;
    reason: string;
    status: LeaveStatus;
    approved_by: number | null;
    approved_at: string | null;
    rejection_reason: string | null;
    created_by: number;
    employee?: Pick<Employee, 'id' | 'name'>;
    creator?: { id: number; name: string };
    approver?: { id: number; name: string } | null;
    created_at: string;
    updated_at: string;
};

export type PayrollStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export type PayrollRun = {
    id: number;
    reference: string;
    period_start: string;
    period_end: string;
    description: string | null;
    total_amount: string;
    status: PayrollStatus;
    payment_account_id: number;
    journal_entry_id: number | null;
    created_by: number;
    approved_by: number | null;
    approved_at: string | null;
    rejection_reason: string | null;
    payslips?: Payslip[];
    payslips_count?: number;
    payment_account?: Pick<AccountHead, 'id' | 'code' | 'name'>;
    journal_entry?: Pick<JournalEntry, 'id' | 'reference'> | null;
    creator?: { id: number; name: string };
    approver?: { id: number; name: string } | null;
    created_at: string;
    updated_at: string;
};

export type Payslip = {
    id: number;
    payroll_run_id: number;
    employee_id: number;
    basic_salary: string;
    deductions: string;
    net_salary: string;
    days_worked: number;
    days_absent: number;
    notes: string | null;
    employee?: Pick<Employee, 'id' | 'name'> & { designation?: string; department?: string };
    created_at: string;
    updated_at: string;
};

export type InterProjectTransfer = {
    id: number;
    reference: string;
    from_project_id: number;
    to_project_id: number;
    from_account_id: number;
    to_account_id: number;
    amount: string;
    date: string;
    purpose: string;
    cheque_number: string | null;
    journal_entry_id: number | null;
    created_by: number;
    from_project?: Pick<Project, 'id' | 'name' | 'code'>;
    to_project?: Pick<Project, 'id' | 'name' | 'code'>;
    from_account?: Pick<AccountHead, 'id' | 'code' | 'name'>;
    to_account?: Pick<AccountHead, 'id' | 'code' | 'name'>;
    journal_entry?: Pick<JournalEntry, 'id' | 'reference'> & { reversed_by_id?: number | null } | null;
    creator?: { id: number; name: string };
    created_at: string;
    updated_at: string;
};

export type InterProjectPosition = {
    project_a: Pick<Project, 'id' | 'name' | 'code'>;
    project_b: Pick<Project, 'id' | 'name' | 'code'>;
    a_to_b: string;
    b_to_a: string;
    net: string;
};

export type TrialBalanceRow = {
    id: number;
    code: string;
    name: string;
    type: AccountType;
    normal_balance: NormalBalance;
    total_debit: string;
    total_credit: string;
    balance: string;
};

export type FinancialStatementRow = {
    id: number;
    code: string;
    name: string;
    type: AccountType;
    balance: string;
};

export type DashboardKpis = {
    totalIncome: string;
    totalExpenses: string;
    netProfit: string;
    cashBalance: string;
    activeProjects: number;
    pendingPayroll: number;
    pendingExpenses: number;
};

export type MonthlyTrend = {
    month: string;
    income: string;
    expenses: string;
};

export type CategoryBreakdown = {
    name: string;
    value: string;
};

export type ProjectBreakdown = {
    name: string;
    code: string;
    income: string;
    expenses: string;
};

export type Attachment = {
    id: number;
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    uploaded_by: number;
    created_at: string;
};

export type CashbookRow = {
    id: number;
    date: string;
    reference: string;
    description: string;
    account: Pick<AccountHead, 'id' | 'code' | 'name'>;
    money_in: string;
    money_out: string;
    balance: string;
};

export type CashbookSummary = {
    openingBalance: string;
    totalIn: string;
    totalOut: string;
    closingBalance: string;
};

export type ProjectLedgerRow = {
    id: number;
    date: string;
    reference: string;
    description: string;
    account: Pick<AccountHead, 'id' | 'code' | 'name' | 'type'>;
    debit: string;
    credit: string;
    balance: string | null;
};

export type BiometricDevice = {
    id: number;
    name: string;
    serial_number: string;
    model: string | null;
    location: string | null;
    last_heartbeat_at: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type EmployeeFingerprint = {
    id: number;
    employee_id: number;
    device_user_id: string;
    enrolled_at: string | null;
    created_at: string;
    updated_at: string;
};

export type DeviceCommandStatus = 'pending' | 'sent' | 'acknowledged';

export type DeviceCommand = {
    id: number;
    biometric_device_id: number;
    sequence: number;
    command: string;
    status: DeviceCommandStatus;
    sent_at: string | null;
    acknowledged_at: string | null;
    created_at: string;
    updated_at: string;
};
