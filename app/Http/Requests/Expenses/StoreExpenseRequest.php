<?php

namespace App\Http\Requests\Expenses;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('expenses.create');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'description' => ['required', 'string', 'max:500'],
            'amount' => ['required', 'numeric', 'gt:0', 'decimal:0,2'],
            'account_head_id' => ['required', 'integer', Rule::exists('account_heads', 'id')->where('type', 'expense')->where('is_active', true)],
            'payment_account_id' => ['required', 'integer', Rule::exists('account_heads', 'id')->where('type', 'asset')->where('is_active', true)],
            'project_id' => ['nullable', 'integer', Rule::exists('projects', 'id')->whereNull('deleted_at')->whereNotIn('status', ['completed', 'cancelled'])],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
