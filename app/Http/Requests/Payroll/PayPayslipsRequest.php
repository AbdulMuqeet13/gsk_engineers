<?php

namespace App\Http\Requests\Payroll;

use App\Models\PayrollRun;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PayPayslipsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('payroll.approve');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var PayrollRun $run */
        $run = $this->route('payroll_run');

        return [
            'payslip_ids' => ['required', 'array', 'min:1'],
            'payslip_ids.*' => ['integer', 'distinct', Rule::exists('payslips', 'id')->where('payroll_run_id', $run->id)],
            'payment_account_id' => ['required', 'integer', Rule::exists('account_heads', 'id')->where('type', 'asset')->where('is_active', true)],
            'paid_at' => array_filter([
                'required',
                'date',
                'before_or_equal:today',
                $run->approved_at !== null ? 'after_or_equal:'.$run->approved_at->toDateString() : null,
            ]),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'paid_at.after_or_equal' => 'The payment date cannot be before the payroll approval date.',
            'payslip_ids.*.exists' => 'The selected payslip does not belong to this payroll run.',
        ];
    }
}
