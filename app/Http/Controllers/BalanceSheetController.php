<?php

namespace App\Http\Controllers;

use App\Enums\NormalBalance;
use App\Models\AccountHead;
use App\Models\JournalLine;
use App\Models\Project;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\SimpleExcel\SimpleExcelWriter;

class BalanceSheetController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('reports.financial'), 403);

        $data = $this->getReportData($request);

        return Inertia::render('reports/balance-sheet', array_merge($data, [
            'projects' => fn () => Project::select('id', 'name', 'code')
                ->orderBy('name')
                ->get(),
        ]));
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        abort_unless($request->user()->can('reports.financial'), 403);

        $data = $this->getReportData($request);
        $format = $request->input('format', 'pdf');

        if ($format === 'excel') {
            $path = tempnam(sys_get_temp_dir(), 'export').'.xlsx';
            $writer = SimpleExcelWriter::create($path);

            foreach ($data['assetAccounts'] as $row) {
                $writer->addRow(['Code' => $row['code'], 'Account' => $row['name'], 'Section' => 'Asset', 'Balance' => $row['balance']]);
            }

            $writer->addRow(['Code' => '', 'Account' => 'Total Assets', 'Section' => '', 'Balance' => $data['totalAssets']]);

            foreach ($data['liabilityAccounts'] as $row) {
                $writer->addRow(['Code' => $row['code'], 'Account' => $row['name'], 'Section' => 'Liability', 'Balance' => $row['balance']]);
            }

            $writer->addRow(['Code' => '', 'Account' => 'Total Liabilities', 'Section' => '', 'Balance' => $data['totalLiabilities']]);

            foreach ($data['equityAccounts'] as $row) {
                $writer->addRow(['Code' => $row['code'], 'Account' => $row['name'], 'Section' => 'Equity', 'Balance' => $row['balance']]);
            }

            $writer->addRow(['Code' => '', 'Account' => 'Total Equity', 'Section' => '', 'Balance' => $data['totalEquity']]);
            $writer->close();

            return response()->download($path, 'balance-sheet.xlsx')->deleteFileAfterSend(true);
        }

        $pdf = Pdf::loadView('reports.balance-sheet', $data);

        return $pdf->download('balance-sheet.pdf');
    }

    /**
     * @return array<string, mixed>
     */
    private function getReportData(Request $request): array
    {
        $totals = JournalLine::query()
            ->whereHas('journalEntry', fn ($q) => $q->posted()
                ->when($request->input('as_at_date'), fn ($q2, $d) => $q2->where('date', '<=', $d)))
            ->when($request->input('project_id'), fn ($q, $pid) => $q->where('project_id', $pid))
            ->selectRaw('account_head_id, SUM(debit) as total_debit, SUM(credit) as total_credit')
            ->groupBy('account_head_id')
            ->get()
            ->keyBy('account_head_id');

        $accounts = AccountHead::query()
            ->where('is_active', true)
            ->orderBy('code')
            ->get();

        $assetAccounts = [];
        $liabilityAccounts = [];
        $equityAccounts = [];
        $totalAssets = '0.00';
        $totalLiabilities = '0.00';
        $totalEquity = '0.00';

        // Calculate net profit from income and expense accounts
        $totalIncome = '0.00';
        $totalExpenses = '0.00';

        foreach ($accounts as $account) {
            $row = $totals->get($account->id);

            if (! $row) {
                continue;
            }

            $totalDebit = number_format((float) $row->total_debit, 2, '.', '');
            $totalCredit = number_format((float) $row->total_credit, 2, '.', '');

            if (bccomp($totalDebit, '0.00', 2) === 0 && bccomp($totalCredit, '0.00', 2) === 0) {
                continue;
            }

            if ($account->normal_balance === NormalBalance::Debit) {
                $balance = bcsub($totalDebit, $totalCredit, 2);
            } else {
                $balance = bcsub($totalCredit, $totalDebit, 2);
            }

            $type = $account->type->value;

            if ($type === 'income') {
                $totalIncome = bcadd($totalIncome, $balance, 2);

                continue;
            }

            if ($type === 'expense') {
                $totalExpenses = bcadd($totalExpenses, $balance, 2);

                continue;
            }

            $entry = [
                'id' => $account->id,
                'code' => $account->code,
                'name' => $account->name,
                'type' => $type,
                'balance' => $balance,
            ];

            match ($type) {
                'asset' => (function () use (&$assetAccounts, &$totalAssets, $entry, $balance) {
                    $assetAccounts[] = $entry;
                    $totalAssets = bcadd($totalAssets, $balance, 2);
                })(),
                'liability' => (function () use (&$liabilityAccounts, &$totalLiabilities, $entry, $balance) {
                    $liabilityAccounts[] = $entry;
                    $totalLiabilities = bcadd($totalLiabilities, $balance, 2);
                })(),
                'equity' => (function () use (&$equityAccounts, &$totalEquity, $entry, $balance) {
                    // Net profit is added to Retained Earnings when rendering
                    $equityAccounts[] = $entry;
                    $totalEquity = bcadd($totalEquity, $balance, 2);
                })(),
                default => null,
            };
        }

        $netProfit = bcsub($totalIncome, $totalExpenses, 2);

        // Roll net profit into retained earnings (code 3002)
        $retainedEarningsFound = false;

        foreach ($equityAccounts as &$eq) {
            if ($eq['code'] === '3002') {
                $eq['balance'] = bcadd($eq['balance'], $netProfit, 2);
                $retainedEarningsFound = true;

                break;
            }
        }

        unset($eq);

        // If no retained earnings account had activity, add it with just net profit
        if (! $retainedEarningsFound && bccomp($netProfit, '0.00', 2) !== 0) {
            $retainedEarnings = AccountHead::where('code', '3002')->first();

            if ($retainedEarnings) {
                $equityAccounts[] = [
                    'id' => $retainedEarnings->id,
                    'code' => $retainedEarnings->code,
                    'name' => $retainedEarnings->name,
                    'type' => 'equity',
                    'balance' => $netProfit,
                ];
            }
        }

        $totalEquity = bcadd($totalEquity, $netProfit, 2);

        $totalLiabilitiesAndEquity = bcadd($totalLiabilities, $totalEquity, 2);
        $isBalanced = bccomp($totalAssets, $totalLiabilitiesAndEquity, 2) === 0;

        return [
            'assetAccounts' => $assetAccounts,
            'liabilityAccounts' => $liabilityAccounts,
            'equityAccounts' => array_values($equityAccounts),
            'totalAssets' => $totalAssets,
            'totalLiabilities' => $totalLiabilities,
            'totalEquity' => $totalEquity,
            'isBalanced' => $isBalanced,
            'netProfit' => $netProfit,
        ];
    }
}
