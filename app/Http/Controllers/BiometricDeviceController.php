<?php

namespace App\Http\Controllers;

use App\Concerns\FlashesToast;
use App\Http\Requests\BiometricDevice\StoreBiometricDeviceRequest;
use App\Http\Requests\BiometricDevice\UpdateBiometricDeviceRequest;
use App\Models\BiometricDevice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BiometricDeviceController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('biometric.manage'), 403);

        $devices = BiometricDevice::query()
            ->when($request->input('search'), function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('serial_number', 'like', "%{$search}%");
                });
            })
            ->orderBy(
                $request->input('sort', 'created_at'),
                $request->input('direction', 'desc'),
            )
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        return Inertia::render('biometric/devices', [
            'devices' => $devices,
        ]);
    }

    public function store(StoreBiometricDeviceRequest $request): RedirectResponse
    {
        BiometricDevice::create($request->validated());

        $this->flashSuccess('Biometric device added successfully.');

        return redirect()->route('biometric-devices.index');
    }

    public function update(UpdateBiometricDeviceRequest $request, BiometricDevice $biometricDevice): RedirectResponse
    {
        $biometricDevice->update($request->validated());

        $this->flashSuccess('Biometric device updated successfully.');

        return redirect()->route('biometric-devices.index');
    }

    public function destroy(Request $request, BiometricDevice $biometricDevice): RedirectResponse
    {
        abort_unless($request->user()->can('biometric.manage'), 403);

        $biometricDevice->delete();

        $this->flashSuccess('Biometric device deleted successfully.');

        return redirect()->route('biometric-devices.index');
    }
}
