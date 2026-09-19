@extends('reports.layout')

@section('title', 'Profit & Loss')

@section('content')
<table>
    <thead>
        <tr>
            <th>Code</th>
            <th>Account Name</th>
            <th class="text-right">Amount</th>
        </tr>
    </thead>
    <tbody>
        <tr class="section-header">
            <td colspan="3">Income</td>
        </tr>
        @forelse($incomeAccounts as $account)
            <tr>
                <td class="font-mono">{{ $account['code'] }}</td>
                <td>{{ $account['name'] }}</td>
                <td class="text-right font-mono">{{ number_format((float)$account['balance'], 2) }}</td>
            </tr>
        @empty
            <tr><td colspan="3" class="text-center">No income accounts.</td></tr>
        @endforelse
        <tr class="total-row">
            <td colspan="2" class="text-right">Total Income</td>
            <td class="text-right font-mono">{{ number_format((float)$totalIncome, 2) }}</td>
        </tr>

        <tr class="section-header">
            <td colspan="3">Expenses</td>
        </tr>
        @forelse($expenseAccounts as $account)
            <tr>
                <td class="font-mono">{{ $account['code'] }}</td>
                <td>{{ $account['name'] }}</td>
                <td class="text-right font-mono">{{ number_format((float)$account['balance'], 2) }}</td>
            </tr>
        @empty
            <tr><td colspan="3" class="text-center">No expense accounts.</td></tr>
        @endforelse
        <tr class="total-row">
            <td colspan="2" class="text-right">Total Expenses</td>
            <td class="text-right font-mono">{{ number_format((float)$totalExpenses, 2) }}</td>
        </tr>
    </tbody>
    <tfoot>
        <tr class="grand-total">
            <td colspan="2" class="text-right">{{ (float)$netProfit < 0 ? 'Net Loss' : 'Net Profit' }}</td>
            <td class="text-right font-mono">{{ number_format((float)$netProfit, 2) }}</td>
        </tr>
    </tfoot>
</table>
@endsection
