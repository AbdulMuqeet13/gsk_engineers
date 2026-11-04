<?php

namespace App\Http\Requests\Salaries;

use App\Enums\SalaryComponentType;
use App\Models\SalaryComponent;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateSalaryComponentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('payroll.run');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100', Rule::unique('salary_components', 'name')->ignore($this->route('salary_component'))],
            'type' => ['required', Rule::enum(SalaryComponentType::class)],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * Salary records already store amounts against this component, so its
     * type cannot change once used (it would alter their gross and deductions).
     *
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                /** @var SalaryComponent $salaryComponent */
                $salaryComponent = $this->route('salary_component');

                if (
                    ! $validator->errors()->has('type')
                    && $this->input('type') !== $salaryComponent->type->value
                    && $salaryComponent->employeeSalaryComponents()->exists()
                ) {
                    $validator->errors()->add('type', 'The type cannot be changed because salary records already use this component.');
                }
            },
        ];
    }
}
