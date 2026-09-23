<?php

namespace Tests\Feature;

use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HandleInertiaRequestsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);

        $this->withoutVite();
    }

    public function test_authenticated_request_shares_roles_and_permissions(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);

        $page = $response->viewData('page');

        $this->assertArrayHasKey('auth', $page['props']);
        $this->assertArrayHasKey('roles', $page['props']['auth']);
        $this->assertArrayHasKey('permissions', $page['props']['auth']);
        $this->assertContains(RoleEnum::Viewer->value, $page['props']['auth']['roles']);
        $this->assertIsArray($page['props']['auth']['permissions']);
        $this->assertNotEmpty($page['props']['auth']['permissions']);
    }

    public function test_super_admin_shares_all_permissions(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $response = $this->actingAs($user)->get('/dashboard');

        $page = $response->viewData('page');

        $permissions = $page['props']['auth']['permissions'];

        $this->assertContains(PermissionEnum::AccountingPost->value, $permissions);
        $this->assertContains(PermissionEnum::SettingsManage->value, $permissions);
    }

    public function test_unauthenticated_request_redirects_to_login(): void
    {
        $response = $this->get('/');

        $response->assertRedirect(route('login'));
    }

    public function test_flash_toast_is_shared_when_present(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->withSession(['toast' => ['type' => 'success', 'message' => 'Test message']])
            ->get('/dashboard');

        $response->assertStatus(200);

        $page = $response->viewData('page');

        $this->assertArrayHasKey('flash', $page['props']);
    }
}
