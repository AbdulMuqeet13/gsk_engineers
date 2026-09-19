# TypeScript Types

Located at `resources/js/types/models.ts`, barrel-exported from `resources/js/types/index.ts`.

## Enum Types (string unions)

```typescript
export type AccountType = 'asset' | 'liability' | 'equity' | 'income' | 'expense';
export type NormalBalance = 'debit' | 'credit';
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type EmployeeType = 'internal' | 'project';
export type JournalEntryType = 'standard' | 'simple' | 'payroll' | 'transfer' | 'opening' | 'expense';
export type JournalEntryStatus = 'draft' | 'posted';
export type ExpenseStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave';
export type LeaveType = 'annual' | 'sick' | 'casual' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type PayrollStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
```

## Model Types

### AccountHead
```typescript
export type AccountHead = {
    id: number;
    code: string;
    name: string;
    type: AccountType;
    normal_balance: NormalBalance;
    parent_id: number | null;
    parent?: { id: number; name: string; code: string };
    is_active: boolean;
    children_count?: number;
    created_at: string;
    updated_at: string;
};
```

### Project
```typescript
export type Project = {
    id: number;
    name: string;
    code: string;
    client: string | null;
    status: ProjectStatus;
    start_date: string | null;
    end_date: string | null;
    budget: string | null;
    created_at: string;
    updated_at: string;
};
```

### Employee
```typescript
export type Employee = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    type: EmployeeType;
    project_id: number | null;
    project?: { id: number; name: string; code: string };
    designation: string;
    department: string;
    date_of_joining: string;
    salary: string;
    cnic: string;
    address: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};
```

### ProjectAssignment
```typescript
export type ProjectAssignment = {
    id: number;
    employee_id: number;
    project_id: number;
    employee?: { id: number; name: string; type: EmployeeType };
    project?: { id: number; name: string; code: string };
    role: string;
    allocation_percent: string;
    created_at: string;
    updated_at: string;
};
```

### JournalEntry
```typescript
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
    created_at: string;
    updated_at: string;
};
```

### JournalLine
```typescript
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
```

### Expense
```typescript
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
    account_head?: Pick<AccountHead, 'id' | 'code' | 'name'>;
    payment_account?: Pick<AccountHead, 'id' | 'code' | 'name'>;
    project?: Pick<Project, 'id' | 'name' | 'code'> | null;
    journal_entry?: Pick<JournalEntry, 'id' | 'reference'> | null;
    creator?: { id: number; name: string };
    approver?: { id: number; name: string } | null;
    created_at: string;
    updated_at: string;
};
```

### TrialBalanceRow
```typescript
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
```

### Attendance
```typescript
export type Attendance = {
    id: number;
    employee_id: number;
    date: string;
    status: AttendanceStatus;
    check_in: string | null;
    check_out: string | null;
    notes: string | null;
    marked_by: number;
    employee?: Pick<Employee, 'id' | 'name'>;
    marker?: { id: number; name: string };
    created_at: string;
    updated_at: string;
};
```

### LeaveRequest
```typescript
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
```

### PayrollRun & Payslip
```typescript
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
```

### InterProjectTransfer & InterProjectPosition
```typescript
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
```

### FinancialStatementRow
```typescript
export type FinancialStatementRow = {
    id: number;
    code: string;
    name: string;
    type: AccountType;
    balance: string;
};
```

Used by both Profit & Loss and Balance Sheet pages. Represents an account with its computed balance for a financial statement.

## Note on Decimal Fields

Fields cast as `decimal:2` in PHP come as **strings** in JSON (e.g. `"50000.00"`), not numbers. TypeScript types reflect this with `string` type for `salary`, `budget`, `allocation_percent`, `debit`, `credit`, `amount`, `balance`.
