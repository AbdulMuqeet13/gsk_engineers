<?php

namespace Tests\Feature;

use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RolesAndPermissionsSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_creates_all_roles(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        foreach (RoleEnum::cases() as $role) {
            $this->assertDatabaseHas('roles', ['name' => $role->value]);
        }

        $this->assertCount(count(RoleEnum::cases()), Role::all());
    }

    public function test_seeder_creates_all_permissions(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        foreach (PermissionEnum::values() as $permission) {
            $this->assertDatabaseHas('permissions', ['name' => $permission]);
        }

        $this->assertCount(count(PermissionEnum::cases()), Permission::all());
    }

    public function test_seeder_is_idempotent(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);
        $this->seed(RolesAndPermissionsSeeder::class);

        $this->assertCount(count(RoleEnum::cases()), Role::all());
        $this->assertCount(count(PermissionEnum::cases()), Permission::all());
    }

    public function test_super_admin_has_all_permissions(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        $role = Role::findByName(RoleEnum::SuperAdmin->value);

        foreach (PermissionEnum::values() as $permission) {
            $this->assertTrue(
                $role->hasPermissionTo($permission),
                "Super Admin should have permission: {$permission}"
            );
        }
    }

    public function test_accountant_has_accounting_permissions(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        $role = Role::findByName(RoleEnum::Accountant->value);

        $this->assertTrue($role->hasPermissionTo(PermissionEnum::AccountingView->value));
        $this->assertTrue($role->hasPermissionTo(PermissionEnum::AccountingCreate->value));
        $this->assertTrue($role->hasPermissionTo(PermissionEnum::AccountingPost->value));
        $this->assertTrue($role->hasPermissionTo(PermissionEnum::ExpensesView->value));
        $this->assertTrue($role->hasPermissionTo(PermissionEnum::TransfersView->value));
        $this->assertTrue($role->hasPermissionTo(PermissionEnum::ReportsFinancial->value));

        $this->assertFalse($role->hasPermissionTo(PermissionEnum::EmployeesCreate->value));
        $this->assertFalse($role->hasPermissionTo(PermissionEnum::PayrollRun->value));
    }

    public function test_viewer_has_only_view_permissions(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        $role = Role::findByName(RoleEnum::Viewer->value);

        $this->assertTrue($role->hasPermissionTo(PermissionEnum::ProjectsView->value));
        $this->assertTrue($role->hasPermissionTo(PermissionEnum::AccountingView->value));
        $this->assertTrue($role->hasPermissionTo(PermissionEnum::ReportsView->value));

        $this->assertFalse($role->hasPermissionTo(PermissionEnum::ProjectsCreate->value));
        $this->assertFalse($role->hasPermissionTo(PermissionEnum::AccountingPost->value));
        $this->assertFalse($role->hasPermissionTo(PermissionEnum::ExpensesCreate->value));
    }
}
