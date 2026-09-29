<?php

namespace App\Http\Requests\Incomes;

use App\Enums\AccountType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectIncomeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('incomes.create');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'project_id' => ['required', 'integer', Rule::exists('projects', 'id')->whereNull('deleted_at')->whereNotIn('status', ['completed', 'cancelled'])],
            'income_account_id' => ['required', 'integer', Rule::exists('account_heads', 'id')->where('type', AccountType::Income->value)->where('is_active', true)->whereNull('deleted_at')],
            'deposit_account_id' => ['required', 'integer', Rule::exists('account_heads', 'id')->where('type', AccountType::Asset->value)->where('is_active', true)->whereNull('deleted_at')],
            'amount' => ['required', 'numeric', 'gt:0', 'decimal:0,2'],
            'date' => ['required', 'date'],
            'received_from' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:500'],
            'cheque_number' => ['nullable', 'string', 'max:100'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'income_account_id.exists' => 'The selected income account must be an active income account.',
            'deposit_account_id.exists' => 'The selected deposit account must be an active asset account.',
        ];
    }
}
