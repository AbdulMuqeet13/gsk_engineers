# Page Inventory

All pages use `AppLayout`, `Head` for title, and dialog-first CRUD.

## Current Pages

### Chart of Accounts
**Path:** `pages/accounting/chart-of-accounts/index.tsx`
**Route:** `/accounting/chart-of-accounts`

| Prop | Type | Source |
|------|------|--------|
| accountHeads | PaginatedData\<AccountHead\> | Query with search + type filter |
| accountTypes | string[] | AccountType::values() |
| normalBalances | string[] | NormalBalance::values() |
| parentAccounts | AccountHead[] | Inertia::optional, all active accounts |

**Features:** Search by code/name, filter by type, create/edit/delete dialogs

### Projects
**Path:** `pages/projects/index.tsx`
**Route:** `/projects`

| Prop | Type | Source |
|------|------|--------|
| projects | PaginatedData\<Project\> | Query with search + status filter |
| statuses | string[] | ProjectStatus::values() |

**Features:** Search by name/code/client, filter by status, create/edit/delete dialogs

### Employees
**Path:** `pages/employees/index.tsx`
**Route:** `/employees`

| Prop | Type | Source |
|------|------|--------|
| employees | PaginatedData\<Employee\> | Query with search + type/project filters |
| employeeTypes | string[] | EmployeeType::values() |
| projects | Project[] | Inertia::optional, for select dropdown |

**Features:** Search by name/email, filter by type and project, create/edit/delete dialogs

### Project Assignments
**Path:** `pages/projects/assignments/index.tsx`
**Route:** `/projects/assignments`

| Prop | Type | Source |
|------|------|--------|
| assignments | PaginatedData\<ProjectAssignment\> | Query with project/employee filters |
| employees | Employee[] | Inertia::optional, internal employees only |
| projects | Project[] | Inertia::optional |

**Features:** Filter by project and employee, create/edit/delete dialogs

### Journal Entries
**Path:** `pages/accounting/journal-entries/index.tsx`
**Route:** `/accounting/journal-entries`

| Prop | Type | Source |
|------|------|--------|
| journalEntries | PaginatedData\<JournalEntry\> | Query with search + status/type/date filters |
| entryTypes | string[] | JournalEntryType::values() |
| entryStatuses | string[] | JournalEntryStatus::values() |
| accountHeads | AccountHead[] | Inertia::optional, active accounts |
| projects | Project[] | Inertia::optional |

**Features:** Search by reference/description, filter by status/type/date range, create/edit/delete/post/reverse dialogs, dynamic journal line management

### General Ledger
**Path:** `pages/accounting/general-ledger/index.tsx`
**Route:** `/accounting/general-ledger`

| Prop | Type | Source |
|------|------|--------|
| lines | JournalLine[] | Posted lines for selected account with running_balance |
| accountHeads | AccountHead[] | All active accounts for selection |
| projects | Project[] | Inertia::optional |

**Features:** Account selector, date range and project filters, running balance calculation per normal balance direction

### Trial Balance
**Path:** `pages/accounting/trial-balance/index.tsx`
**Route:** `/accounting/trial-balance`

| Prop | Type | Source |
|------|------|--------|
| rows | TrialBalanceRow[] | Account balances from posted entries |
| totals | object | { total_debit, total_credit, balance } |
| is_balanced | boolean | Whether debits equal credits |
| projects | Project[] | Inertia::optional |

**Features:** Date range and project filters, debit/credit columns, balance verification

### Expenses
**Path:** `pages/expenses/index.tsx`
**Route:** `/expenses`

| Prop | Type | Source |
|------|------|--------|
| expenses | PaginatedData\<Expense\> | Query with search + status/project/account/date filters |
| expenseStatuses | string[] | ExpenseStatus::values() |
| expenseAccounts | AccountHead[] | Inertia::optional, expense-type accounts |
| paymentAccounts | AccountHead[] | Inertia::optional, asset-type accounts (Cash, Bank) |
| projects | Project[] | Inertia::optional |

**Features:** Search by reference/description, filter by status/project/category/date range, create/edit/delete/submit/approve/reject dialogs, approval workflow badges

### Attendance
**Path:** `pages/attendance/index.tsx`
**Route:** `/attendance`

| Prop | Type | Source |
|------|------|--------|
| attendance | PaginatedData\<Attendance\> | Query with search + status/date filters |
| employees | Employee[] | Inertia::optional |

**Features:** Search by employee name, filter by status and date range, create/edit/delete dialogs

### Leave
**Path:** `pages/leave/index.tsx`
**Route:** `/leave`

| Prop | Type | Source |
|------|------|--------|
| leaveRequests | PaginatedData\<LeaveRequest\> | Query with search + status/type filters |
| leaveTypes | string[] | LeaveType::values() |
| leaveStatuses | string[] | LeaveStatus::values() |
| employees | Employee[] | Inertia::optional |

**Features:** Search by employee name, filter by status and leave type, create/approve/reject/delete dialogs

### Payroll
**Path:** `pages/payroll/index.tsx`
**Route:** `/payroll`

| Prop | Type | Source |
|------|------|--------|
| payrollRuns | PaginatedData\<PayrollRun\> | Query with search + status/date filters |
| payrollStatuses | string[] | PayrollStatus::values() |
| paymentAccounts | AccountHead[] | Inertia::optional, asset-type accounts |

**Features:** Search by reference, filter by status and date range, create/delete/submit/approve/reject dialogs

### Payroll Show
**Path:** `pages/payroll/show.tsx`
**Route:** `/payroll/{payroll_run}`

| Prop | Type | Source |
|------|------|--------|
| payrollRun | PayrollRun | With payslips and employees |
| payrollStatuses | string[] | PayrollStatus::values() |

**Features:** Payslip list with inline editing (deductions, notes), submit/approve/reject actions

### Transfers
**Path:** `pages/transfers/index.tsx`
**Route:** `/transfers`

| Prop | Type | Source |
|------|------|--------|
| transfers | PaginatedData\<InterProjectTransfer\> | Query with search + project/date filters |
| projects | Project[] | Inertia::optional |
| accounts | AccountHead[] | Inertia::optional, asset-type |

**Features:** Search by reference/purpose, filter by from/to project and date range, create/reverse dialogs, Posted/Reversed status badges

### Inter-Project Position Report
**Path:** `pages/reports/inter-project-position.tsx`
**Route:** `/reports/inter-project-position`

| Prop | Type | Source |
|------|------|--------|
| positions | InterProjectPosition[] | Computed from non-reversed transfers |
| projects | Project[] | For filter dropdown |

**Features:** Project filter, net balance with green/red coloring

### Profit & Loss
**Path:** `pages/reports/profit-and-loss.tsx`
**Route:** `/reports/profit-and-loss`

| Prop | Type | Source |
|------|------|--------|
| incomeAccounts | FinancialStatementRow[] | Income accounts with balances |
| expenseAccounts | FinancialStatementRow[] | Expense accounts with balances |
| totalIncome | string | Sum of income balances |
| totalExpenses | string | Sum of expense balances |
| netProfit | string | totalIncome - totalExpenses |
| projects | Project[] | Inertia::optional |

**Features:** Date range and project filters, income/expense sections with subtotals, Net Profit/Loss with green/red coloring

### Balance Sheet
**Path:** `pages/reports/balance-sheet.tsx`
**Route:** `/reports/balance-sheet`

| Prop | Type | Source |
|------|------|--------|
| assetAccounts | FinancialStatementRow[] | Asset accounts with balances |
| liabilityAccounts | FinancialStatementRow[] | Liability accounts with balances |
| equityAccounts | FinancialStatementRow[] | Equity accounts (includes retained earnings with net profit) |
| totalAssets | string | Sum of asset balances |
| totalLiabilities | string | Sum of liability balances |
| totalEquity | string | Sum of equity balances (includes net profit) |
| isBalanced | boolean | Whether assets = liabilities + equity |
| netProfit | string | Income - expenses rolled into retained earnings |
| projects | Project[] | Inertia::optional |

**Features:** As-at date and project filters, asset/liability/equity sections with subtotals, balanced/unbalanced indicator

### Income & Expense Summary
**Path:** `pages/reports/income-expense-summary.tsx`
**Route:** `/reports/income-expense-summary`

| Prop | Type | Source |
|------|------|--------|
| rows | object[] | By category: {code, name, type, balance}; By project: {project_code, project_name, total_income, total_expenses, net} |
| totals | object | { totalIncome, totalExpenses, netProfit } |
| projects | Project[] | Inertia::optional |

**Features:** Date range and project filters, group-by toggle (Category/Project), two table layouts, net profit coloring (green/red), PDF/Excel export

### Payroll Report
**Path:** `pages/reports/payroll-report.tsx`
**Route:** `/reports/payroll`

| Prop | Type | Source |
|------|------|--------|
| runs | PayrollRun[] | Approved runs with payslips and employee details |
| summary | object | { totalRuns, totalEmployees, totalDisbursed } |

**Features:** Period date filters, 3 summary cards, expandable rows with payslip detail tables, PDF/Excel export

### Project Cashbook
**Path:** `pages/reports/project-cashbook.tsx`
**Route:** `/reports/project-cashbook`

| Prop | Type | Source |
|------|------|--------|
| rows | CashbookRow[] | Cash transactions for selected project |
| summary | CashbookSummary | { openingBalance, totalIn, totalOut, closingBalance } |
| cashAccounts | AccountHead[] | Cash/bank accounts (codes 1001, 1002, 1003) |
| projects | Project[] | For project selector |

**Features:** Project selector (required), date range and account filters, 4 summary cards, running balance, PDF/Excel export

### Project Ledger
**Path:** `pages/reports/project-ledger.tsx`
**Route:** `/reports/project-ledger`

| Prop | Type | Source |
|------|------|--------|
| rows | ProjectLedgerRow[] | All posted transactions for selected project |
| totals | object | { totalDebit, totalCredit } |
| accountHeads | AccountHead[] | Active accounts for filter |
| projects | Project[] | For project selector |

**Features:** Project selector (required), date range and account filters, running balance (single account only), PDF/Excel export
