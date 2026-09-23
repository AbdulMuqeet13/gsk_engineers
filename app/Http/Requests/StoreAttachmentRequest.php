<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Exists;

class StoreAttachmentRequest extends FormRequest
{
    /** @var array<string, string> */
    private const PERMISSION_MAP = [
        'expense' => 'expenses.create',
        'employee' => 'employees.create',
        'project' => 'projects.create',
        'journal_entry' => 'accounting.create',
    ];

    /** @var array<string, string> */
    private const TABLE_MAP = [
        'expense' => 'expenses',
        'employee' => 'employees',
        'project' => 'projects',
        'journal_entry' => 'journal_entries',
    ];

    public function authorize(): bool
    {
        $type = $this->input('attachable_type');
        $permission = self::PERMISSION_MAP[$type] ?? null;

        if ($permission === null) {
            return true; // Let validation reject unknown types
        }

        return $this->user()->can($permission);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'max:10240', 'mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx'],
            'attachable_type' => ['required', 'string', Rule::in(['expense', 'employee', 'project', 'journal_entry'])],
            'attachable_id' => ['required', 'integer', $this->attachableExistsRule()],
        ];
    }

    private function attachableExistsRule(): Exists
    {
        $type = $this->input('attachable_type');
        $table = self::TABLE_MAP[$type] ?? 'expenses';

        return Rule::exists($table, 'id');
    }
}
