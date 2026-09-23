@extends('reports.layout')

@section('title', 'Project Cashbook — ' . $project->code)

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
            <th class="text-right">Money In</th>
            <th class="text-right">Money Out</th>
            <th class="text-right">Balance</th>
        </tr>
    </thead>
    <tbody>
        <tr class="total-row">
            <td colspan="4" class="text-right">Opening Balance</td>
            <td></td>
            <td></td>
            <td class="text-right font-mono">{{ number_format((float)$summary['openingBalance'], 2) }}</td>
        </tr>
        @forelse($rows as $row)
            <tr>
                <td>{{ $row['date'] }}</td>
                <td class="font-mono">{{ $row['reference'] }}</td>
                <td>{{ $row['description'] }}</td>
                <td>{{ $row['account']['code'] }} - {{ $row['account']['name'] }}</td>
                <td class="text-right font-mono text-green">{{ (float)$row['money_in'] > 0 ? number_format((float)$row['money_in'], 2) : '' }}</td>
                <td class="text-right font-mono text-red">{{ (float)$row['money_out'] > 0 ? number_format((float)$row['money_out'], 2) : '' }}</td>
                <td class="text-right font-mono font-bold">{{ number_format((float)$row['balance'], 2) }}</td>
            </tr>
        @empty
            <tr><td colspan="7" class="text-center">No cash transactions found.</td></tr>
        @endforelse
    </tbody>
    <tfoot>
        <tr class="total-row">
            <td colspan="4" class="text-right">Totals</td>
            <td class="text-right font-mono text-green">{{ number_format((float)$summary['totalIn'], 2) }}</td>
            <td class="text-right font-mono text-red">{{ number_format((float)$summary['totalOut'], 2) }}</td>
            <td class="text-right font-mono font-bold">{{ number_format((float)$summary['closingBalance'], 2) }}</td>
        </tr>
    </tfoot>
</table>
@endsection
