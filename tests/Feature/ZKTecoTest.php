<?php

namespace Tests\Feature;

use App\Enums\AttendanceSource;
use App\Enums\AttendanceStatus;
use App\Enums\DeviceCommandStatus;
use App\Models\Attendance;
use App\Models\BiometricDevice;
use App\Models\Employee;
use App\Models\EmployeeFingerprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ZKTecoTest extends TestCase
{
    use RefreshDatabase;

    public function test_init_auto_registers_unknown_device(): void
    {
        $this->get('/api/iclock/cdata?SN=ABC123&options=all')
            ->assertOk();

        $this->assertDatabaseHas('biometric_devices', [
            'serial_number' => 'ABC123',
        ]);
    }

    public function test_init_updates_heartbeat_for_known_device(): void
    {
        $device = BiometricDevice::create([
            'name' => 'Test Device',
            'serial_number' => 'DEF456',
            'last_heartbeat_at' => null,
        ]);

        $this->get('/api/iclock/cdata?SN=DEF456&options=all')
            ->assertOk();

        $device->refresh();
        $this->assertNotNull($device->last_heartbeat_at);
    }

    public function test_init_returns_attlog_stamp(): void
    {
        BiometricDevice::create([
            'name' => 'Test Device',
            'serial_number' => 'GHI789',
            'last_attlog_stamp' => 12345,
        ]);

        $response = $this->get('/api/iclock/cdata?SN=GHI789&options=all');

        $response->assertOk();
        $this->assertStringContainsString('ATTLOGStamp=12345', $response->getContent());
    }

    public function test_push_creates_attendance_with_check_in(): void
    {
        $device = BiometricDevice::create([
            'name' => 'Test Device',
            'serial_number' => 'TEST01',
            'is_active' => true,
        ]);

        $employee = Employee::factory()->create();
        EmployeeFingerprint::create([
            'employee_id' => $employee->id,
            'device_user_id' => '00001',
            'enrolled_at' => now(),
        ]);

        $body = "00001\t2026-09-24 09:00:00\t0\t1\t0\t0";

        $this->call('POST', '/api/iclock/cdata?SN=TEST01&table=ATTLOG&Stamp=100', [], [], [], [
            'CONTENT_TYPE' => 'text/plain',
        ], $body)->assertOk();

        $this->assertDatabaseHas('attendances', [
            'employee_id' => $employee->id,
            'date' => '2026-09-24',
            'check_in' => '09:00:00',
            'check_out' => null,
            'status' => AttendanceStatus::Present->value,
            'source' => AttendanceSource::Biometric->value,
            'marked_by' => null,
        ]);
    }

    public function test_push_updates_check_out_on_second_punch(): void
    {
        $device = BiometricDevice::create([
            'name' => 'Test Device',
            'serial_number' => 'TEST02',
            'is_active' => true,
        ]);

        $employee = Employee::factory()->create();
        EmployeeFingerprint::create([
            'employee_id' => $employee->id,
            'device_user_id' => '00002',
            'enrolled_at' => now(),
        ]);

        // First punch
        Attendance::create([
            'employee_id' => $employee->id,
            'date' => '2026-09-24',
            'status' => AttendanceStatus::Present,
            'check_in' => '09:00:00',
            'source' => AttendanceSource::Biometric,
            'marked_by' => null,
        ]);

        $body = "00002\t2026-09-24 17:30:00\t1\t1\t0\t0";

        $this->call('POST', '/api/iclock/cdata?SN=TEST02&table=ATTLOG&Stamp=200', [], [], [], [
            'CONTENT_TYPE' => 'text/plain',
        ], $body)->assertOk();

        $this->assertDatabaseHas('attendances', [
            'employee_id' => $employee->id,
            'date' => '2026-09-24',
            'check_out' => '17:30:00',
        ]);
    }

    public function test_push_skips_unknown_pin(): void
    {
        BiometricDevice::create([
            'name' => 'Test Device',
            'serial_number' => 'TEST03',
            'is_active' => true,
        ]);

        $body = "99999\t2026-09-24 09:00:00\t0\t1\t0\t0";

        $this->call('POST', '/api/iclock/cdata?SN=TEST03&table=ATTLOG&Stamp=300', [], [], [], [
            'CONTENT_TYPE' => 'text/plain',
        ], $body)->assertOk();

        $this->assertDatabaseCount('attendances', 0);
    }

    public function test_get_request_returns_pending_commands(): void
    {
        $device = BiometricDevice::create([
            'name' => 'Test Device',
            'serial_number' => 'TEST04',
            'is_active' => true,
        ]);

        $device->queueCommand('DATA UPDATE USERINFO PIN=00001\tName=Test\tPri=0');

        $response = $this->get('/api/iclock/getrequest?SN=TEST04');

        $response->assertOk();
        $this->assertStringContainsString('C:1:DATA UPDATE USERINFO', $response->getContent());

        // Command should be marked as sent
        $this->assertDatabaseHas('device_commands', [
            'biometric_device_id' => $device->id,
            'status' => DeviceCommandStatus::Sent->value,
        ]);
    }

    public function test_device_cmd_acknowledges_command(): void
    {
        $device = BiometricDevice::create([
            'name' => 'Test Device',
            'serial_number' => 'TEST05',
            'is_active' => true,
        ]);

        $command = $device->queueCommand('DATA UPDATE USERINFO PIN=00001');
        $command->update([
            'status' => DeviceCommandStatus::Sent,
            'sent_at' => now(),
        ]);

        $this->call('POST', '/api/iclock/devicecmd?SN=TEST05', [], [], [], [
            'CONTENT_TYPE' => 'text/plain',
        ], "ID={$command->sequence}&Return=0&CMD=OK")->assertOk();

        $command->refresh();
        $this->assertEquals(DeviceCommandStatus::Acknowledged, $command->status);
        $this->assertNotNull($command->acknowledged_at);
    }
}
