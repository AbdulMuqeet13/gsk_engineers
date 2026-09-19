@extends('reports.layout')

@section('title', 'Payroll Report')

@section('content')
<p style="margin-bottom: 10px;">
    <strong>Total Runs:</strong> {{ $totalRuns }} |
    <strong>Total Employees:</strong> {{ $totalEmployees }} |
    <strong>Total Disbursed:</strong> {{ number_format((float)$totalDisbursed, 2) }}
</p>

@foreach($runs as $run)
<table style="margin-bottom: 15px;">
    <thead>
        <tr class="section-header">
            <td colspan="7">{{ $run['reference'] }} — {{ $run['period_start'] }} to {{ $run['period_end'] }} — Total: {{ number_format((float)$run['total_amount'], 2) }}</td>
        </tr>
        <tr>
            <th>Employee</th>
            <th>Designation</th>
            <th class="text-right">Days Worked</th>
            <th class="text-right">Absent</th>
            <th class="text-right">Basic Salary</th>
            <th class="text-right">Deductions</th>
            <th class="text-right">Net Salary</th>
        </tr>
    </thead>
    <tbody>
        @foreach($run['payslips'] as $slip)
            <tr>
                <td>{{ $slip['employee_name'] }}</td>
                <td>{{ $slip['designation'] }}</td>
                <td class="text-right">{{ $slip['days_worked'] }}</td>
                <td class="text-right">{{ $slip['days_absent'] }}</td>
                <td class="text-right font-mono">{{ number_format((float)$slip['basic_salary'], 2) }}</td>
                <td class="text-right font-mono text-red">{{ number_format((float)$slip['deductions'], 2) }}</td>
                <td class="text-right font-mono font-bold">{{ number_format((float)$slip['net_salary'], 2) }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
@endforeach

@if(count($runs) === 0)
    <p class="text-center">No approved payroll runs found.</p>
@endif
@endsection
