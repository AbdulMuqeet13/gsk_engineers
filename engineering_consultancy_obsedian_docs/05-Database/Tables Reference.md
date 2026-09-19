# Tables Reference

See [[02-Architecture/Database Schema]] for detailed column definitions.

## Current Tables (Phase 1-4)

| Table | Model | SoftDeletes | Key Relationships |
|-------|-------|-------------|-------------------|
| `users` | User | No | hasRoles, causesActivity |
| `account_heads` | AccountHead | Yes | self-ref parent/children |
| `projects` | Project | Yes | hasMany employees, assignments |
| `employees` | Employee | Yes | belongsTo project, hasMany assignments |
| `project_assignments` | ProjectAssignment | No | belongsTo employee + project |
| `journal_entries` | JournalEntry | No | hasMany lines, belongsTo creator, self-ref reversals |
| `journal_lines` | JournalLine | No | belongsTo journalEntry + accountHead + project |
| `expenses` | Expense | No | belongsTo accountHead + paymentAccount + project + journalEntry + creator + approver |
| `activity_log` | Activity (Spatie) | No | polymorphic subject + causer |
| `roles` | Role (Spatie) | No | many-to-many permissions |
| `permissions` | Permission (Spatie) | No | many-to-many roles |
| `model_has_roles` | - | No | polymorphic pivot |
| `model_has_permissions` | - | No | polymorphic pivot |
| `role_has_permissions` | - | No | pivot |
| `sessions` | - | No | Laravel session driver |
| `cache` | - | No | Laravel cache driver |
| `jobs` | - | No | Laravel queue |

## Planned Tables (Phase 5+)

| Table | Phase | Purpose |
|-------|-------|---------|
| `attendance` | 5 | Daily attendance records |
| `leave_requests` | 5 | Leave requests with approval flow |
| `payroll_runs` | 5 | Payroll period batches |
| `payslips` | 5 | Individual employee pay records |
| `inter_project_transfers` | 6 | Fund movement between projects |
