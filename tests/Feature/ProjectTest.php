<?php

namespace Tests\Feature;

use App\Enums\ProjectStatus;
use App\Enums\RoleEnum;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();
    }

    public function test_index_requires_authentication(): void
    {
        $this->get(route('projects.index'))
            ->assertRedirect(route('login'));
    }

    public function test_index_requires_view_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('projects.index'))
            ->assertForbidden();
    }

    public function test_index_displays_projects(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        Project::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('projects.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('projects/index')
            ->has('projects.data', 3)
        );
    }

    public function test_store_creates_project(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $data = [
            'name' => 'Test Project',
            'code' => 'PRJ-001',
            'client' => 'Test Client',
            'status' => ProjectStatus::Planning->value,
            'start_date' => '2026-10-01',
            'budget' => '500000.00',
        ];

        $this->actingAs($user)
            ->post(route('projects.store'), $data)
            ->assertRedirect(route('projects.index'));

        $this->assertDatabaseHas('projects', [
            'name' => 'Test Project',
            'code' => 'PRJ-001',
        ]);
    }

    public function test_store_validates_unique_code(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        Project::factory()->create(['code' => 'PRJ-001']);

        $this->actingAs($user)
            ->post(route('projects.store'), [
                'name' => 'Duplicate',
                'code' => 'PRJ-001',
                'status' => ProjectStatus::Planning->value,
            ])
            ->assertSessionHasErrors('code');
    }

    public function test_store_validates_end_date_after_start_date(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $this->actingAs($user)
            ->post(route('projects.store'), [
                'name' => 'Test',
                'code' => 'PRJ-002',
                'status' => ProjectStatus::Planning->value,
                'start_date' => '2026-12-01',
                'end_date' => '2026-01-01',
            ])
            ->assertSessionHasErrors('end_date');
    }

    public function test_update_modifies_project(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $project = Project::factory()->create();

        $this->actingAs($user)
            ->put(route('projects.update', $project), [
                'name' => 'Updated Project',
                'code' => $project->code,
                'status' => ProjectStatus::Active->value,
            ])
            ->assertRedirect(route('projects.index'));

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Project',
            'status' => 'active',
        ]);
    }

    public function test_destroy_soft_deletes_project(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $project = Project::factory()->create();

        $this->actingAs($user)
            ->delete(route('projects.destroy', $project))
            ->assertRedirect(route('projects.index'));

        $this->assertSoftDeleted('projects', ['id' => $project->id]);
    }

    public function test_viewer_cannot_create_project(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $this->actingAs($user)
            ->post(route('projects.store'), [
                'name' => 'Test',
                'code' => 'PRJ-003',
                'status' => ProjectStatus::Planning->value,
            ])
            ->assertForbidden();
    }
}
