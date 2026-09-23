@extends('reports.layout')

@section('title', 'Project Ledger — ' . $project->code)

@section('filters')
    <strong>Project:</strong> {{ $project->code }} — {{ $project->name }}
@endsection

@section('content')
<table>
    <thead>
        <tr>
            <th>Date</th>
            <th>Reference</th>
            <th>Description</th>
            <th>Account</th>
            <th>Type</th>
            <th class="text-right">Debit</th>
            <th class="text-right">Credit</th>
            @if($hasAccountFilter)
                <th class="text-right">Balance</th>
            @endif
        </tr>
    </thead>
    <tbody>
        @forelse($rows as $row)
            <tr>
                <td>{{ $row['date'] }}</td>
                <td class="font-mono">{{ $row['reference'] }}</td>
                <td>{{ $row['description'] }}</td>
                <td>{{ $row['account']['code'] }} - {{ $row['account']['name'] }}</td>
                <td>{{ ucfirst($row['account']['type']) }}</td>
                <td class="text-right font-mono">{{ (float)$row['debit'] > 0 ? number_format((float)$row['debit'], 2) : '' }}</td>
                <td class="text-right font-mono">{{ (float)$row['credit'] > 0 ? number_format((float)$row['credit'], 2) : '' }}</td>
                @if($hasAccountFilter)
                    <td class="text-right font-mono font-bold">{{ $row['balance'] !== null ? number_format((float)$row['balance'], 2) : '—' }}</td>
                @endif
            </tr>
        @empty
            <tr><td colspan="{{ $hasAccountFilter ? 8 : 7 }}" class="text-center">No transactions found.</td></tr>
        @endforelse
    </tbody>
    <tfoot>
        <tr class="grand-total">
            <td colspan="5" class="text-right">Totals</td>
            <td class="text-right font-mono">{{ number_format((float)$totalDebit, 2) }}</td>
            <td class="text-right font-mono">{{ number_format((float)$totalCredit, 2) }}</td>
            @if($hasAccountFilter)
                <td></td>
            @endif
        </tr>
    </tfoot>
</table>
@endsection
