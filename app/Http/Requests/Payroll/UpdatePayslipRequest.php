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
                $totalDeductions = bcadd(bcadd((string) $this->input('tax_amount'), (string) $this->input('security_amount'), 2), (string) $this->input('deductions'), 2);

                if (bccomp($totalDeductions, $gross, 2) === 1) {
                    $validator->errors()->add('deductions', 'Total deductions cannot exceed the gross salary.');
                }
            },
        ];
    }
}
