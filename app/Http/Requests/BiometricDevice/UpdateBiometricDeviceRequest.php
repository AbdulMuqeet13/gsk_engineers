<?php

namespace App\Http\Requests\BiometricDevice;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBiometricDeviceRequest extends FormRequest
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
            'serial_number' => ['required', 'string', 'max:255', Rule::unique('biometric_devices', 'serial_number')->ignore($this->route('biometric_device'))],
            'model' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
