<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $serial_number
 * @property string|null $model
 * @property string|null $location
 * @property int $last_attlog_stamp
 * @property Carbon|null $last_heartbeat_at
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, DeviceCommand> $commands
 * @property-read Collection<int, EmployeeFingerprint> $fingerprints
 */
#[Fillable(['name', 'serial_number', 'model', 'location', 'last_attlog_stamp', 'last_heartbeat_at', 'is_active'])]
class BiometricDevice extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_heartbeat_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return HasMany<DeviceCommand, $this>
     */
    public function commands(): HasMany
    {
        return $this->hasMany(DeviceCommand::class);
    }

    /**
     * @return HasMany<EmployeeFingerprint, $this>
     */
    public function fingerprints(): HasMany
    {
        return $this->hasMany(EmployeeFingerprint::class);
    }

    /**
     * Queue an ADMS command for this device to pick up on its next poll.
     */
    public function queueCommand(string $command): DeviceCommand
    {
        $sequence = ($this->commands()->max('sequence') ?? 0) + 1;

        return $this->commands()->create([
            'sequence' => $sequence,
            'command' => $command,
        ]);
    }
}
