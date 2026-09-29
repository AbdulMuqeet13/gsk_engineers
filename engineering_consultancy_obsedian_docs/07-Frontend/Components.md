# Component Inventory

## Shared Components

| Component | Path | Purpose |
|-----------|------|---------|
| DataTable | `components/data-table/data-table.tsx` | Reusable table with TanStack v9 |
| AppSidebar | `components/app-sidebar.tsx` | Main navigation sidebar |
| useDataTable | `hooks/use-data-table.ts` | Partial reloading, search, filters (cleared filters sent as `undefined` so they leave the URL) |
| DatePicker | `components/date-picker.tsx` | shadcn Calendar in a Popover; shows dd-mm-yyyy, emits ISO `YYYY-MM-DD`; props `value`, `onChange`, `clearable`, `size`, `placeholder` |

## Module Components

### Account Heads (`components/account-heads/`)
| File | Purpose |
|------|---------|
| `account-head-columns.tsx` | Column definitions with type badge, parent display, action buttons |
| `create-account-head-dialog.tsx` | Create dialog with auto normal_balance based on type |
| `edit-account-head-dialog.tsx` | Edit dialog, pre-populated |
| `delete-account-head-dialog.tsx` | Soft delete confirmation |

### Projects (`components/projects/`)
| File | Purpose |
|------|---------|
| `project-columns.tsx` | Column definitions with status badge, budget formatting |
| `create-project-dialog.tsx` | Create dialog with date pickers |
| `edit-project-dialog.tsx` | Edit dialog, pre-populated |
| `delete-project-dialog.tsx` | Soft delete confirmation |

### Employees (`components/employees/`)
| File | Purpose |
|------|---------|
| `employee-columns.tsx` | Column definitions with type badge, project display |
| `create-employee-dialog.tsx` | Create dialog with conditional project_id field |
| `edit-employee-dialog.tsx` | Edit dialog, pre-populated |
| `delete-employee-dialog.tsx` | Soft delete confirmation |

### Project Assignments (`components/project-assignments/`)
| File | Purpose |
|------|---------|
| `assignment-columns.tsx` | Column definitions with employee/project display |
| `create-assignment-dialog.tsx` | Create dialog with employee + project selects |
| `edit-assignment-dialog.tsx` | Edit dialog, pre-populated |
| `delete-assignment-dialog.tsx` | Hard delete confirmation |

### Journal Entries (`components/journal-entries/`)
| File | Purpose |
|------|---------|
| `journal-entry-columns.tsx` | Column definitions with type/status badges, line count, action dropdown |
| `journal-line-form-rows.tsx` | Dynamic line rows for debit/credit entry with account select |
| `create-journal-entry-dialog.tsx` | Create dialog with dynamic line management |
| `edit-journal-entry-dialog.tsx` | Edit dialog for draft entries, pre-populated |
| `post-journal-entry-dialog.tsx` | Confirmation dialog for posting (makes entry immutable) |
| `reverse-journal-entry-dialog.tsx` | Reversal dialog with optional reason |
| `delete-journal-entry-dialog.tsx` | Delete confirmation for draft entries |

### Expenses (`components/expenses/`)
| File | Purpose |
|------|---------|
| `expense-columns.tsx` | Column definitions with status badge (gray/blue/green/red), amount formatting, action dropdown |
| `create-expense-dialog.tsx` | Form: date, description, amount, category (expense accounts), payment method (cash/bank), project, notes |
| `edit-expense-dialog.tsx` | Same form, pre-populated, drafts only |
| `submit-expense-dialog.tsx` | Confirmation: "Submit for approval?" |
| `approve-expense-dialog.tsx` | Summary + confirmation: "This will create a journal entry..." |
| `reject-expense-dialog.tsx` | Required reason textarea |
| `delete-expense-dialog.tsx` | Confirmation, drafts only |

### Attendance (`components/attendance/`)
| File | Purpose |
|------|---------|
| `attendance-columns.tsx` | Column definitions with status badge, employee display |
| `create-attendance-dialog.tsx` | Create dialog with employee select, date, status, check-in/out |
| `edit-attendance-dialog.tsx` | Edit dialog, pre-populated |
| `delete-attendance-dialog.tsx` | Delete confirmation |

### Leave (`components/leave/`)
| File | Purpose |
|------|---------|
| `leave-columns.tsx` | Column definitions with type/status badges, date range, days count |
| `create-leave-dialog.tsx` | Create dialog with employee select, type, date range, reason |
| `approve-leave-dialog.tsx` | Approval confirmation |
| `reject-leave-dialog.tsx` | Rejection dialog with required reason |
| `delete-leave-dialog.tsx` | Delete confirmation for pending requests |

### Payroll (`components/payroll/`)
| File | Purpose |
|------|---------|
| `payroll-columns.tsx` | Column definitions with status badge, period display, total amount |
| `create-payroll-dialog.tsx` | Create dialog with period, description, payment account |
| `submit-payroll-dialog.tsx` | Submit confirmation |
| `approve-payroll-dialog.tsx` | Approval confirmation with JE creation notice |
| `reject-payroll-dialog.tsx` | Rejection dialog with required reason |
| `delete-payroll-dialog.tsx` | Delete confirmation for draft runs |

### Transfers (`components/transfers/`)
| File | Purpose |
|------|---------|
| `transfer-columns.tsx` | Column definitions with project badges, amount, status (Posted/Reversed) |
| `create-transfer-dialog.tsx` | From/to project and account selects, amount, date, purpose |
| `reverse-transfer-dialog.tsx` | Reversal confirmation with optional reason |

### Reports (`components/reports/`)
| File | Purpose |
|------|---------|
| `position-columns.tsx` | Inter-project position columns with net balance coloring |
| `profit-and-loss-columns.tsx` | P&L columns: code, account name, amount |
| `balance-sheet-columns.tsx` | Balance sheet columns: code, account name, balance |
| `income-expense-summary-columns.tsx` | By-category and by-project column definitions |
| `payroll-report-columns.tsx` | Payroll run columns with expandable payslip detail |
| `project-cashbook-columns.tsx` | Cashbook columns: date, ref, account, money in/out, balance |
| `project-ledger-columns.tsx` | Ledger columns: date, ref, account, type, debit, credit, balance |

### Trial Balance (`components/trial-balance/`)
| File | Purpose |
|------|---------|
| `trial-balance-columns.tsx` | Column definitions with type badge, debit/credit/balance |

### Attachments (`components/attachments/`)
| File | Purpose |
|------|---------|
| `attachment-list.tsx` | File upload UI, attachment list with download/delete, supports all attachable types |

## shadcn/ui Primitives (`components/ui/`)

Installed via shadcn CLI (New York style). Includes: Button, Dialog, Input, Select, Label, Table, Badge, DropdownMenu, Form, Card, Popover, **Calendar** (added manually in Phase 9, `react-day-picker` v9), and more.

### Incomes (`components/incomes/`)
| File | Purpose |
|------|---------|
| `income-columns.tsx` | Date, reference, project, received from, amount, accounts, status (Posted/Reversed), reverse action |
| `create-income-dialog.tsx` | Record Income form; income account defaults to 4001 |
| `reverse-income-dialog.tsx` | Reverse with optional reason |

### Account Transfers (`components/account-transfers/`)
| File | Purpose |
|------|---------|
| `account-transfer-columns.tsx` | From/to account, amount, project, status, reverse action |
| `create-account-transfer-dialog.tsx` | From/to asset accounts (source excluded from destination), optional project |
| `reverse-account-transfer-dialog.tsx` | Reverse with optional reason |

### Employees -- Phase 9 additions (`components/employees/`)
| File | Purpose |
|------|---------|
| `salary-breakdown-fields.tsx` | Component amount inputs, tax, security, live gross/net; `buildComponentAmounts()` helper |
| `add-salary-record-dialog.tsx` | Increment / revision form pre-filled from the latest record |
| `delete-salary-record-dialog.tsx` | Delete confirmation |
| `refund-security-dialog.tsx` | Refund amount, date, pay-from account |
| `employee-current-salary-card.tsx` | Current breakdown + allowances + net; notes upcoming change |
| `employee-salary-history-card.tsx` | History table with change vs previous and Upcoming badge |
| `employee-assignments-card.tsx` | Assignments with allowances |
| `employee-security-card.tsx` | Balance held, refunds, Refund button |
| `employee-payslips-card.tsx` | Last 12 payslips |

### Salary Components (`components/salary-components/`)
| File | Purpose |
|------|---------|
| `salary-component-columns.tsx` | Order, name, status, edit/delete |
| `salary-component-form-dialog.tsx` | Create/edit (one dialog for both) |
| `delete-salary-component-dialog.tsx` | Soft delete confirmation |

### Project Assignments -- Phase 9 additions
| File | Purpose |
|------|---------|
| `allowances-field.tsx` | Repeater for named monthly allowances with total |

### Payroll -- Phase 9 additions
| File | Purpose |
|------|---------|
| `payslip-breakdown-dialog.tsx` | Earnings (components, allowances with project code) and deductions |
| `payslip-columns.tsx` | Now shows salary, allowances, gross, tax, security, other deductions, net |
| `edit-payslip-dialog.tsx` | Edits tax, security, other deductions with live net |

### Utilities
| File | Exports |
|------|---------|
| `lib/dates.ts` | `parseIsoDate`, `toIsoDate`, `formatDate` (dd-mm-yyyy) |
| `lib/utils.ts` | `toInputDate` (server dd-mm-yyyy → ISO), `formatAmount` |
