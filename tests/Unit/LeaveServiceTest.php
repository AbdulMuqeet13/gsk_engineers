<?php

namespace Tests\Unit;

use App\Exceptions\Leave\LeaveNotPendingException;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\User;
use App\Services\LeaveService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeaveServiceTest extends TestCase
{
    use RefreshDatabase;

    private LeaveService $service;

    private User $user;

    private Employee $employee;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = app(LeaveService::class);
        $this->user = User::factory()->create();
        $this->employee = Employee::factory()->create();
    }

    public function test_create_sets_pending_status(): void
    {
        $leave = $this->service->create([
            'employee_id' => $this->employee->id,
            'leave_type' => 'annual',
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-03',
            'reason' => 'Vacation',
        ], $this->user);

        $this->assertInstanceOf(LeaveRequest::class, $leave);
        $this->assertTrue($leave->isPending());
        $this->assertEquals($this->user->id, $leave->created_by);
    }

    public function test_create_calculates_days(): void
    {
        $leave = $this->service->create([
            'employee_id' => $this->employee->id,
            'leave_type' => 'sick',
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-05',
            'reason' => 'Medical appointment',
        ], $this->user);

        $this->assertEquals(5, $leave->days);
    }

    public function test_approve_sets_approver_and_timestamp(): void
    {
        $leave = LeaveRequest::factory()->pending()->create([
            'employee_id' => $this->employee->id,
            'created_by' => $this->user->id,
        ]);

        $approver = User::factory()->create();
        $this->service->approve($leave, $approver);

        $leave->refresh();
        $this->assertTrue($leave->isApproved());
        $this->assertEquals($approver->id, $leave->approved_by);
        $this->assertNotNull($leave->approved_at);
    }

    public function test_approve_throws_for_non_pending(): void
    {
        $leave = LeaveRequest::factory()->approved()->create([
            'employee_id' => $this->employee->id,
            'created_by' => $this->user->id,
        ]);

        $this->expectException(LeaveNotPendingException::class);
        $this->service->approve($leave, User::factory()->create());
    }

    public function test_reject_with_reason(): void
    {
        $leave = LeaveRequest::factory()->pending()->create([
            'employee_id' => $this->employee->id,
            'created_by' => $this->user->id,
        ]);

        $rejector = User::factory()->create();
        $this->service->reject($leave, $rejector, 'Insufficient leave balance');

        $leave->refresh();
        $this->assertTrue($leave->isRejected());
        $this->assertEquals('Insufficient leave balance', $leave->rejection_reason);
        $this->assertEquals($rejector->id, $leave->approved_by);
    }

    public function test_delete_throws_for_non_pending(): void
    {
        $leave = LeaveRequest::factory()->approved()->create([
            'employee_id' => $this->employee->id,
            'created_by' => $this->user->id,
        ]);

        $this->expectException(LeaveNotPendingException::class);
        $this->service->delete($leave);
    }
}
