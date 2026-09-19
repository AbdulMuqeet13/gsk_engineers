<?php

namespace App\Http\Requests\Accounting;

use App\Enums\JournalEntryType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJournalEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('accounting.create');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'description' => ['required', 'string', 'max:500'],
            'type' => ['required', Rule::enum(JournalEntryType::class)],
            'lines' => ['required', 'array', 'min:2'],
            'lines.*.account_head_id' => ['required', 'integer', Rule::exists('account_heads', 'id')],
            'lines.*.project_id' => ['nullable', 'integer', Rule::exists('projects', 'id')],
            'lines.*.debit' => ['required', 'numeric', 'min:0', 'decimal:0,2'],
            'lines.*.credit' => ['required', 'numeric', 'min:0', 'decimal:0,2'],
            'lines.*.memo' => ['nullable', 'string', 'max:255'],
        ];
    }
}
