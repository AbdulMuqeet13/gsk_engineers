<?php

namespace App\Http\Controllers;

use App\Enums\ExpenseStatus;
use App\Enums\PayrollStatus;
use App\Models\Expense;
use App\Models\JournalLine;
use App\Models\PayrollRun;
use App\Models\Project;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $now = Carbon::now();
        $monthStart = $now->copy()->startOfMonth()->toDateString();
        $monthEnd = $now->copy()->endOfMonth()->toDateString();

        $monthTotals = $this->getAccountTypeTotals($monthStart, $monthEnd);
        $allTimeTotals = $this->getAccountTypeTotals(null, null);

        $totalIncome = $monthTotals['income'] ?? '0.00';
        $totalExpenses = $monthTotals['expense'] ?? '0.00';
        $netProfit = bcsub($totalIncome, $totalExpenses, 2);

        // Cash balance: all-time balance of asset accounts (Cash + Bank)
        $cashBalance = $allTimeTotals['asset'] ?? '0.00';

        $activeProjects = Project::where('status', 'active')->count();
        $pendingPayroll = PayrollRun::where('status', PayrollStatus::Submitted)->count();
        $pendingExpenses = Expense::where('status', ExpenseStatus::Submitted)->count();

        $monthlyTrend = $this->getMonthlyTrend($now);
        $expenseByCategory = $this->getExpenseByCategory($monthStart, $monthEnd);
        $projectBreakdown = $this->getProjectBreakdown($monthStart, $monthEnd);

        return Inertia::render('dashboard', [
            'kpis' => [
                'totalIncome' => $totalIncome,
                'totalExpenses' => $totalExpenses,
                'netProfit' => $netProfit,
                'cashBalance' => $cashBalance,
                'activeProjects' => $activeProjects,
                'pendingPayroll' => $pendingPayroll,
                'pendingExpenses' => $pendingExpenses,
            ],
            'monthlyTrend' => $monthlyTrend,
            'expenseByCategory' => $expenseByCategory,
            'projectBreakdown' => $projectBreakdown,
        ]);
    }

    /**
     * @return array<string, string>
     */
    private function getAccountTypeTotals(?string $dateFrom, ?string $dateTo): array
    {
        $rows = JournalLine::query()
            ->whereHas('journalEntry', fn ($q) => $q->posted()
                ->when($dateFrom, fn ($q2, $d) => $q2->where('date', '>=', $d))
                ->when($dateTo, fn ($q2, $d) => $q2->where('date', '<=', $d)))
            ->join('account_heads', 'journal_lines.account_head_id', '=', 'account_heads.id')
            ->selectRaw('account_heads.type, account_heads.normal_balance, SUM(journal_lines.debit) as total_debit, SUM(journal_lines.credit) as total_credit')
            ->groupBy('account_heads.type', 'account_heads.normal_balance')
            ->get();

        $totals = [];

        foreach ($rows as $row) {
            $type = $row->type;
            $totalDebit = number_format((float) $row->total_debit, 2, '.', '');
            $totalCredit = number_format((float) $row->total_credit, 2, '.', '');

            if ($row->normal_balance === 'debit') {
                $balance = bcsub($totalDebit, $totalCredit, 2);
            } else {
                $balance = bcsub($totalCredit, $totalDebit, 2);
            }

            if (isset($totals[$type])) {
                $totals[$type] = bcadd($totals[$type], $balance, 2);
            } else {
                $totals[$type] = $balance;
            }
        }

        return $totals;
    }

    /**
     * @return array<int, array{month: string, income: string, expenses: string}>
     */
    private function getMonthlyTrend(Carbon $now): array
    {
        $trend = [];

        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $start = $month->copy()->startOfMonth()->toDateString();
            $end = $month->copy()->endOfMonth()->toDateString();

            $totals = $this->getAccountTypeTotals($start, $end);

            $trend[] = [
                'month' => $month->format('M Y'),
                'income' => $totals['income'] ?? '0.00',
                'expenses' => $totals['expense'] ?? '0.00',
            ];
        }

        return $trend;
    }

    /**
     * @return array<int, array{name: string, value: string}>
     */
    private function getExpenseByCategory(?string $dateFrom, ?string $dateTo): array
    {
        $rows = JournalLine::query()
            ->whereHas('journalEntry', fn ($q) => $q->posted()
                ->when($dateFrom, fn ($q2, $d) => $q2->where('date', '>=', $d))
                ->when($dateTo, fn ($q2, $d) => $q2->where('date', '<=', $d)))
            ->join('account_heads', 'journal_lines.account_head_id', '=', 'account_heads.id')
            ->where('account_heads.type', 'expense')
            ->selectRaw('account_heads.name, SUM(journal_lines.debit) as total_debit, SUM(journal_lines.credit) as total_credit')
            ->groupBy('account_heads.id', 'account_heads.name')
            ->get();

        $categories = [];

        foreach ($rows as $row) {
            $balance = bcsub(
                number_format((float) $row->total_debit, 2, '.', ''),
                number_format((float) $row->total_credit, 2, '.', ''),
                2
            );

            if (bccomp($balance, '0.00', 2) > 0) {
                $categories[] = [
                    'name' => $row->name,
                    'value' => $balance,
                ];
            }
        }

        usort($categories, fn ($a, $b) => bccomp($b['value'], $a['value'], 2));

        return array_slice($categories, 0, 8);
    }

    /**
     * @return array<int, array{name: string, code: string, income: string, expenses: string}>
     */
    private function getProjectBreakdown(?string $dateFrom, ?string $dateTo): array
    {
        $rows = JournalLine::query()
            ->whereHas('journalEntry', fn ($q) => $q->posted()
                ->when($dateFrom, fn ($q2, $d) => $q2->where('date', '>=', $d))
                ->when($dateTo, fn ($q2, $d) => $q2->where('date', '<=', $d)))
            ->whereNotNull('journal_lines.project_id')
            ->join('account_heads', 'journal_lines.account_head_id', '=', 'account_heads.id')
            ->join('projects', 'journal_lines.project_id', '=', 'projects.id')
            ->selectRaw('projects.id as project_id, projects.name as project_name, projects.code as project_code, account_heads.type, account_heads.normal_balance, SUM(journal_lines.debit) as total_debit, SUM(journal_lines.credit) as total_credit')
            ->groupBy('projects.id', 'projects.name', 'projects.code', 'account_heads.type', 'account_heads.normal_balance')
            ->get();

        $projects = [];

        foreach ($rows as $row) {
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
                    'name' => $row->project_name,
                    'code' => $row->project_code,
                    'income' => '0.00',
                    'expenses' => '0.00',
                ];
            }

            if ($row->type === 'income') {
                $projects[$id]['income'] = bcadd($projects[$id]['income'], $balance, 2);
            } elseif ($row->type === 'expense') {
                $projects[$id]['expenses'] = bcadd($projects[$id]['expenses'], $balance, 2);
            }
        }

        $result = array_values($projects);

        usort($result, function ($a, $b) {
            $aTotal = bcadd($a['income'], $a['expenses'], 2);
            $bTotal = bcadd($b['income'], $b['expenses'], 2);

            return bccomp($bTotal, $aTotal, 2);
        });

        return array_slice($result, 0, 5);
    }
}
