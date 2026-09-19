<?php

namespace App\Http\Requests\Employees;

use App\Enums\EmployeeType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('employees.update');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('employees', 'email')->ignore($this->route('employee'))],
            'phone' => ['nullable', 'string', 'max:50'],
            'type' => ['required', Rule::enum(EmployeeType::class)],
            'project_id' => ['nullable', 'integer', Rule::exists('projects', 'id'), 'required_if:type,project', 'prohibited_if:type,internal'],
            'designation' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:255'],
            'date_of_joining' => ['required', 'date'],
            'salary' => ['required', 'numeric', 'min:0'],
            'cnic' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:1000'],
            'is_active' => ['boolean'],
        ];
    }
}
