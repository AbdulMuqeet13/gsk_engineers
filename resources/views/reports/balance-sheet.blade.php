@extends('reports.layout')

@section('title', 'Balance Sheet')

@section('content')
<table>
    <thead>
        <tr>
            <th>Code</th>
            <th>Account Name</th>
            <th class="text-right">Balance</th>
        </tr>
    </thead>
    <tbody>
        <tr class="section-header"><td colspan="3">Assets</td></tr>
        @foreach($assetAccounts as $account)
            <tr>
                <td class="font-mono">{{ $account['code'] }}</td>
                <td>{{ $account['name'] }}</td>
                <td class="text-right font-mono">{{ number_format((float)$account['balance'], 2) }}</td>
            </tr>
        @endforeach
        <tr class="total-row">
            <td colspan="2" class="text-right">Total Assets</td>
            <td class="text-right font-mono">{{ number_format((float)$totalAssets, 2) }}</td>
        </tr>

        <tr class="section-header"><td colspan="3">Liabilities</td></tr>
        @forelse($liabilityAccounts as $account)
            <tr>
                <td class="font-mono">{{ $account['code'] }}</td>
                <td>{{ $account['name'] }}</td>
                <td class="text-right font-mono">{{ number_format((float)$account['balance'], 2) }}</td>
            </tr>
        @empty
            <tr><td colspan="3" class="text-center">No liability accounts.</td></tr>
        @endforelse
        <tr class="total-row">
            <td colspan="2" class="text-right">Total Liabilities</td>
            <td class="text-right font-mono">{{ number_format((float)$totalLiabilities, 2) }}</td>
        </tr>

        <tr class="section-header"><td colspan="3">Equity</td></tr>
        @foreach($equityAccounts as $account)
            <tr>
                <td class="font-mono">{{ $account['code'] }}</td>
                <td>{{ $account['name'] }}</td>
                <td class="text-right font-mono">{{ number_format((float)$account['balance'], 2) }}</td>
            </tr>
        @endforeach
        <tr class="total-row">
            <td colspan="2" class="text-right">Total Equity</td>
            <td class="text-right font-mono">{{ number_format((float)$totalEquity, 2) }}</td>
        </tr>
    </tbody>
    <tfoot>
        <tr class="grand-total">
            <td colspan="2" class="text-right">Total Liabilities + Equity</td>
            <td class="text-right font-mono">{{ number_format((float)$totalLiabilities + (float)$totalEquity, 2) }}</td>
        </tr>
    </tfoot>
</table>
@endsection
