<?php

namespace App\Models;

use App\Enums\DeviceCommandStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $biometric_device_id
 * @property int $sequence
 * @property string $command
 * @property DeviceCommandStatus $status
 * @property Carbon|null $sent_at
 * @property Carbon|null $acknowledged_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read BiometricDevice $device
 */
#[Fillable(['biometric_device_id', 'sequence', 'command', 'status', 'sent_at', 'acknowledged_at'])]
class DeviceCommand extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => DeviceCommandStatus::class,
            'sent_at' => 'datetime',
            'acknowledged_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<BiometricDevice, $this>
     */
    public function device(): BelongsTo
    {
        return $this->belongsTo(BiometricDevice::class, 'biometric_device_id');
    }

    /**
     * @param  Builder<DeviceCommand>  $query
     */
    public function scopePending(Builder $query): void
    {
        $query->where('status', DeviceCommandStatus::Pending);
    }
}
