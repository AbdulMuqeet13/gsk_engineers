<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttendanceTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Employee $employee;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();

        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);
        $this->employee = Employee::factory()->create();
    }

    public function test_index_requires_authentication(): void
    {
        $this->get(route('attendance.index'))
            ->assertRedirect(route('login'));
    }

    public function test_index_requires_view_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('attendance.index'))
            ->assertForbidden();
    }

    public function test_index_displays_attendances(): void
    {
        Attendance::factory()->count(3)->create([
            'employee_id' => $this->employee->id,
            'marked_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)->get(route('attendance.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('employees/attendance/index')
            ->has('attendances.data', 3)
        );
    }

    public function test_index_filters_by_date(): void
    {
        Attendance::factory()->create([
            'employee_id' => $this->employee->id,
            'marked_by' => $this->user->id,
            'date' => '2026-09-01',
        ]);
        Attendance::factory()->create([
            'employee_id' => Employee::factory()->create()->id,
            'marked_by' => $this->user->id,
            'date' => '2026-09-15',
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('attendance.index', [
                'date_from' => '2026-09-10',
                'date_to' => '2026-09-20',
            ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('attendances.data', 1)
        );
    }

    public function test_index_filters_by_employee(): void
    {
        $otherEmployee = Employee::factory()->create();

        Attendance::factory()->create([
            'employee_id' => $this->employee->id,
            'marked_by' => $this->user->id,
            'date' => '2026-09-01',
        ]);
        Attendance::factory()->create([
            'employee_id' => $otherEmployee->id,
            'marked_by' => $this->user->id,
            'date' => '2026-09-02',
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('attendance.index', ['employee_id' => $this->employee->id]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('attendances.data', 1)
        );
    }

    public function test_index_filters_by_status(): void
    {
        Attendance::factory()->present()->create([
            'employee_id' => $this->employee->id,
            'marked_by' => $this->user->id,
            'date' => '2026-09-01',
        ]);
        Attendance::factory()->absent()->create([
            'employee_id' => Employee::factory()->create()->id,
            'marked_by' => $this->user->id,
            'date' => '2026-09-01',
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('attendance.index', ['status' => 'present']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('attendances.data', 1)
        );
    }

    public function test_store_creates_attendance(): void
    {
        $data = [
            'employee_id' => $this->employee->id,
            'date' => '2026-09-16',
            'status' => 'present',
            'check_in' => '09:00',
            'check_out' => '17:00',
            'notes' => null,
        ];

        $this->actingAs($this->user)
            ->post(route('attendance.store'), $data)
            ->assertRedirect(route('attendance.index'));

        $this->assertDatabaseHas('attendances', [
            'employee_id' => $this->employee->id,
            'status' => 'present',
            'marked_by' => $this->user->id,
        ]);
    }

    public function test_store_requires_manage_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $data = [
            'employee_id' => $this->employee->id,
            'date' => '2026-09-16',
            'status' => 'present',
        ];

        $this->actingAs($user)
            ->post(route('attendance.store'), $data)
            ->assertForbidden();
    }

    public function test_store_validates_required_fields(): void
    {
        $this->actingAs($this->user)
            ->post(route('attendance.store'), [])
            ->assertSessionHasErrors(['employee_id', 'date', 'status']);
    }

    public function test_update_modifies_attendance(): void
    {
        $attendance = Attendance::factory()->present()->create([
            'employee_id' => $this->employee->id,
            'marked_by' => $this->user->id,
        ]);

        $data = [
            'employee_id' => $this->employee->id,
            'date' => $attendance->date->toDateString(),
            'status' => 'absent',
            'check_in' => null,
            'check_out' => null,
            'notes' => 'Sick leave',
        ];

        $this->actingAs($this->user)
            ->put(route('attendance.update', $attendance), $data)
            ->assertRedirect(route('attendance.index'));

        $this->assertDatabaseHas('attendances', [
            'id' => $attendance->id,
            'status' => 'absent',
        ]);
    }

    public function test_destroy_deletes_attendance(): void
    {
        $attendance = Attendance::factory()->create([
            'employee_id' => $this->employee->id,
            'marked_by' => $this->user->id,
        ]);

        $this->actingAs($this->user)
            ->delete(route('attendance.destroy', $attendance))
            ->assertRedirect(route('attendance.index'));

        $this->assertDatabaseMissing('attendances', ['id' => $attendance->id]);
    }
}
