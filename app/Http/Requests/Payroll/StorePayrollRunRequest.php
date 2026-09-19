<?php

namespace App\Http\Requests\Payroll;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePayrollRunRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('payroll.run');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after:period_start'],
            'payment_account_id' => ['required', 'integer', Rule::exists('account_heads', 'id')->where('type', 'asset')->where('is_active', true)],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }
}
