<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeaveRequestTest extends TestCase
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
        $this->get(route('leave.index'))
            ->assertRedirect(route('login'));
    }

    public function test_index_requires_view_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('leave.index'))
            ->assertForbidden();
    }

    public function test_index_displays_leave_requests(): void
    {
        LeaveRequest::factory()->count(3)->create([
            'employee_id' => $this->employee->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)->get(route('leave.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('employees/leave/index')
            ->has('leaveRequests.data', 3)
        );
    }

    public function test_index_filters_by_status(): void
    {
        LeaveRequest::factory()->pending()->count(2)->create([
            'employee_id' => $this->employee->id,
            'created_by' => $this->user->id,
        ]);
        LeaveRequest::factory()->approved()->create([
            'employee_id' => $this->employee->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('leave.index', ['status' => 'pending']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('leaveRequests.data', 2)
        );
    }

    public function test_index_filters_by_employee(): void
    {
        $otherEmployee = Employee::factory()->create();

        LeaveRequest::factory()->create([
            'employee_id' => $this->employee->id,
            'created_by' => $this->user->id,
        ]);
        LeaveRequest::factory()->create([
            'employee_id' => $otherEmployee->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('leave.index', ['employee_id' => $this->employee->id]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('leaveRequests.data', 1)
        );
    }

    public function test_index_filters_by_type(): void
    {
        LeaveRequest::factory()->sick()->create([
            'employee_id' => $this->employee->id,
            'created_by' => $this->user->id,
        ]);
        LeaveRequest::factory()->casual()->create([
            'employee_id' => Employee::factory()->create()->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('leave.index', ['leave_type' => 'sick']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('leaveRequests.data', 1)
        );
    }

    public function test_store_creates_pending_leave(): void
    {
        $data = [
            'employee_id' => $this->employee->id,
            'leave_type' => 'annual',
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-03',
            'reason' => 'Family vacation',
        ];

        $this->actingAs($this->user)
            ->post(route('leave.store'), $data)
            ->assertRedirect(route('leave.index'));

        $this->assertDatabaseHas('leave_requests', [
            'employee_id' => $this->employee->id,
            'status' => 'pending',
            'days' => 3,
        ]);
    }

    public function test_store_requires_manage_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $data = [
            'employee_id' => $this->employee->id,
            'leave_type' => 'annual',
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-03',
            'reason' => 'Test',
        ];

        $this->actingAs($user)
            ->post(route('leave.store'), $data)
            ->assertForbidden();
    }

    public function test_store_validates_required_fields(): void
    {
        $this->actingAs($this->user)
            ->post(route('leave.store'), [])
            ->assertSessionHasErrors(['employee_id', 'leave_type', 'start_date', 'end_date', 'reason']);
    }

    public function test_store_validates_end_date_after_start(): void
    {
        $data = [
            'employee_id' => $this->employee->id,
            'leave_type' => 'annual',
            'start_date' => '2026-10-05',
            'end_date' => '2026-10-03',
            'reason' => 'Test',
        ];

        $this->actingAs($this->user)
            ->post(route('leave.store'), $data)
            ->assertSessionHasErrors('end_date');
    }

    public function test_approve_transitions_to_approved(): void
    {
        $leave = LeaveRequest::factory()->pending()->create([
            'employee_id' => $this->employee->id,
            'created_by' => $this->user->id,
        ]);

        $this->actingAs($this->user)
            ->post(route('leave.approve', $leave))
            ->assertRedirect(route('leave.index'));

        $leave->refresh();
        $this->assertTrue($leave->isApproved());
        $this->assertNotNull($leave->approved_at);
    }

    public function test_approve_requires_approve_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $leave = LeaveRequest::factory()->pending()->create([
            'employee_id' => $this->employee->id,
            'created_by' => $this->user->id,
        ]);

        $this->actingAs($user)
            ->post(route('leave.approve', $leave))
            ->assertForbidden();
    }

    public function test_reject_requires_reason(): void
    {
        $leave = LeaveRequest::factory()->pending()->create([
            'employee_id' => $this->employee->id,
            'created_by' => $this->user->id,
        ]);

        $this->actingAs($this->user)
            ->post(route('leave.reject', $leave), [])
            ->assertSessionHasErrors('reason');
    }

    public function test_destroy_deletes_pending_only(): void
    {
        $leave = LeaveRequest::factory()->pending()->create([
            'employee_id' => $this->employee->id,
            'created_by' => $this->user->id,
        ]);

        $this->actingAs($this->user)
            ->delete(route('leave.destroy', $leave))
            ->assertRedirect(route('leave.index'));

        $this->assertDatabaseMissing('leave_requests', ['id' => $leave->id]);
    }

    public function test_destroy_rejects_non_pending(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Hr);

        $leave = LeaveRequest::factory()->approved()->create([
            'employee_id' => $this->employee->id,
            'created_by' => $user->id,
        ]);

        $this->actingAs($user)
            ->delete(route('leave.destroy', $leave))
            ->assertForbidden();
    }
}
