<?php

namespace App\Http\Requests\AccountHeads;

use App\Enums\AccountType;
use App\Enums\NormalBalance;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAccountHeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('chart-of-accounts.manage');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', 'unique:account_heads,code'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(AccountType::class)],
            'normal_balance' => ['required', Rule::enum(NormalBalance::class)],
            'parent_id' => ['nullable', 'integer', Rule::exists('account_heads', 'id')],
            'is_active' => ['boolean'],
        ];
    }
}
