<?php

namespace App\Http\Requests\Transfers;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('transfers.create');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'from_project_id' => ['required', 'integer', Rule::exists('projects', 'id')],
            'to_project_id' => ['required', 'integer', Rule::exists('projects', 'id'), 'different:from_project_id'],
            'from_account_id' => ['required', 'integer', Rule::exists('account_heads', 'id')->where('type', 'asset')->where('is_active', true)],
            'to_account_id' => ['required', 'integer', Rule::exists('account_heads', 'id')->where('is_active', true)],
            'amount' => ['required', 'numeric', 'gt:0', 'decimal:0,2'],
            'date' => ['required', 'date'],
            'purpose' => ['required', 'string', 'max:500'],
        ];
    }
}
