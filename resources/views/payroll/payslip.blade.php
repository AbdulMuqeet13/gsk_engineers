@extends('reports.layout')

@section('title', 'Salary Slip')

@section('filters')
    <strong>Period:</strong> {{ $payrollRun->period_start->format('d-m-Y') }} &ndash; {{ $payrollRun->period_end->format('d-m-Y') }}
    &nbsp;|&nbsp;
    <strong>Ref:</strong> {{ $payrollRun->reference }}
@endsection

@section('content')
    <table style="margin-bottom: 20px;">
        <tr>
            <td style="border: none; padding: 4px 8px;"><strong>Employee Name:</strong></td>
            <td style="border: none; padding: 4px 8px;">{{ $employee->name }}</td>
            <td style="border: none; padding: 4px 8px;"><strong>Designation:</strong></td>
            <td style="border: none; padding: 4px 8px;">{{ $employee->designation }}</td>
        </tr>
        <tr>
            <td style="border: none; padding: 4px 8px;"><strong>Department:</strong></td>
            <td style="border: none; padding: 4px 8px;">{{ $employee->department }}</td>
            <td style="border: none; padding: 4px 8px;"><strong>Employee ID:</strong></td>
            <td style="border: none; padding: 4px 8px;">{{ $employee->id }}</td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th class="text-right">Amount (PKR)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="2"><strong>Earnings</strong></td>
            </tr>
            @forelse($payslip->items as $item)
                <tr>
                    <td>
                        {{ $item->name }}
                        @if($item->project)
                            <span style="color: #666;">({{ $item->project->code }})</span>
                        @endif
                    </td>
                    <td class="text-right font-mono">{{ number_format((float) $item->amount, 2) }}</td>
                </tr>
            @empty
                <tr>
                    <td>Salary</td>
                    <td class="text-right font-mono">{{ number_format((float) $payslip->salary_amount, 2) }}</td>
                </tr>
            @endforelse
            <tr>
                <td><strong>Gross Salary</strong></td>
                <td class="text-right font-mono"><strong>{{ number_format((float) $payslip->gross_salary, 2) }}</strong></td>
            </tr>
            <tr>
                <td colspan="2"><strong>Deductions</strong></td>
            </tr>
            <tr>
                <td>Income Tax</td>
                <td class="text-right font-mono text-red">{{ number_format((float) $payslip->tax_amount, 2) }}</td>
            </tr>
            <tr>
                <td>Security Deposit</td>
                <td class="text-right font-mono text-red">{{ number_format((float) $payslip->security_amount, 2) }}</td>
            </tr>
            <tr>
                <td>Other Deductions</td>
                <td class="text-right font-mono text-red">{{ number_format((float) $payslip->deductions, 2) }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr class="grand-total">
                <td>Net Salary</td>
                <td class="text-right font-mono">{{ number_format((float) $payslip->net_salary, 2) }}</td>
            </tr>
        </tfoot>
    </table>

    <table style="margin-top: 15px;">
        <tr>
            <td style="border: none; padding: 4px 8px;"><strong>Days Worked:</strong></td>
            <td style="border: none; padding: 4px 8px;">{{ $payslip->days_worked }}</td>
            <td style="border: none; padding: 4px 8px;"><strong>Days Absent:</strong></td>
            <td style="border: none; padding: 4px 8px;">{{ $payslip->days_absent }}</td>
        </tr>
    </table>

    @if($payslip->notes)
        <div style="margin-top: 15px; padding: 8px; background: #f5f5f5; border: 1px solid #ddd;">
            <strong>Notes:</strong> {{ $payslip->notes }}
        </div>
    @endif
@endsection
