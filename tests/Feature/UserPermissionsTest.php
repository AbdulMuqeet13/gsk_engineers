<?php

namespace Tests\Feature;

use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserPermissionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function test_user_can_be_assigned_a_role(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $this->assertTrue($user->hasRole(RoleEnum::Viewer));
    }

    public function test_super_admin_has_all_permissions_via_gate(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $this->assertTrue($user->can(PermissionEnum::AccountingPost->value));
        $this->assertTrue($user->can(PermissionEnum::PayrollRun->value));
        $this->assertTrue($user->can(PermissionEnum::SettingsManage->value));
        $this->assertTrue($user->can(PermissionEnum::UsersDelete->value));
    }

    public function test_viewer_cannot_create_or_modify(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $this->assertTrue($user->can(PermissionEnum::ProjectsView->value));
        $this->assertFalse($user->can(PermissionEnum::ProjectsCreate->value));
        $this->assertFalse($user->can(PermissionEnum::AccountingPost->value));
        $this->assertFalse($user->can(PermissionEnum::SettingsManage->value));
    }

    public function test_user_get_role_names(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Accountant);

        $roleNames = $user->getRoleNames()->toArray();

        $this->assertContains(RoleEnum::Accountant->value, $roleNames);
    }

    public function test_user_get_all_permissions(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $permissions = $user->getAllPermissions()->pluck('name')->toArray();

        $this->assertContains(PermissionEnum::ProjectsView->value, $permissions);
        $this->assertNotContains(PermissionEnum::ProjectsCreate->value, $permissions);
    }
}
