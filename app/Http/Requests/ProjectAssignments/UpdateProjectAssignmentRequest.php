<?php

namespace App\Http\Requests\ProjectAssignments;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('projects.assign');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'employee_id' => [
                'required',
                'integer',
                Rule::exists('employees', 'id'),
                Rule::unique('project_assignments')
                    ->where('project_id', $this->input('project_id'))
                    ->ignore($this->route('assignment')),
            ],
            'project_id' => ['required', 'integer', Rule::exists('projects', 'id')],
            'role' => ['required', 'string', 'max:255'],
            'allocation_percent' => ['required', 'numeric', 'min:0', 'max:100'],
        ];
    }
}
