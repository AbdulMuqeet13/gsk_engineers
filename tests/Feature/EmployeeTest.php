<?php

namespace Tests\Feature;

use App\Enums\EmployeeType;
use App\Enums\RoleEnum;
use App\Models\Employee;
use App\Models\Payslip;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeTest extends TestCase
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
        $this->get(route('employees.index'))
            ->assertRedirect(route('login'));
    }

    public function test_index_displays_employees(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        Employee::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('employees.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('employees/index')
            ->has('employees.data', 3)
        );
    }

    public function test_store_creates_internal_employee(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '0300-1234567',
            'type' => EmployeeType::Internal->value,
            'designation' => 'Engineer',
            'department' => 'Engineering',
            'date_of_joining' => '2026-01-15',
            'salary' => '75000.00',
            'cnic' => '12345-6789012-3',
            'address' => '123 Main Street',
        ];

        $this->actingAs($user)
            ->post(route('employees.store'), $data)
            ->assertRedirect(route('employees.index'));

        $this->assertDatabaseHas('employees', [
            'name' => 'John Doe',
            'type' => 'internal',
            'project_id' => null,
        ]);
    }

    public function test_store_creates_project_employee(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $project = Project::factory()->create();

        $data = [
            'name' => 'Jane Doe',
            'type' => EmployeeType::Project->value,
            'project_id' => $project->id,
            'designation' => 'Site Engineer',
            'department' => 'Operations',
            'date_of_joining' => '2026-03-01',
            'salary' => '50000.00',
            'cnic' => '12345-6789012-4',
            'address' => '456 Site Road',
        ];

        $this->actingAs($user)
            ->post(route('employees.store'), $data)
            ->assertRedirect(route('employees.index'));

        $this->assertDatabaseHas('employees', [
            'name' => 'Jane Doe',
            'type' => 'project',
            'project_id' => $project->id,
        ]);
    }

    public function test_store_requires_project_id_for_project_type(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $this->actingAs($user)
            ->post(route('employees.store'), [
                'name' => 'Test',
                'type' => EmployeeType::Project->value,
                'designation' => 'Engineer',
                'department' => 'Ops',
                'date_of_joining' => '2026-01-01',
                'salary' => '50000',
                'cnic' => '12345-6789012-5',
                'address' => 'Test Address',
            ])
            ->assertSessionHasErrors('project_id');
    }

    public function test_store_prohibits_project_id_for_internal_type(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $project = Project::factory()->create();

        $this->actingAs($user)
            ->post(route('employees.store'), [
                'name' => 'Test',
                'type' => EmployeeType::Internal->value,
                'project_id' => $project->id,
                'designation' => 'Engineer',
                'department' => 'Ops',
                'date_of_joining' => '2026-01-01',
                'salary' => '50000',
                'cnic' => '12345-6789012-6',
                'address' => 'Test Address',
            ])
            ->assertSessionHasErrors('project_id');
    }

    public function test_store_validates_unique_email(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        Employee::factory()->create(['email' => 'taken@example.com']);

        $this->actingAs($user)
            ->post(route('employees.store'), [
                'name' => 'Test',
                'email' => 'taken@example.com',
                'type' => EmployeeType::Internal->value,
                'designation' => 'Engineer',
                'department' => 'Ops',
                'date_of_joining' => '2026-01-01',
                'salary' => '50000',
                'cnic' => '12345-6789012-7',
                'address' => 'Test Address',
            ])
            ->assertSessionHasErrors('email');
    }

    public function test_update_modifies_employee(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $employee = Employee::factory()->create();

        $this->actingAs($user)
            ->put(route('employees.update', $employee), [
                'name' => 'Updated Name',
                'type' => $employee->type->value,
                'designation' => $employee->designation,
                'department' => $employee->department,
                'date_of_joining' => $employee->date_of_joining->format('Y-m-d'),
                'salary' => $employee->salary,
                'cnic' => $employee->cnic,
                'address' => $employee->address,
            ])
            ->assertRedirect(route('employees.index'));

        $this->assertDatabaseHas('employees', [
            'id' => $employee->id,
            'name' => 'Updated Name',
        ]);
    }

    public function test_destroy_soft_deletes_employee(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $employee = Employee::factory()->create();

        $this->actingAs($user)
            ->delete(route('employees.destroy', $employee))
            ->assertRedirect(route('employees.index'));

        $this->assertSoftDeleted('employees', ['id' => $employee->id]);
    }

    public function test_destroy_fails_when_employee_has_payslips(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $employee = Employee::factory()->create();
        Payslip::factory()->create(['employee_id' => $employee->id]);

        $this->actingAs($user)
            ->delete(route('employees.destroy', $employee))
            ->assertRedirect(route('employees.index'));

        $this->assertDatabaseHas('employees', ['id' => $employee->id, 'deleted_at' => null]);
    }

    public function test_destroy_succeeds_when_employee_has_no_payslips(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $employee = Employee::factory()->create();

        $this->actingAs($user)
            ->delete(route('employees.destroy', $employee))
            ->assertRedirect(route('employees.index'));

        $this->assertSoftDeleted('employees', ['id' => $employee->id]);
    }
}
