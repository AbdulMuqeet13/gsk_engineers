<?php

namespace App\Concerns;

use App\Enums\SalaryComponentType;
use App\Models\SalaryComponent;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

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
     * Require the earning components to add up to more than zero and the
     * deduction components not to exceed them.
     */
    protected function validateSalaryBreakdownTotals(Validator $validator): void
    {
        if ($validator->errors()->has('components') || $validator->errors()->has('components.*')) {
            return;
        }

        $amounts = collect($this->input('components', []))
            ->filter(fn (mixed $component) => is_array($component) && is_numeric($component['amount'] ?? null));

        $deductionComponentIds = SalaryComponent::withTrashed()
            ->whereIn('id', $amounts->pluck('salary_component_id'))
            ->where('type', SalaryComponentType::Deduction)
            ->pluck('id');

        $earnings = '0.00';
        $deductions = '0.00';

        foreach ($amounts as $component) {
            if ($deductionComponentIds->contains((int) $component['salary_component_id'])) {
                $deductions = bcadd($deductions, (string) $component['amount'], 2);
            } else {
                $earnings = bcadd($earnings, (string) $component['amount'], 2);
            }
        }

        if (bccomp($earnings, '0', 2) !== 1) {
            $validator->errors()->add('components', 'Enter an amount for at least one earning component.');

            return;
        }

        if (bccomp($deductions, $earnings, 2) === 1) {
            $validator->errors()->add('components', 'Salary deductions cannot exceed the earnings.');
        }
    }
}
