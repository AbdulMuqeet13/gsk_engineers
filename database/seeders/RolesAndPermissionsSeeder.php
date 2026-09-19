<?php

namespace Database\Seeders;

use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->createPermissions();
        $this->createRoles();
    }

    private function createPermissions(): void
    {
        foreach (PermissionEnum::values() as $permission) {
            Permission::findOrCreate($permission, 'web');
        }
    }

    private function createRoles(): void
    {
        $this->createSuperAdmin();
        $this->createAccountant();
        $this->createProjectManager();
        $this->createHr();
        $this->createViewer();
    }

    private function createSuperAdmin(): void
    {
        $role = Role::findOrCreate(RoleEnum::SuperAdmin->value, 'web');
        $role->syncPermissions(Permission::all());
    }

    private function createAccountant(): void
    {
        $role = Role::findOrCreate(RoleEnum::Accountant->value, 'web');
        $role->syncPermissions([
            // Accounting
            PermissionEnum::AccountingView->value,
            PermissionEnum::AccountingCreate->value,
            PermissionEnum::AccountingPost->value,
            PermissionEnum::AccountingReverse->value,

            // Chart of Accounts
            PermissionEnum::ChartOfAccountsView->value,
            PermissionEnum::ChartOfAccountsManage->value,

            // Expenses
            PermissionEnum::ExpensesView->value,
            PermissionEnum::ExpensesCreate->value,
            PermissionEnum::ExpensesUpdate->value,
            PermissionEnum::ExpensesDelete->value,
            PermissionEnum::ExpensesApprove->value,

            // Transfers
            PermissionEnum::TransfersView->value,
            PermissionEnum::TransfersCreate->value,

            // Reports
            PermissionEnum::ReportsView->value,
            PermissionEnum::ReportsFinancial->value,
            PermissionEnum::ReportsProject->value,
            PermissionEnum::ReportsPayroll->value,

            // Projects (view only)
            PermissionEnum::ProjectsView->value,

            // Employees (view only)
            PermissionEnum::EmployeesView->value,

            // Payroll (view only)
            PermissionEnum::PayrollView->value,
        ]);
    }

    private function createProjectManager(): void
    {
        $role = Role::findOrCreate(RoleEnum::ProjectManager->value, 'web');
        $role->syncPermissions([
            // Projects
            PermissionEnum::ProjectsView->value,
            PermissionEnum::ProjectsCreate->value,
            PermissionEnum::ProjectsUpdate->value,
            PermissionEnum::ProjectsAssign->value,

            // Employees (view only)
            PermissionEnum::EmployeesView->value,

            // Expenses (own projects)
            PermissionEnum::ExpensesView->value,
            PermissionEnum::ExpensesCreate->value,

            // Reports (project only)
            PermissionEnum::ReportsView->value,
            PermissionEnum::ReportsProject->value,

            // Attendance (view)
            PermissionEnum::AttendanceView->value,

            // Leave (view)
            PermissionEnum::LeaveView->value,
        ]);
    }

    private function createHr(): void
    {
        $role = Role::findOrCreate(RoleEnum::Hr->value, 'web');
        $role->syncPermissions([
            // Employees
            PermissionEnum::EmployeesView->value,
            PermissionEnum::EmployeesCreate->value,
            PermissionEnum::EmployeesUpdate->value,
            PermissionEnum::EmployeesDelete->value,

            // Attendance
            PermissionEnum::AttendanceView->value,
            PermissionEnum::AttendanceManage->value,

            // Leave
            PermissionEnum::LeaveView->value,
            PermissionEnum::LeaveManage->value,
            PermissionEnum::LeaveApprove->value,

            // Payroll
            PermissionEnum::PayrollView->value,
            PermissionEnum::PayrollRun->value,
            PermissionEnum::PayrollApprove->value,

            // Reports (payroll)
            PermissionEnum::ReportsView->value,
            PermissionEnum::ReportsPayroll->value,

            // Projects (view only)
            PermissionEnum::ProjectsView->value,
        ]);
    }

    private function createViewer(): void
    {
        $role = Role::findOrCreate(RoleEnum::Viewer->value, 'web');
        $role->syncPermissions([
            PermissionEnum::ProjectsView->value,
            PermissionEnum::EmployeesView->value,
            PermissionEnum::AttendanceView->value,
            PermissionEnum::LeaveView->value,
            PermissionEnum::AccountingView->value,
            PermissionEnum::ChartOfAccountsView->value,
            PermissionEnum::ExpensesView->value,
            PermissionEnum::PayrollView->value,
            PermissionEnum::TransfersView->value,
            PermissionEnum::ReportsView->value,
        ]);
    }
}
