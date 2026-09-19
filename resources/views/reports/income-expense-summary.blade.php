@extends('reports.layout')

@section('title', 'Income & Expense Summary')

@section('content')
@if($groupBy === 'category')
<table>
    <thead>
        <tr>
            <th>Code</th>
            <th>Account Name</th>
            <th>Type</th>
            <th class="text-right">Amount</th>
        </tr>
    </thead>
    <tbody>
        @forelse($rows as $row)
            <tr>
                <td class="font-mono">{{ $row['code'] }}</td>
                <td>{{ $row['name'] }}</td>
                <td>{{ ucfirst($row['type']) }}</td>
                <td class="text-right font-mono">{{ number_format((float)$row['balance'], 2) }}</td>
            </tr>
        @empty
            <tr><td colspan="4" class="text-center">No transactions found.</td></tr>
        @endforelse
    </tbody>
    <tfoot>
        <tr class="total-row">
            <td colspan="3" class="text-right">Total Income</td>
            <td class="text-right font-mono text-green">{{ number_format((float)$totalIncome, 2) }}</td>
        </tr>
        <tr class="total-row">
            <td colspan="3" class="text-right">Total Expenses</td>
            <td class="text-right font-mono text-red">{{ number_format((float)$totalExpenses, 2) }}</td>
        </tr>
        <tr class="grand-total">
            <td colspan="3" class="text-right">Net Profit</td>
            <td class="text-right font-mono">{{ number_format((float)$netProfit, 2) }}</td>
        </tr>
    </tfoot>
</table>
@else
<table>
    <thead>
        <tr>
            <th>Project Code</th>
            <th>Project Name</th>
            <th class="text-right">Income</th>
            <th class="text-right">Expenses</th>
            <th class="text-right">Net</th>
        </tr>
    </thead>
    <tbody>
        @forelse($rows as $row)
            <tr>
                <td class="font-mono">{{ $row['project_code'] }}</td>
                <td>{{ $row['project_name'] }}</td>
                <td class="text-right font-mono text-green">{{ number_format((float)$row['total_income'], 2) }}</td>
                <td class="text-right font-mono text-red">{{ number_format((float)$row['total_expenses'], 2) }}</td>
                <td class="text-right font-mono font-bold">{{ number_format((float)$row['net'], 2) }}</td>
            </tr>
        @empty
            <tr><td colspan="5" class="text-center">No project transactions found.</td></tr>
        @endforelse
    </tbody>
    <tfoot>
        <tr class="grand-total">
            <td colspan="2" class="text-right">Totals</td>
            <td class="text-right font-mono">{{ number_format((float)$totalIncome, 2) }}</td>
            <td class="text-right font-mono">{{ number_format((float)$totalExpenses, 2) }}</td>
            <td class="text-right font-mono">{{ number_format((float)$netProfit, 2) }}</td>
        </tr>
    </tfoot>
</table>
@endif
@endsection
