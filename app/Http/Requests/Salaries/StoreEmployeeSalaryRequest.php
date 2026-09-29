<?php

namespace App\Http\Requests\Salaries;

use App\Concerns\SalaryValidationRules;
use App\Enums\SalaryChangeType;
use App\Models\Employee;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreEmployeeSalaryRequest extends FormRequest
{
    use SalaryValidationRules;

    public function authorize(): bool
    {
        /** @var Employee $employee */
        $employee = $this->route('employee');

        return $this->user()->can('update', $employee);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'effective_date' => ['required', 'date'],
            'change_type' => ['required', Rule::enum(SalaryChangeType::class)->except([SalaryChangeType::Initial])],
            'remarks' => ['nullable', 'string', 'max:500'],
            ...$this->salaryBreakdownRules(),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return $this->salaryBreakdownAttributes();
    }

    /**
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                if (! $validator->errors()->has('components') && ! $this->componentsTotalIsPositive()) {
                    $validator->errors()->add('components', 'Enter an amount for at least one salary component.');
                }
            },
        ];
    }
}
