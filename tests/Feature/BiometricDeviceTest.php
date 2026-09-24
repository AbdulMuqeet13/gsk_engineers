<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\BiometricDevice;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BiometricDeviceTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();

        $this->admin = User::factory()->create();
        $this->admin->assignRole(RoleEnum::SuperAdmin);
    }

    public function test_index_requires_authentication(): void
    {
        $this->get(route('biometric-devices.index'))
            ->assertRedirect(route('login'));
    }

    public function test_index_requires_biometric_manage_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('biometric-devices.index'))
            ->assertForbidden();
    }

    public function test_index_displays_devices(): void
    {
        BiometricDevice::create([
            'name' => 'Office Device',
            'serial_number' => 'SN001',
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('biometric-devices.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('biometric/devices')
            ->has('devices.data', 1)
        );
    }

    public function test_store_creates_device(): void
    {
        $this->actingAs($this->admin)
            ->post(route('biometric-devices.store'), [
                'name' => 'New Device',
                'serial_number' => 'NEW001',
                'model' => 'ZK-F22',
                'location' => 'Main Gate',
            ])
            ->assertRedirect(route('biometric-devices.index'));

        $this->assertDatabaseHas('biometric_devices', [
            'serial_number' => 'NEW001',
            'name' => 'New Device',
            'model' => 'ZK-F22',
        ]);
    }

    public function test_update_modifies_device(): void
    {
        $device = BiometricDevice::create([
            'name' => 'Old Name',
            'serial_number' => 'UPD001',
        ]);

        $this->actingAs($this->admin)
            ->put(route('biometric-devices.update', $device), [
                'name' => 'Updated Name',
                'serial_number' => 'UPD001',
                'is_active' => false,
            ])
            ->assertRedirect(route('biometric-devices.index'));

        $device->refresh();
        $this->assertEquals('Updated Name', $device->name);
        $this->assertFalse($device->is_active);
    }

    public function test_destroy_deletes_device(): void
    {
        $device = BiometricDevice::create([
            'name' => 'Delete Me',
            'serial_number' => 'DEL001',
        ]);

        $this->actingAs($this->admin)
            ->delete(route('biometric-devices.destroy', $device))
            ->assertRedirect(route('biometric-devices.index'));

        $this->assertDatabaseMissing('biometric_devices', [
            'serial_number' => 'DEL001',
        ]);
    }
}
