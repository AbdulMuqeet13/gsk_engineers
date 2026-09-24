<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\BiometricDevice;
use App\Models\Employee;
use App\Models\EmployeeFingerprint;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BiometricEnrollmentTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private Employee $employee;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();

        $this->admin = User::factory()->create();
        $this->admin->assignRole(RoleEnum::SuperAdmin);
        $this->employee = Employee::factory()->create();
    }

    public function test_enroll_creates_fingerprint_and_queues_command(): void
    {
        $device = BiometricDevice::create([
            'name' => 'Device',
            'serial_number' => 'ENR001',
            'is_active' => true,
        ]);

        $this->actingAs($this->admin)
            ->post(route('employees.enroll', $this->employee))
            ->assertRedirect();

        $this->assertDatabaseHas('employee_fingerprints', [
            'employee_id' => $this->employee->id,
        ]);

        $this->assertDatabaseHas('device_commands', [
            'biometric_device_id' => $device->id,
        ]);
    }

    public function test_enroll_requires_biometric_manage_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('employees.enroll', $this->employee))
            ->assertForbidden();
    }

    public function test_delete_fingerprint_queues_delete_command(): void
    {
        $device = BiometricDevice::create([
            'name' => 'Device',
            'serial_number' => 'ENR002',
            'is_active' => true,
        ]);

        $fingerprint = EmployeeFingerprint::create([
            'employee_id' => $this->employee->id,
            'device_user_id' => '00001',
            'enrolled_at' => now(),
        ]);

        $this->actingAs($this->admin)
            ->delete(route('employee-fingerprints.destroy', $fingerprint))
            ->assertRedirect();

        $this->assertDatabaseMissing('employee_fingerprints', [
            'id' => $fingerprint->id,
        ]);

        $this->assertDatabaseHas('device_commands', [
            'biometric_device_id' => $device->id,
        ]);
    }

    public function test_cannot_enroll_same_employee_twice(): void
    {
        BiometricDevice::create([
            'name' => 'Device',
            'serial_number' => 'ENR003',
            'is_active' => true,
        ]);

        // First enrollment
        $this->actingAs($this->admin)
            ->post(route('employees.enroll', $this->employee))
            ->assertRedirect();

        // Second enrollment should fail
        $this->actingAs($this->admin)
            ->post(route('employees.enroll', $this->employee))
            ->assertRedirect();

        $this->assertDatabaseCount('employee_fingerprints', 1);
    }
}
