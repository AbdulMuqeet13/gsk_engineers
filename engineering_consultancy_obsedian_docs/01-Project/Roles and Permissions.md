# Roles and Permissions

## Roles

| Role | Scope |
|------|-------|
| **Super Admin** | Everything -- bypasses all permission checks via `Gate::before` |
| **Accountant** | Full accounting, expenses (including approval), transfers, reports |
| **Project Manager** | Own projects, project expenses, project reports (no company-wide books) |
| **HR** | Employees, attendance, leave, payroll |
| **Viewer** | Read-only access to reports |

## Permission Categories

| Category | Permissions |
|----------|------------|
| **Chart of Accounts** | `chart-of-accounts.view`, `chart-of-accounts.manage` |
| **Projects** | `projects.view`, `projects.create`, `projects.update`, `projects.delete`, `projects.assign` |
| **Employees** | `employees.view`, `employees.create`, `employees.update`, `employees.delete` |
| **Accounting** | `accounting.view`, `accounting.create`, `accounting.post`, `accounting.reverse` |
| **Expenses** | `expenses.view`, `expenses.create`, `expenses.update`, `expenses.delete`, `expenses.approve` |
| **Payroll** | `payroll.view`, `payroll.run` (also salary components), `payroll.approve` (also security refunds) |
| **Incomes** | `incomes.view`, `incomes.create` |
| **Transfers** | `transfers.view`, `transfers.create` |
| **Account Transfers** | `account-transfers.view`, `account-transfers.create` |
| **Reports** | `reports.financial`, `reports.project`, `reports.payroll` |
| **User Management** | `users.view`, `users.manage` |

## Implementation

- Permissions defined in `app/Enums/PermissionEnum.php` (string-backed enum)
- Roles defined in `app/Enums/RoleEnum.php` (string-backed enum)
- Seeded via `database/seeders/RolesAndPermissionsSeeder.php`
- Policies in `app/Policies/` enforce authorization server-side
- Super Admin bypass: `Gate::before()` in `AppServiceProvider` returns `true` for Super Admin role
- Frontend: permission filtering is client-side (hide UI elements), but server is the real gate

## Notes (Phase 9)

- Accountant gets `incomes.*` and `account-transfers.*`; Viewer gets the `.view` permissions.
- Salary records use `employees.update`; assignment allowances use `projects.assign`.
- New permissions only reach the database via `RolesAndPermissionsSeeder` -- run it after deploying. It uses `syncPermissions`, which resets every role to the seeded defaults.
- The sidebar is filtered by `auth.permissions` (from `getAllPermissions()`), so un-seeded permissions hide menu items even for Super Admin.
