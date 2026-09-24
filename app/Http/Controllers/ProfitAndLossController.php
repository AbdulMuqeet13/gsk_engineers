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

class ProfitAndLossController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('reports.financial'), 403);

        $data = $this->getReportData($request);

        return Inertia::render('reports/profit-and-loss', array_merge($data, [
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

            foreach ($data['incomeAccounts'] as $row) {
                $writer->addRow(['Code' => $row['code'], 'Account' => $row['name'], 'Type' => 'Income', 'Balance' => $row['balance']]);
            }

            foreach ($data['expenseAccounts'] as $row) {
                $writer->addRow(['Code' => $row['code'], 'Account' => $row['name'], 'Type' => 'Expense', 'Balance' => $row['balance']]);
            }

            $writer->addRow(['Code' => '', 'Account' => 'Total Income', 'Type' => '', 'Balance' => $data['totalIncome']]);
            $writer->addRow(['Code' => '', 'Account' => 'Total Expenses', 'Type' => '', 'Balance' => $data['totalExpenses']]);
            $writer->addRow(['Code' => '', 'Account' => 'Net Profit', 'Type' => '', 'Balance' => $data['netProfit']]);
            $writer->close();

            return response()->download($path, 'profit-and-loss.xlsx')->deleteFileAfterSend(true);
        }

        $pdf = Pdf::loadView('reports.profit-and-loss', $data);

        return $pdf->download('profit-and-loss.pdf');
    }

    /**
     * @return array{incomeAccounts: list<array<string, mixed>>, expenseAccounts: list<array<string, mixed>>, totalIncome: string, totalExpenses: string, netProfit: string}
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
            ->whereIn('type', ['income', 'expense'])
            ->orderBy('code')
            ->get();

        $incomeAccounts = [];
        $expenseAccounts = [];
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

            if ($account->normal_balance === NormalBalance::Credit) {
                $balance = bcsub($totalCredit, $totalDebit, 2);
            } else {
                $balance = bcsub($totalDebit, $totalCredit, 2);
            }

            $entry = [
                'id' => $account->id,
                'code' => $account->code,
                'name' => $account->name,
                'type' => $account->type->value,
                'balance' => $balance,
            ];

            if ($account->type->value === 'income') {
                $incomeAccounts[] = $entry;
                $totalIncome = bcadd($totalIncome, $balance, 2);
            } else {
                $expenseAccounts[] = $entry;
                $totalExpenses = bcadd($totalExpenses, $balance, 2);
            }
        }

        $netProfit = bcsub($totalIncome, $totalExpenses, 2);

        return [
            'incomeAccounts' => $incomeAccounts,
            'expenseAccounts' => $expenseAccounts,
            'totalIncome' => $totalIncome,
            'totalExpenses' => $totalExpenses,
            'netProfit' => $netProfit,
        ];
    }
}
