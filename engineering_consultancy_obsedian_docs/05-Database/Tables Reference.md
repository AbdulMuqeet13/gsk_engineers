# Tables Reference

See [[02-Architecture/Database Schema]] for detailed column definitions.

## Current Tables (Phases 1-8)

| Table | Model | SoftDeletes | Key Relationships |
|-------|-------|-------------|-------------------|
| `users` | User | No | hasRoles, causesActivity |
| `account_heads` | AccountHead | Yes | self-ref parent/children, hasMany journalLines |
| `projects` | Project | Yes | hasMany employees, assignments, morphMany attachments |
| `employees` | Employee | Yes | belongsTo project, hasMany assignments + payslips, morphMany attachments |
| `project_assignments` | ProjectAssignment | No | belongsTo employee + project |
| `journal_entries` | JournalEntry | No | hasMany lines, belongsTo creator, self-ref reversals, morphMany attachments |
| `journal_lines` | JournalLine | No | belongsTo journalEntry + accountHead + project |
| `expenses` | Expense | No | belongsTo accountHead + paymentAccount + project + journalEntry + creator + approver, morphMany attachments |
| `attendance` | Attendance | No | belongsTo employee + marker |
| `leave_requests` | LeaveRequest | No | belongsTo employee + creator + approver |
| `payroll_runs` | PayrollRun | No | hasMany payslips, belongsTo paymentAccount + journalEntry + creator + approver |
| `payslips` | Payslip | No | belongsTo payrollRun + employee |
| `inter_project_transfers` | InterProjectTransfer | No | belongsTo fromProject + toProject + fromAccount + toAccount + journalEntry + creator |
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
