# Tables Reference

See [[02-Architecture/Database Schema]] for detailed column definitions.

## Current Tables (Phases 1-9)

| Table | Model | SoftDeletes | Key Relationships |
|-------|-------|-------------|-------------------|
| `users` | User | No | hasRoles, causesActivity |
| `account_heads` | AccountHead | Yes | self-ref parent/children, hasMany journalLines |
| `projects` | Project | Yes | hasMany employees, assignments, morphMany attachments |
| `employees` | Employee | Yes | belongsTo project, hasMany assignments + payslips + salaries + securityRefunds, hasOne currentSalary, morphMany attachments |
| `project_assignments` | ProjectAssignment | No | belongsTo employee + project, hasMany allowances |
| `journal_entries` | JournalEntry | No | hasMany lines, belongsTo creator, self-ref reversals, morphMany attachments |
| `journal_lines` | JournalLine | No | belongsTo journalEntry + accountHead + project |
| `expenses` | Expense | No | belongsTo accountHead + paymentAccount + project + journalEntry + creator + approver, morphMany attachments |
| `attendance` | Attendance | No | belongsTo employee + marker |
| `leave_requests` | LeaveRequest | No | belongsTo employee + creator + approver |
| `payroll_runs` | PayrollRun | No | hasMany payslips, belongsTo paymentAccount + journalEntry + creator + approver |
| `payslips` | Payslip | No | belongsTo payrollRun + employee + employeeSalary, hasMany items |
| `inter_project_transfers` | InterProjectTransfer | No | belongsTo fromProject + toProject + fromAccount + toAccount + journalEntry + creator |
| `project_incomes` | ProjectIncome | No | belongsTo project + incomeAccount + depositAccount + journalEntry + creator |
| `account_transfers` | AccountTransfer | No | belongsTo fromAccount + toAccount + project + journalEntry + creator |
| `salary_components` | SalaryComponent | Yes | -- |
| `employee_salaries` | EmployeeSalary | No | belongsTo employee + creator, hasMany components + payslips |
| `employee_salary_components` | EmployeeSalaryComponent | No | belongsTo employeeSalary + salaryComponent (withTrashed) |
| `assignment_allowances` | AssignmentAllowance | No | belongsTo assignment (project_assignment_id) |
| `payslip_items` | PayslipItem | No | belongsTo payslip + project |
| `security_refunds` | SecurityRefund | No | belongsTo employee + paymentAccount + journalEntry + creator |
| `attachments` | Attachment | No | morphTo attachable (expense, employee, project, journal_entry), belongsTo uploader |
| `activity_log` | Activity (Spatie) | No | polymorphic subject + causer |
| `roles` | Role (Spatie) | No | many-to-many permissions |
| `permissions` | Permission (Spatie) | No | many-to-many roles |
| `model_has_roles` | - | No | polymorphic pivot |
| `model_has_permissions` | - | No | polymorphic pivot |
| `role_has_permissions` | - | No | pivot |
| `sessions` | - | No | Laravel session driver |
| `cache` | - | No | Laravel cache driver |
| `jobs` | - | No | Laravel queue |

## Phase 9 Column Notes

- `employees.salary` was **dropped**; salary lives in `employee_salaries` (+ `employee_salary_components`).
- `payslips.basic_salary` renamed to `salary_amount`; added `employee_salary_id`, `allowances_amount`, `gross_salary`, `tax_amount`, `security_amount`. `deductions` = other deductions. `net_salary = gross − tax − security − deductions`.
- `employee_salaries`: `effective_date`, `change_type` (initial/increment/decrement/revision), `gross_salary`, `tax_amount`, `security_amount`, `remarks`, `created_by`; index (`employee_id`, `effective_date`).
- `payslip_items`: `type` (component/allowance), `name`, `amount`, `project_id` (allowances only) -- snapshot of the breakdown at generation time.
- `project_incomes` / `account_transfers`: `reference` unique (`INC-` / `ACT-YYYY-NNNNNN`), `amount decimal(18,2)`, `date`, `cheque_number`, `journal_entry_id`.
- All money columns `decimal(18,2)`.
