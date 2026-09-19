<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>@yield('title')</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #333; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h1 { font-size: 18px; margin-bottom: 4px; }
        .header h2 { font-size: 14px; font-weight: normal; color: #666; }
        .header .date { font-size: 10px; color: #999; margin-top: 4px; }
        .filters { font-size: 10px; color: #666; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th { background: #f5f5f5; border: 1px solid #ddd; padding: 6px 8px; text-align: left; font-weight: bold; font-size: 10px; text-transform: uppercase; }
        td { border: 1px solid #ddd; padding: 5px 8px; font-size: 11px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .font-mono { font-family: DejaVu Sans Mono, monospace; }
        .section-header { background: #e8e8e8; font-weight: bold; font-size: 12px; }
        .total-row { background: #f0f0f0; font-weight: bold; }
        .grand-total { background: #333; color: #fff; font-weight: bold; font-size: 12px; }
        .text-green { color: #16a34a; }
        .text-red { color: #dc2626; }
        .footer { text-align: center; font-size: 9px; color: #999; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ config('app.name') }}</h1>
        <h2>@yield('title')</h2>
        <div class="date">Generated on {{ now()->format('d M Y, h:i A') }}</div>
    </div>

    @hasSection('filters')
        <div class="filters">@yield('filters')</div>
    @endif

    @yield('content')

    <div class="footer">
        This is a system-generated report.
    </div>
</body>
</html>
