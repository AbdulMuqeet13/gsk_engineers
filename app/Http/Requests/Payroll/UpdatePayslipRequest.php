<?php

namespace App\Http\Requests\Payroll;

use App\Models\Payslip;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdatePayslipRequest extends FormRequest
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
            'tax_amount' => ['required', 'numeric', 'min:0', 'decimal:0,2'],
            'security_amount' => ['required', 'numeric', 'min:0', 'decimal:0,2'],
            'deductions' => ['required', 'numeric', 'min:0', 'decimal:0,2'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                /** @var Payslip $payslip */
                $payslip = $this->route('payslip');
                $gross = $payslip->getRawOriginal('gross_salary') ?? $payslip->gross_salary;
                $totalDeductions = array_reduce([
                    (string) $this->input('tax_amount'),
                    (string) $this->input('security_amount'),
                    $payslip->getRawOriginal('component_deductions') ?? $payslip->component_deductions,
                    (string) $this->input('deductions'),
                ], fn (string $total, string $amount) => bcadd($total, $amount, 2), '0.00');

                if (bccomp($totalDeductions, $gross, 2) === 1) {
                    $validator->errors()->add('deductions', 'Total deductions cannot exceed the gross salary.');
                }
            },
        ];
    }
}
