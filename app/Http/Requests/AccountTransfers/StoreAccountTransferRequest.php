<?php

namespace App\Http\Requests\AccountTransfers;

use App\Enums\AccountType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAccountTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('account-transfers.create');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'from_account_id' => ['required', 'integer', Rule::exists('account_heads', 'id')->where('type', AccountType::Asset->value)->where('is_active', true)->whereNull('deleted_at')],
            'to_account_id' => ['required', 'integer', Rule::exists('account_heads', 'id')->where('type', AccountType::Asset->value)->where('is_active', true)->whereNull('deleted_at'), 'different:from_account_id'],
            'project_id' => ['nullable', 'integer', Rule::exists('projects', 'id')->whereNull('deleted_at')->whereNotIn('status', ['completed', 'cancelled'])],
            'amount' => ['required', 'numeric', 'gt:0', 'decimal:0,2'],
            'date' => ['required', 'date'],
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
            'from_account_id.exists' => 'The source account must be an active asset account.',
            'to_account_id.exists' => 'The destination account must be an active asset account.',
            'to_account_id.different' => 'The destination account must be different from the source account.',
        ];
    }
}
