@extends('reports.layout')

@section('title', 'Inter-Project Position')

@section('content')
<table>
    <thead>
        <tr>
            <th>Project A</th>
            <th>Project B</th>
            <th class="text-right">A sent to B</th>
            <th class="text-right">B sent to A</th>
            <th class="text-right">Net (A owes B)</th>
        </tr>
    </thead>
    <tbody>
        @forelse($positions as $position)
            <tr>
                <td>{{ $position['project_a']['code'] }} - {{ $position['project_a']['name'] }}</td>
                <td>{{ $position['project_b']['code'] }} - {{ $position['project_b']['name'] }}</td>
                <td class="text-right font-mono">{{ number_format((float)$position['a_to_b'], 2) }}</td>
                <td class="text-right font-mono">{{ number_format((float)$position['b_to_a'], 2) }}</td>
                <td class="text-right font-mono font-bold {{ (float)$position['net'] > 0 ? 'text-green' : ((float)$position['net'] < 0 ? 'text-red' : '') }}">{{ number_format((float)$position['net'], 2) }}</td>
            </tr>
        @empty
            <tr><td colspan="5" class="text-center">No inter-project transfers found.</td></tr>
        @endforelse
    </tbody>
</table>
@endsection
