# Component Inventory

## Shared Components

| Component | Path | Purpose |
|-----------|------|---------|
| DataTable | `components/data-table/data-table.tsx` | Reusable table with TanStack v9 |
| AppSidebar | `components/app-sidebar.tsx` | Main navigation sidebar |
| useDataTable | `hooks/use-data-table.ts` | Partial reloading, search, filters |

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

### Trial Balance (`components/trial-balance/`)
| File | Purpose |
|------|---------|
| `trial-balance-columns.tsx` | Column definitions with type badge, debit/credit/balance |

## shadcn/ui Primitives (`components/ui/`)

Installed via shadcn CLI (New York style). Includes: Button, Dialog, Input, Select, Label, Table, Badge, DropdownMenu, Form, Card, and more.
