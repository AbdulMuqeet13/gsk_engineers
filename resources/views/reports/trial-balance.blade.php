@extends('reports.layout')

@section('title', 'Trial Balance')

@section('content')
<table>
    <thead>
        <tr>
            <th>Code</th>
            <th>Account Name</th>
            <th>Type</th>
            <th class="text-right">Total Debit</th>
            <th class="text-right">Total Credit</th>
            <th class="text-right">Balance</th>
        </tr>
    </thead>
    <tbody>
        @foreach($accounts as $account)
            <tr>
                <td class="font-mono">{{ $account['code'] }}</td>
                <td>{{ $account['name'] }}</td>
                <td>{{ ucfirst($account['type']) }}</td>
                <td class="text-right font-mono">{{ number_format((float)$account['total_debit'], 2) }}</td>
                <td class="text-right font-mono">{{ number_format((float)$account['total_credit'], 2) }}</td>
                <td class="text-right font-mono font-bold">{{ number_format((float)$account['balance'], 2) }}</td>
            </tr>
        @endforeach
    </tbody>
    <tfoot>
        <tr class="grand-total">
            <td colspan="3" class="text-right">Grand Total</td>
            <td class="text-right font-mono">{{ number_format((float)$grandTotalDebit, 2) }}</td>
            <td class="text-right font-mono">{{ number_format((float)$grandTotalCredit, 2) }}</td>
            <td></td>
        </tr>
    </tfoot>
</table>
@endsection
