<?php

namespace App\Http\Requests\Employees;

use App\Concerns\SalaryValidationRules;
use App\Enums\EmployeeType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreEmployeeRequest extends FormRequest
{
    use SalaryValidationRules;

    public function authorize(): bool
    {
        return $this->user()->can('employees.create');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', 'unique:employees,email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'type' => ['required', Rule::enum(EmployeeType::class)],
            'project_id' => ['nullable', 'integer', Rule::exists('projects', 'id'), 'required_if:type,project', 'prohibited_if:type,internal'],
            'designation' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:255'],
            'date_of_joining' => ['required', 'date'],
            'cnic' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:1000'],
            'is_active' => ['boolean'],
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
