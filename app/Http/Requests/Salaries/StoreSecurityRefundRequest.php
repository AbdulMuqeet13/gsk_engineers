<?php

namespace App\Http\Requests\Salaries;

use App\Enums\AccountType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSecurityRefundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('payroll.approve');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'gt:0', 'decimal:0,2'],
            'date' => ['required', 'date'],
            'payment_account_id' => ['required', 'integer', Rule::exists('account_heads', 'id')->where('type', AccountType::Asset->value)->where('is_active', true)->whereNull('deleted_at')],
            'remarks' => ['nullable', 'string', 'max:500'],
        ];
    }
}
