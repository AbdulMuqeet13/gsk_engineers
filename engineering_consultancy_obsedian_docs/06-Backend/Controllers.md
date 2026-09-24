# Controllers

All controllers use the `FlashesToast` trait and delegate write operations to Action classes.

## Route Reference

### Chart of Accounts
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/accounting/chart-of-accounts` | `account-heads.index` | AccountHeadController@index |
| POST | `/accounting/chart-of-accounts` | `account-heads.store` | AccountHeadController@store |
| PUT | `/accounting/chart-of-accounts/{account_head}` | `account-heads.update` | AccountHeadController@update |
| DELETE | `/accounting/chart-of-accounts/{account_head}` | `account-heads.destroy` | AccountHeadController@destroy |

**Index Props:** accountHeads (paginated), accountTypes, normalBalances, parentAccounts (optional)
**Filters:** search (code/name), type

### Projects
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/projects` | `projects.index` | ProjectController@index |
| POST | `/projects` | `projects.store` | ProjectController@store |
| PUT | `/projects/{project}` | `projects.update` | ProjectController@update |
| DELETE | `/projects/{project}` | `projects.destroy` | ProjectController@destroy |

**Index Props:** projects (paginated), statuses
**Filters:** search (name/code/client), status

### Employees
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/employees` | `employees.index` | EmployeeController@index |
| POST | `/employees` | `employees.store` | EmployeeController@store |
| PUT | `/employees/{employee}` | `employees.update` | EmployeeController@update |
| DELETE | `/employees/{employee}` | `employees.destroy` | EmployeeController@destroy |

**Index Props:** employees (paginated, with project), employeeTypes, projects (optional)
**Filters:** search (name/email), type, project

### Project Assignments
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/projects/assignments` | `project-assignments.index` | ProjectAssignmentController@index |
| POST | `/projects/assignments` | `project-assignments.store` | ProjectAssignmentController@store |
| PUT | `/projects/assignments/{assignment}` | `project-assignments.update` | ProjectAssignmentController@update |
| DELETE | `/projects/assignments/{assignment}` | `project-assignments.destroy` | ProjectAssignmentController@destroy |

**Index Props:** assignments (paginated, with employee + project), employees (internal only, optional), projects (optional)
**Filters:** project, employee

### Journal Entries
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/accounting/journal-entries` | `journal-entries.index` | JournalEntryController@index |
| POST | `/accounting/journal-entries` | `journal-entries.store` | JournalEntryController@store |
| PUT | `/accounting/journal-entries/{journal_entry}` | `journal-entries.update` | JournalEntryController@update |
| DELETE | `/accounting/journal-entries/{journal_entry}` | `journal-entries.destroy` | JournalEntryController@destroy |
| POST | `/accounting/journal-entries/{journal_entry}/post` | `journal-entries.post` | JournalEntryController@post |
| POST | `/accounting/journal-entries/{journal_entry}/reverse` | `journal-entries.reverse` | JournalEntryController@reverse |

**Index Props:** journalEntries (paginated, with creator + lines + reversedBy + reversalOf), entryTypes, entryStatuses, accountHeads (optional), projects (optional)
**Filters:** search (reference/description), status, type, date_from, date_to

### General Ledger
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/accounting/general-ledger` | `general-ledger.index` | GeneralLedgerController@index |

**Index Props:** lines (posted lines for selected account with running balance), accountHeads, projects (optional)
**Filters:** account_head_id, date_from, date_to, project_id

### Trial Balance
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/accounting/trial-balance` | `trial-balance.index` | TrialBalanceController@index |

**Index Props:** rows (account balances), totals (debit/credit/balance), is_balanced, projects (optional)
**Filters:** date_from, date_to, project_id

### Expenses
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/expenses` | `expenses.index` | ExpenseController@index |
| POST | `/expenses` | `expenses.store` | ExpenseController@store |
| PUT | `/expenses/{expense}` | `expenses.update` | ExpenseController@update |
| DELETE | `/expenses/{expense}` | `expenses.destroy` | ExpenseController@destroy |
| POST | `/expenses/{expense}/submit` | `expenses.submit` | ExpenseController@submit |
| POST | `/expenses/{expense}/approve` | `expenses.approve` | ExpenseController@approve |
| POST | `/expenses/{expense}/reject` | `expenses.reject` | ExpenseController@reject |

**Index Props:** expenses (paginated, with accountHead + paymentAccount + project + creator + approver), expenseStatuses, expenseAccounts (optional), paymentAccounts (optional), projects (optional)
**Filters:** search (reference/description), status, project_id, account_head_id, date_from, date_to

### Attendance
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/attendance` | `attendance.index` | AttendanceController@index |
| POST | `/attendance` | `attendance.store` | AttendanceController@store |
| PUT | `/attendance/{attendance}` | `attendance.update` | AttendanceController@update |
| DELETE | `/attendance/{attendance}` | `attendance.destroy` | AttendanceController@destroy |

**Index Props:** attendance (paginated, with employee + marker), employees (optional)
**Filters:** search (employee name), date_from, date_to, status

### Leave Requests
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/leave` | `leave.index` | LeaveRequestController@index |
| POST | `/leave` | `leave.store` | LeaveRequestController@store |
| DELETE | `/leave/{leave_request}` | `leave.destroy` | LeaveRequestController@destroy |
| POST | `/leave/{leave_request}/approve` | `leave.approve` | LeaveRequestController@approve |
| POST | `/leave/{leave_request}/reject` | `leave.reject` | LeaveRequestController@reject |

**Index Props:** leaveRequests (paginated, with employee + creator + approver), leaveTypes, leaveStatuses, employees (optional)
**Filters:** search (employee name), status, leave_type

### Payroll Runs
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/payroll` | `payroll.index` | PayrollRunController@index |
| POST | `/payroll` | `payroll.store` | PayrollRunController@store |
| GET | `/payroll/{payroll_run}` | `payroll.show` | PayrollRunController@show |
| DELETE | `/payroll/{payroll_run}` | `payroll.destroy` | PayrollRunController@destroy |
| POST | `/payroll/{payroll_run}/submit` | `payroll.submit` | PayrollRunController@submit |
| POST | `/payroll/{payroll_run}/approve` | `payroll.approve` | PayrollRunController@approve |
| POST | `/payroll/{payroll_run}/reject` | `payroll.reject` | PayrollRunController@reject |
| PUT | `/payroll/{payroll_run}/payslips/{payslip}` | `payroll.payslips.update` | PayrollRunController@updatePayslip |

**Index Props:** payrollRuns (paginated, with payslipsCount + paymentAccount + creator + approver), payrollStatuses, paymentAccounts (optional)
**Filters:** search (reference), status, date_from, date_to

**Show Props:** payrollRun (with payslips.employee), payrollStatuses

### Inter-Project Transfers
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/transfers` | `transfers.index` | InterProjectTransferController@index |
| POST | `/transfers` | `transfers.store` | InterProjectTransferController@store |
| POST | `/transfers/{transfer}/reverse` | `transfers.reverse` | InterProjectTransferController@reverse |

**Index Props:** transfers (paginated, with fromProject + toProject + fromAccount + toAccount + journalEntry + creator), projects (optional), accounts (optional)
**Filters:** search (reference/purpose), from_project_id, to_project_id, date_from, date_to

### Reports — Inter-Project Position
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/reports/inter-project-position` | `reports.inter-project-position` | InterProjectPositionController@index |

**Index Props:** positions (InterProjectPosition[]), projects
**Filters:** project_id

### Reports — Profit & Loss
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/reports/profit-and-loss` | `reports.profit-and-loss` | ProfitAndLossController@index |

**Index Props:** incomeAccounts, expenseAccounts, totalIncome, totalExpenses, netProfit, projects (optional)
**Filters:** date_from, date_to, project_id
**Permission:** `reports.financial`

### Reports — Balance Sheet
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/reports/balance-sheet` | `reports.balance-sheet` | BalanceSheetController@index |

**Index Props:** assetAccounts, liabilityAccounts, equityAccounts, totalAssets, totalLiabilities, totalEquity, isBalanced, netProfit, projects (optional)
**Filters:** as_at_date, project_id
**Permission:** `reports.financial`

### Reports -- Income & Expense Summary
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/reports/income-expense-summary` | `reports.income-expense-summary` | IncomeExpenseSummaryController@index |
| GET | `/reports/income-expense-summary/export` | `reports.income-expense-summary.export` | IncomeExpenseSummaryController@export |

**Index Props:** rows (by category: code/name/type/balance, by project: project/income/expenses/net), totals (totalIncome, totalExpenses, netProfit), projects (optional)
**Filters:** date_from, date_to, project_id, group_by (category|project)
**Permission:** `reports.financial`
**Export:** PDF, Excel

### Reports -- Payroll Report
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/reports/payroll` | `reports.payroll` | PayrollReportController@index |
| GET | `/reports/payroll/export` | `reports.payroll.export` | PayrollReportController@export |

**Index Props:** runs (approved PayrollRun with payslips), summary (totalRuns, totalEmployees, totalDisbursed)
**Filters:** date_from, date_to
**Permission:** `reports.payroll`
**Export:** PDF, Excel

### Reports -- Project Cashbook
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/reports/project-cashbook` | `reports.project-cashbook` | ProjectCashbookController@index |
| GET | `/reports/project-cashbook/export` | `reports.project-cashbook.export` | ProjectCashbookController@export |

**Index Props:** rows (CashbookRow[]), summary (CashbookSummary), cashAccounts, projects
**Filters:** project_id (required), date_from, date_to, account_id
**Permission:** `reports.project`
**Export:** PDF, Excel

### Reports -- Project Ledger
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/reports/project-ledger` | `reports.project-ledger` | ProjectLedgerController@index |
| GET | `/reports/project-ledger/export` | `reports.project-ledger.export` | ProjectLedgerController@export |

**Index Props:** rows (ProjectLedgerRow[]), totals (totalDebit, totalCredit), accountHeads, projects
**Filters:** project_id (required), date_from, date_to, account_head_id
**Permission:** `reports.project`
**Export:** PDF, Excel

### Payslip Download
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| GET | `/payroll/{payroll_run}/payslips/{payslip}/download` | `payroll.payslips.download` | PayrollRunController@downloadPayslip |

**Permission:** `payroll.view`
**Output:** PDF salary slip

### File Attachments
| Method | URI | Name | Controller Method |
|--------|-----|------|------------------|
| POST | `/attachments` | `attachments.store` | AttachmentController@store |
| GET | `/attachments/{attachment}/download` | `attachments.download` | AttachmentController@download |
| DELETE | `/attachments/{attachment}` | `attachments.destroy` | AttachmentController@destroy |

**Attachable types:** expense, employee, project, journal_entry
**Allowed files:** PDF, JPG, JPEG, PNG, DOC, DOCX, XLS, XLSX (max 10 MB)
**Permission:** Per-type permission checks (e.g., `expenses.create` for expense attachments)

## Route Parameter Note

The Chart of Accounts route uses `.parameter('chart-of-accounts', 'account_head')` to match the controller's `AccountHead $accountHead` type hint. Without this, Laravel generates `{chart_of_account}` which doesn't match.
