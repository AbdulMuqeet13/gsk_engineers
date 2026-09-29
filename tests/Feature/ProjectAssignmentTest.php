<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\AssignmentAllowance;
use App\Models\Employee;
use App\Models\Project;
use App\Models\ProjectAssignment;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectAssignmentTest extends TestCase
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
        $this->get(route('project-assignments.index'))
            ->assertRedirect(route('login'));
    }

    public function test_index_displays_assignments(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        ProjectAssignment::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('project-assignments.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('projects/assignments/index')
            ->has('assignments.data', 3)
        );
    }

    public function test_store_creates_assignment(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $employee = Employee::factory()->create();
        $project = Project::factory()->create();

        $this->actingAs($user)
            ->post(route('project-assignments.store'), [
                'employee_id' => $employee->id,
                'project_id' => $project->id,
                'role' => 'Site Engineer',
                'allocation_percent' => '100.00',
            ])
            ->assertRedirect(route('project-assignments.index'));

        $this->assertDatabaseHas('project_assignments', [
            'employee_id' => $employee->id,
            'project_id' => $project->id,
            'role' => 'Site Engineer',
        ]);
    }

    public function test_store_validates_unique_employee_project_combination(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $assignment = ProjectAssignment::factory()->create();

        $this->actingAs($user)
            ->post(route('project-assignments.store'), [
                'employee_id' => $assignment->employee_id,
                'project_id' => $assignment->project_id,
                'role' => 'Duplicate',
                'allocation_percent' => '50.00',
            ])
            ->assertSessionHasErrors('employee_id');
    }

    public function test_update_modifies_assignment(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $assignment = ProjectAssignment::factory()->create();

        $this->actingAs($user)
            ->put(route('project-assignments.update', $assignment), [
                'employee_id' => $assignment->employee_id,
                'project_id' => $assignment->project_id,
                'role' => 'Updated Role',
                'allocation_percent' => '50.00',
            ])
            ->assertRedirect(route('project-assignments.index'));

        $this->assertDatabaseHas('project_assignments', [
            'id' => $assignment->id,
            'role' => 'Updated Role',
            'allocation_percent' => '50.00',
        ]);
    }

    public function test_destroy_deletes_assignment(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $assignment = ProjectAssignment::factory()->create();

        $this->actingAs($user)
            ->delete(route('project-assignments.destroy', $assignment))
            ->assertRedirect(route('project-assignments.index'));

        $this->assertDatabaseMissing('project_assignments', [
            'id' => $assignment->id,
        ]);
    }

    public function test_viewer_cannot_manage_assignments(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $this->actingAs($user)
            ->get(route('project-assignments.index'))
            ->assertForbidden();
    }

    public function test_allocation_percent_max_100(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $employee = Employee::factory()->create();
        $project = Project::factory()->create();

        $this->actingAs($user)
            ->post(route('project-assignments.store'), [
                'employee_id' => $employee->id,
                'project_id' => $project->id,
                'role' => 'Engineer',
                'allocation_percent' => '150.00',
            ])
            ->assertSessionHasErrors('allocation_percent');
    }

    public function test_store_saves_assignment_allowances(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);
        $employee = Employee::factory()->create();
        $project = Project::factory()->create();

        $this->actingAs($user)
            ->post(route('project-assignments.store'), [
                'employee_id' => $employee->id,
                'project_id' => $project->id,
                'role' => 'Site Engineer',
                'allocation_percent' => '100',
                'allowances' => [
                    ['name' => 'Site Allowance', 'amount' => '10000.00'],
                    ['name' => 'Fuel Allowance', 'amount' => '5000.00'],
                ],
            ])
            ->assertRedirect(route('project-assignments.index'));

        $assignment = ProjectAssignment::sole();
        $this->assertSame(
            [['Site Allowance', '10000.00'], ['Fuel Allowance', '5000.00']],
            $assignment->allowances()->orderBy('id')->get()->map(fn ($allowance) => [$allowance->name, $allowance->amount])->all(),
        );
    }

    public function test_update_replaces_assignment_allowances(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);
        $assignment = ProjectAssignment::factory()->create();
        AssignmentAllowance::factory()->for($assignment, 'assignment')->create(['name' => 'Old Allowance']);

        $this->actingAs($user)
            ->put(route('project-assignments.update', $assignment), [
                'employee_id' => $assignment->employee_id,
                'project_id' => $assignment->project_id,
                'role' => $assignment->role,
                'allocation_percent' => '100',
                'allowances' => [['name' => 'Hardship Allowance', 'amount' => '7500.00']],
            ])
            ->assertRedirect(route('project-assignments.index'));

        $this->assertSame(['Hardship Allowance'], $assignment->allowances()->pluck('name')->all());
    }

    public function test_store_rejects_allowance_without_positive_amount(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $this->actingAs($user)
            ->post(route('project-assignments.store'), [
                'employee_id' => Employee::factory()->create()->id,
                'project_id' => Project::factory()->create()->id,
                'role' => 'Site Engineer',
                'allocation_percent' => '100',
                'allowances' => [['name' => 'Site Allowance', 'amount' => '0']],
            ])
            ->assertSessionHasErrors('allowances.0.amount');

        $this->assertDatabaseEmpty('project_assignments');
    }
}
