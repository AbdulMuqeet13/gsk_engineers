<?php

namespace App\Http\Controllers;

use App\Enums\NormalBalance;
use App\Models\AccountHead;
use App\Models\JournalEntry;
use App\Models\JournalLine;
use App\Models\Project;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\SimpleExcel\SimpleExcelWriter;

class TrialBalanceController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', JournalEntry::class);

        $data = $this->getReportData($request);

        return Inertia::render('accounting/trial-balance/index', array_merge($data, [
            'projects' => Inertia::optional(fn () => Project::select('id', 'name', 'code')
                ->orderBy('name')
                ->get()),
        ]));
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        $this->authorize('viewAny', JournalEntry::class);

        $data = $this->getReportData($request);
        $format = $request->input('format', 'pdf');

        if ($format === 'excel') {
            $path = tempnam(sys_get_temp_dir(), 'export').'.xlsx';
            $writer = SimpleExcelWriter::create($path);

            foreach ($data['accounts'] as $row) {
                $writer->addRow([
                    'Code' => $row['code'],
                    'Account' => $row['name'],
                    'Type' => ucfirst($row['type']),
                    'Total Debit' => $row['total_debit'],
                    'Total Credit' => $row['total_credit'],
                    'Balance' => $row['balance'],
                ]);
            }

            $writer->addRow([
                'Code' => '',
                'Account' => 'Grand Total',
                'Type' => '',
                'Total Debit' => $data['grandTotalDebit'],
                'Total Credit' => $data['grandTotalCredit'],
                'Balance' => '',
            ]);
            $writer->close();

            return response()->download($path, 'trial-balance.xlsx')->deleteFileAfterSend(true);
        }

        $pdf = Pdf::loadView('reports.trial-balance', $data);

        return $pdf->download('trial-balance.pdf');
    }

    /**
     * @return array<string, mixed>
     */
    private function getReportData(Request $request): array
    {
        $totals = JournalLine::query()
            ->whereHas('journalEntry', fn ($q) => $q->posted()
                ->when($request->input('date_from'), fn ($q2, $d) => $q2->where('date', '>=', $d))
                ->when($request->input('date_to'), fn ($q2, $d) => $q2->where('date', '<=', $d)))
            ->when($request->input('project_id'), fn ($q, $pid) => $q->where('project_id', $pid))
            ->selectRaw('account_head_id, SUM(debit) as total_debit, SUM(credit) as total_credit')
            ->groupBy('account_head_id')
            ->get()
            ->keyBy('account_head_id');

        $accounts = AccountHead::query()
            ->where('is_active', true)
            ->orderBy('code')
            ->get()
            ->map(function ($account) use ($totals) {
                $row = $totals->get($account->id);
                $totalDebit = $row ? number_format((float) $row->total_debit, 2, '.', '') : '0.00';
                $totalCredit = $row ? number_format((float) $row->total_credit, 2, '.', '') : '0.00';

                if ($account->normal_balance === NormalBalance::Debit) {
                    $balance = bcsub($totalDebit, $totalCredit, 2);
                } else {
                    $balance = bcsub($totalCredit, $totalDebit, 2);
                }

                return [
                    'id' => $account->id,
                    'code' => $account->code,
                    'name' => $account->name,
                    'type' => $account->type->value,
                    'normal_balance' => $account->normal_balance->value,
                    'total_debit' => $totalDebit,
                    'total_credit' => $totalCredit,
                    'balance' => $balance,
                ];
            })
            ->filter(fn ($a) => bccomp($a['total_debit'], '0.00', 2) !== 0 || bccomp($a['total_credit'], '0.00', 2) !== 0);

        $grandTotalDebit = '0.00';
        $grandTotalCredit = '0.00';

        foreach ($accounts as $account) {
            $grandTotalDebit = bcadd($grandTotalDebit, $account['total_debit'], 2);
            $grandTotalCredit = bcadd($grandTotalCredit, $account['total_credit'], 2);
        }

        $isBalanced = bccomp($grandTotalDebit, $grandTotalCredit, 2) === 0;

        return [
            'accounts' => $accounts->values(),
            'grandTotalDebit' => $grandTotalDebit,
            'grandTotalCredit' => $grandTotalCredit,
            'isBalanced' => $isBalanced,
        ];
    }
}
