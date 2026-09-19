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

class IncomeExpenseSummaryController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('reports.financial'), 403);

        $groupBy = $request->input('group_by', 'category');

        if ($groupBy === 'project') {
            $data = $this->getByProject($request);
        } else {
            $data = $this->getByCategory($request);
        }

        return Inertia::render('reports/income-expense-summary', array_merge($data, [
            'groupBy' => $groupBy,
            'projects' => Inertia::optional(fn () => Project::select('id', 'name', 'code')
                ->orderBy('name')
                ->get()),
        ]));
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        abort_unless($request->user()->can('reports.financial'), 403);

        $groupBy = $request->input('group_by', 'category');

        if ($groupBy === 'project') {
            $data = $this->getByProject($request);
        } else {
            $data = $this->getByCategory($request);
        }

        $format = $request->input('format', 'pdf');

        if ($format === 'excel') {
            $path = tempnam(sys_get_temp_dir(), 'export').'.xlsx';
            $writer = SimpleExcelWriter::create($path);

            if ($groupBy === 'category') {
                foreach ($data['rows'] as $row) {
                    $writer->addRow(['Code' => $row['code'], 'Account' => $row['name'], 'Type' => ucfirst($row['type']), 'Amount' => $row['balance']]);
                }
            } else {
                foreach ($data['rows'] as $row) {
                    $writer->addRow(['Project Code' => $row['project_code'], 'Project' => $row['project_name'], 'Income' => $row['total_income'], 'Expenses' => $row['total_expenses'], 'Net' => $row['net']]);
                }
            }

            $writer->addRow($groupBy === 'category'
                ? ['Code' => '', 'Account' => 'Total Income', 'Type' => '', 'Amount' => $data['totalIncome']]
                : ['Project Code' => '', 'Project' => 'Total Income', 'Income' => $data['totalIncome'], 'Expenses' => '', 'Net' => '']);
            $writer->addRow($groupBy === 'category'
                ? ['Code' => '', 'Account' => 'Total Expenses', 'Type' => '', 'Amount' => $data['totalExpenses']]
                : ['Project Code' => '', 'Project' => 'Total Expenses', 'Income' => '', 'Expenses' => $data['totalExpenses'], 'Net' => '']);
            $writer->addRow($groupBy === 'category'
                ? ['Code' => '', 'Account' => 'Net Profit', 'Type' => '', 'Amount' => $data['netProfit']]
                : ['Project Code' => '', 'Project' => 'Net Profit', 'Income' => '', 'Expenses' => '', 'Net' => $data['netProfit']]);
            $writer->close();

            return response()->download($path, 'income-expense-summary.xlsx')->deleteFileAfterSend(true);
        }

        $pdf = Pdf::loadView('reports.income-expense-summary', array_merge($data, ['groupBy' => $groupBy]));

        return $pdf->download('income-expense-summary.pdf');
    }

    /**
     * @return array<string, mixed>
     */
    private function getByCategory(Request $request): array
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

        $rows = [];
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

            $rows[] = [
                'id' => $account->id,
                'code' => $account->code,
                'name' => $account->name,
                'type' => $account->type->value,
                'balance' => $balance,
            ];

            if ($account->type->value === 'income') {
                $totalIncome = bcadd($totalIncome, $balance, 2);
            } else {
                $totalExpenses = bcadd($totalExpenses, $balance, 2);
            }
        }

        return [
            'rows' => $rows,
            'totalIncome' => $totalIncome,
            'totalExpenses' => $totalExpenses,
            'netProfit' => bcsub($totalIncome, $totalExpenses, 2),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function getByProject(Request $request): array
    {
        $rawRows = JournalLine::query()
            ->whereHas('journalEntry', fn ($q) => $q->posted()
                ->when($request->input('date_from'), fn ($q2, $d) => $q2->where('date', '>=', $d))
                ->when($request->input('date_to'), fn ($q2, $d) => $q2->where('date', '<=', $d)))
            ->when($request->input('project_id'), fn ($q, $pid) => $q->where('project_id', $pid))
            ->whereNotNull('journal_lines.project_id')
            ->join('account_heads', 'journal_lines.account_head_id', '=', 'account_heads.id')
            ->join('projects', 'journal_lines.project_id', '=', 'projects.id')
            ->whereIn('account_heads.type', ['income', 'expense'])
            ->selectRaw('projects.id as project_id, projects.name as project_name, projects.code as project_code, account_heads.type, account_heads.normal_balance, SUM(journal_lines.debit) as total_debit, SUM(journal_lines.credit) as total_credit')
            ->groupBy('projects.id', 'projects.name', 'projects.code', 'account_heads.type', 'account_heads.normal_balance')
            ->get();

        $projects = [];
        $totalIncome = '0.00';
        $totalExpenses = '0.00';

        foreach ($rawRows as $row) {
            $id = $row->project_id;
            $totalDebit = number_format((float) $row->total_debit, 2, '.', '');
            $totalCredit = number_format((float) $row->total_credit, 2, '.', '');

            if ($row->normal_balance === 'debit') {
                $balance = bcsub($totalDebit, $totalCredit, 2);
            } else {
                $balance = bcsub($totalCredit, $totalDebit, 2);
            }

            if (! isset($projects[$id])) {
                $projects[$id] = [
                    'project_id' => $id,
                    'project_name' => $row->project_name,
                    'project_code' => $row->project_code,
                    'total_income' => '0.00',
                    'total_expenses' => '0.00',
                    'net' => '0.00',
                ];
            }

            if ($row->type === 'income') {
                $projects[$id]['total_income'] = bcadd($projects[$id]['total_income'], $balance, 2);
                $totalIncome = bcadd($totalIncome, $balance, 2);
            } elseif ($row->type === 'expense') {
                $projects[$id]['total_expenses'] = bcadd($projects[$id]['total_expenses'], $balance, 2);
                $totalExpenses = bcadd($totalExpenses, $balance, 2);
            }
        }

        foreach ($projects as &$p) {
            $p['net'] = bcsub($p['total_income'], $p['total_expenses'], 2);
        }

        unset($p);

        $rows = array_values($projects);

        usort($rows, fn ($a, $b) => strcmp($a['project_code'], $b['project_code']));

        return [
            'rows' => $rows,
            'totalIncome' => $totalIncome,
            'totalExpenses' => $totalExpenses,
            'netProfit' => bcsub($totalIncome, $totalExpenses, 2),
        ];
    }
}
