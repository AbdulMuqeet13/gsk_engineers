<?php

namespace App\Enums;

enum PermissionEnum: string
{
    // Projects
    case ProjectsView = 'projects.view';
    case ProjectsCreate = 'projects.create';
    case ProjectsUpdate = 'projects.update';
    case ProjectsDelete = 'projects.delete';
    case ProjectsAssign = 'projects.assign';

    // Employees
    case EmployeesView = 'employees.view';
    case EmployeesCreate = 'employees.create';
    case EmployeesUpdate = 'employees.update';
    case EmployeesDelete = 'employees.delete';

    // Attendance
    case AttendanceView = 'attendance.view';
    case AttendanceManage = 'attendance.manage';

    // Leave
    case LeaveView = 'leave.view';
    case LeaveManage = 'leave.manage';
    case LeaveApprove = 'leave.approve';

    // Accounting
    case AccountingView = 'accounting.view';
    case AccountingCreate = 'accounting.create';
    case AccountingPost = 'accounting.post';
    case AccountingReverse = 'accounting.reverse';

    // Chart of Accounts
    case ChartOfAccountsView = 'chart-of-accounts.view';
    case ChartOfAccountsManage = 'chart-of-accounts.manage';

    // Expenses
    case ExpensesView = 'expenses.view';
    case ExpensesCreate = 'expenses.create';
    case ExpensesUpdate = 'expenses.update';
    case ExpensesDelete = 'expenses.delete';
    case ExpensesApprove = 'expenses.approve';

    // Payroll
    case PayrollView = 'payroll.view';
    case PayrollRun = 'payroll.run';
    case PayrollApprove = 'payroll.approve';

    // Transfers
    case TransfersView = 'transfers.view';
    case TransfersCreate = 'transfers.create';

    // Reports
    case ReportsView = 'reports.view';
    case ReportsFinancial = 'reports.financial';
    case ReportsProject = 'reports.project';
    case ReportsPayroll = 'reports.payroll';

    // Settings
    case SettingsManage = 'settings.manage';

    // Users
    case UsersView = 'users.view';
    case UsersCreate = 'users.create';
    case UsersUpdate = 'users.update';
    case UsersDelete = 'users.delete';
    case UsersAssignRoles = 'users.assign-roles';

    /**
     * @return string[]
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
