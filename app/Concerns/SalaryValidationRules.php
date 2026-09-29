<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait SalaryValidationRules
{
    /**
     * Rules for a salary breakdown: component amounts plus monthly tax and security.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function salaryBreakdownRules(): array
    {
        return [
            'components' => ['required', 'array', 'min:1'],
            'components.*.salary_component_id' => ['required', 'integer', 'distinct', Rule::exists('salary_components', 'id')->whereNull('deleted_at')],
            'components.*.amount' => ['nullable', 'numeric', 'min:0', 'decimal:0,2'],
            'tax_amount' => ['nullable', 'numeric', 'min:0', 'decimal:0,2'],
            'security_amount' => ['nullable', 'numeric', 'min:0', 'decimal:0,2'],
        ];
    }

    /**
     * Readable names for the salary breakdown fields in validation messages.
     *
     * @return array<string, string>
     */
    protected function salaryBreakdownAttributes(): array
    {
        return [
            'components.*.salary_component_id' => 'salary component',
            'components.*.amount' => 'component amount',
            'tax_amount' => 'tax',
            'security_amount' => 'security deduction',
        ];
    }

    /**
     * Require the component amounts to add up to more than zero.
     */
    protected function componentsTotalIsPositive(): bool
    {
        $total = collect($this->input('components', []))
            ->sum(fn (mixed $component) => is_array($component) && is_numeric($component['amount'] ?? null) ? (float) $component['amount'] : 0);

        return $total > 0;
    }
}
