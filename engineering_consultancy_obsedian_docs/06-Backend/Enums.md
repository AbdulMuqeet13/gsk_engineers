# PHP Enums

All enums are string-backed with TitleCase keys and a `values()` static helper.

## Enum Reference

### AccountType (`app/Enums/AccountType.php`)
| Key | Value |
|-----|-------|
| Asset | `asset` |
| Liability | `liability` |
| Equity | `equity` |
| Income | `income` |
| Expense | `expense` |

### NormalBalance (`app/Enums/NormalBalance.php`)
| Key | Value |
|-----|-------|
| Debit | `debit` |
| Credit | `credit` |

### ProjectStatus (`app/Enums/ProjectStatus.php`)
| Key | Value |
|-----|-------|
| Planning | `planning` |
| Active | `active` |
| OnHold | `on_hold` |
| Completed | `completed` |
| Cancelled | `cancelled` |

### EmployeeType (`app/Enums/EmployeeType.php`)
| Key | Value |
|-----|-------|
| Internal | `internal` |
| Project | `project` |

### RoleEnum (`app/Enums/RoleEnum.php`)
| Key | Value |
|-----|-------|
| SuperAdmin | `super-admin` |
| Accountant | `accountant` |
| ProjectManager | `project-manager` |
| Hr | `hr` |
| Viewer | `viewer` |

### JournalEntryType (`app/Enums/JournalEntryType.php`)
| Key | Value |
|-----|-------|
| Standard | `standard` |
| Simple | `simple` |
| Payroll | `payroll` |
| Transfer | `transfer` |
| Opening | `opening` |
| Expense | `expense` |

### JournalEntryStatus (`app/Enums/JournalEntryStatus.php`)
| Key | Value |
|-----|-------|
| Draft | `draft` |
| Posted | `posted` |

### ExpenseStatus (`app/Enums/ExpenseStatus.php`)
| Key | Value |
|-----|-------|
| Draft | `draft` |
| Submitted | `submitted` |
| Approved | `approved` |
| Rejected | `rejected` |

### AttendanceStatus (`app/Enums/AttendanceStatus.php`)
| Key | Value |
|-----|-------|
| Present | `present` |
| Absent | `absent` |
| HalfDay | `half_day` |
| Leave | `leave` |

### LeaveType (`app/Enums/LeaveType.php`)
| Key | Value |
|-----|-------|
| Annual | `annual` |
| Sick | `sick` |
| Casual | `casual` |
| Unpaid | `unpaid` |

### LeaveStatus (`app/Enums/LeaveStatus.php`)
| Key | Value |
|-----|-------|
| Pending | `pending` |
| Approved | `approved` |
| Rejected | `rejected` |

### PayrollStatus (`app/Enums/PayrollStatus.php`)
| Key | Value |
|-----|-------|
| Draft | `draft` |
| Submitted | `submitted` |
| Approved | `approved` |
| Rejected | `rejected` |

### PermissionEnum (`app/Enums/PermissionEnum.php`)
Categories: ChartOfAccounts, Projects, Employees, Attendance, Leave, Accounting, Expenses (including Approve), Payroll, Transfers, Reports (`reports.financial`, `reports.project`, `reports.payroll`), Settings, Users.

## TypeScript Mirrors

Defined in `resources/js/types/models.ts` as string union types:

```typescript
type AccountType = 'asset' | 'liability' | 'equity' | 'income' | 'expense';
type NormalBalance = 'debit' | 'credit';
type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
type EmployeeType = 'internal' | 'project';
type JournalEntryType = 'standard' | 'simple' | 'payroll' | 'transfer' | 'opening' | 'expense';
type JournalEntryStatus = 'draft' | 'posted';
type ExpenseStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave';
type LeaveType = 'annual' | 'sick' | 'casual' | 'unpaid';
type LeaveStatus = 'pending' | 'approved' | 'rejected';
type PayrollStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
```
