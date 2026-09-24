<?php

namespace App\Http\Controllers;

use App\Concerns\FlashesToast;
use App\Models\BiometricDevice;
use App\Models\Employee;
use App\Models\EmployeeFingerprint;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BiometricEnrollmentController extends Controller
{
    use FlashesToast;

    public function store(Request $request, Employee $employee): RedirectResponse
    {
        abort_unless($request->user()->can('biometric.manage'), 403);

        $deviceUserId = str_pad((string) $employee->id, 5, '0', STR_PAD_LEFT);

        if ($employee->fingerprints()->where('device_user_id', $deviceUserId)->exists()) {
            $this->flashError('Employee is already enrolled.');

            return back();
        }

        $employee->fingerprints()->create([
            'device_user_id' => $deviceUserId,
            'enrolled_at' => now(),
        ]);

        // Queue USERINFO command to all active devices
        $command = "DATA UPDATE USERINFO PIN={$deviceUserId}\tName={$employee->name}\tPri=0\tPasswd=\tCard=";

        BiometricDevice::where('is_active', true)->each(function (BiometricDevice $device) use ($command) {
            $device->queueCommand($command);
        });

        $this->flashSuccess('Employee enrolled on biometric devices.');

        return back();
    }

    public function destroy(Request $request, EmployeeFingerprint $fingerprint): RedirectResponse
    {
        abort_unless($request->user()->can('biometric.manage'), 403);

        $pin = $fingerprint->device_user_id;

        $fingerprint->delete();

        // Queue DELETE USERINFO command to all active devices
        $command = "DATA DELETE USERINFO PIN={$pin}";

        BiometricDevice::where('is_active', true)->each(function (BiometricDevice $device) use ($command) {
            $device->queueCommand($command);
        });

        $this->flashSuccess('Employee enrollment removed from biometric devices.');

        return back();
    }
}
