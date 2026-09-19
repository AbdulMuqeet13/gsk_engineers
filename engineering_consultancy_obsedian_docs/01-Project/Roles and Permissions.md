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
| **Payroll** | `payroll.view`, `payroll.run`, `payroll.approve` |
| **Reports** | `reports.view`, `reports.export` |
| **User Management** | `users.view`, `users.manage` |

## Implementation

- Permissions defined in `app/Enums/PermissionEnum.php` (string-backed enum)
- Roles defined in `app/Enums/RoleEnum.php` (string-backed enum)
- Seeded via `database/seeders/RolesAndPermissionsSeeder.php`
- Policies in `app/Policies/` enforce authorization server-side
- Super Admin bypass: `Gate::before()` in `AppServiceProvider` returns `true` for Super Admin role
- Frontend: permission filtering is client-side (hide UI elements), but server is the real gate
