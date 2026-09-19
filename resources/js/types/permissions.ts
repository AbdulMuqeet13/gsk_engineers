export type Role =
    | 'Super Admin'
    | 'Accountant'
    | 'Project Manager'
    | 'HR'
    | 'Viewer';

export type Permission =
    // Projects
    | 'projects.view'
    | 'projects.create'
    | 'projects.update'
    | 'projects.delete'
    | 'projects.assign'
    // Employees
    | 'employees.view'
    | 'employees.create'
    | 'employees.update'
    | 'employees.delete'
    // Attendance
    | 'attendance.view'
    | 'attendance.manage'
    // Leave
    | 'leave.view'
    | 'leave.manage'
    | 'leave.approve'
    // Accounting
    | 'accounting.view'
    | 'accounting.create'
    | 'accounting.post'
    | 'accounting.reverse'
    // Chart of Accounts
    | 'chart-of-accounts.view'
    | 'chart-of-accounts.manage'
    // Expenses
    | 'expenses.view'
    | 'expenses.create'
    | 'expenses.update'
    | 'expenses.delete'
    | 'expenses.approve'
    // Payroll
    | 'payroll.view'
    | 'payroll.run'
    | 'payroll.approve'
    // Transfers
    | 'transfers.view'
    | 'transfers.create'
    // Reports
    | 'reports.view'
    | 'reports.financial'
    | 'reports.project'
    | 'reports.payroll'
    // Settings
    | 'settings.manage'
    // Users
    | 'users.view'
    | 'users.create'
    | 'users.update'
    | 'users.delete'
    | 'users.assign-roles';
