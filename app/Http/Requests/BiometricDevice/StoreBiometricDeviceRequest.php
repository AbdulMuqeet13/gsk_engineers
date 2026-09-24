<?php

namespace App\Http\Requests\BiometricDevice;

use Illuminate\Foundation\Http\FormRequest;

class StoreBiometricDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('biometric.manage');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'serial_number' => ['required', 'string', 'max:255', 'unique:biometric_devices,serial_number'],
            'model' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
        ];
    }
}
