<?php

namespace App\Http\Controllers;

use App\Enums\NormalBalance;
use App\Enums\PayrollStatus;
use App\Enums\PayslipItemType;
use App\Models\AccountHead;
use App\Models\Employee;
use App\Models\JournalLine;
use App\Models\PayslipItem;
use App\Models\Project;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\SimpleExcel\SimpleExcelWriter;

class ProjectLedgerController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('reports.project'), 403);

        $projectId = $request->input('project_id');
        $accountHeadId = $request->input('account_head_id');
        $rows = [];
        $totalDebit = '0.00';
        $totalCredit = '0.00';

        if ($projectId) {
            $data = $this->getReportData($request, $projectId, $accountHeadId);
            $rows = $data['rows'];
            $totalDebit = $data['totalDebit'];
            $totalCredit = $data['totalCredit'];
        }

        return Inertia::render('reports/project-ledger', [
            'rows' => $rows,
            'totalDebit' => $totalDebit,
            'totalCredit' => $totalCredit,
            'accountHeads' => AccountHead::select('id', 'code', 'name', 'type', 'normal_balance')
                ->where('is_active', true)
                ->orderBy('code')
                ->get(),
            'projects' => fn () => Project::select('id', 'name', 'code')
                ->orderBy('name')
                ->get(),
            'employees' => fn () => $projectId
                ? Employee::select('id', 'name', 'designation')
                    ->whereHas('payslips.items', fn ($q) => $q->where('type', PayslipItemType::Allowance)
                        ->where('project_id', $projectId))
                    ->orderBy('name')
                    ->get()
                : [],
        ]);
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        abort_unless($request->user()->can('reports.project'), 403);

        $projectId = $request->input('project_id');
        abort_unless($projectId, 422);

        $accountHeadId = $request->input('account_head_id');
        $data = $this->getReportData($request, $projectId, $accountHeadId);
        $project = Project::findOrFail($projectId);
        $format = $request->input('format', 'pdf');

        $employee = $request->input('employee_id') ? Employee::find($request->input('employee_id')) : null;

        if ($format === 'excel') {
            $path = tempnam(sys_get_temp_dir(), 'ledger').'.xlsx';
            $writer = SimpleExcelWriter::create($path);

            foreach ($data['rows'] as $row) {
                $writer->addRow([
                    'Date' => $row['date'],
                    'Reference' => $row['reference'],
                    'Description' => $row['description'],
                    'Account' => $row['account']['code'].' - '.$row['account']['name'],
                    'Type' => ucfirst($row['account']['type']),
                    'Debit' => $row['debit'],
                    'Credit' => $row['credit'],
                    'Balance' => $row['balance'] ?? '-',
                ]);
            }

            $writer->addRow([
                'Date' => '',
                'Reference' => '',
                'Description' => 'Totals',
                'Account' => '',
                'Type' => '',
                'Debit' => $data['totalDebit'],
                'Credit' => $data['totalCredit'],
                'Balance' => '',
            ]);
            $writer->close();

            return response()->download($path, 'project-ledger-'.$project->code.($employee ? '-employee-'.$employee->id : '').'.xlsx')->deleteFileAfterSend(true);
        }

        $pdf = Pdf::loadView('reports.project-ledger', array_merge($data, [
            'project' => $project,
            'employee' => $employee,
            'hasAccountFilter' => (bool) $accountHeadId || (bool) $employee,
        ]));

        return $pdf->download('project-ledger-'.$project->code.'.pdf');
    }

    /**
     * @return array{rows: array<int, array<string, mixed>>, totalDebit: string, totalCredit: string}
     */
    private function getReportData(Request $request, int|string $projectId, ?string $accountHeadId): array
    {
        if ($request->input('employee_id')) {
            return $this->getEmployeeReportData($request, $projectId, $request->input('employee_id'), $accountHeadId);
        }

        $lines = JournalLine::query()
            ->whereHas('journalEntry', fn ($q) => $q->posted()
                ->when($request->input('date_from'), fn ($q2, $d) => $q2->where('date', '>=', $d))
                ->when($request->input('date_to'), fn ($q2, $d) => $q2->where('date', '<=', $d)))
            ->where('project_id', $projectId)
            ->when($accountHeadId, fn ($q, $id) => $q->where('account_head_id', $id))
            ->with(['journalEntry:id,date,reference,description', 'accountHead:id,code,name,type,normal_balance'])
            ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.journal_entry_id')
            ->orderBy('journal_entries.date', 'asc')
            ->orderBy('journal_lines.id', 'asc')
            ->select('journal_lines.*')
            ->get();

        $totalDebit = '0.00';
        $totalCredit = '0.00';
        $balance = '0.00';
        $hasAccountFilter = (bool) $accountHeadId;

        // For running balance when a single account is selected
        $accountHead = $hasAccountFilter ? AccountHead::find($accountHeadId) : null;
        $isDebitNormal = $accountHead?->normal_balance === NormalBalance::Debit;

        $rows = [];

        foreach ($lines as $line) {
            $debit = $line->getRawOriginal('debit') ?? $line->debit;
            $credit = $line->getRawOriginal('credit') ?? $line->credit;

            $totalDebit = bcadd($totalDebit, $debit, 2);
            $totalCredit = bcadd($totalCredit, $credit, 2);

            $lineBalance = null;
            if ($hasAccountFilter) {
                if ($isDebitNormal) {
                    $balance = bcadd($balance, bcsub($debit, $credit, 2), 2);
                } else {
                    $balance = bcadd($balance, bcsub($credit, $debit, 2), 2);
                }
                $lineBalance = $balance;
            }

            $rows[] = [
                'id' => $line->id,
                'date' => $line->journalEntry->date->format('d-m-Y'),
                'reference' => $line->journalEntry->reference,
                'description' => $line->journalEntry->description,
                'account' => [
                    'id' => $line->accountHead->id,
                    'code' => $line->accountHead->code,
                    'name' => $line->accountHead->name,
                    'type' => $line->accountHead->type->value,
                ],
                'debit' => number_format((float) $debit, 2, '.', ''),
                'credit' => number_format((float) $credit, 2, '.', ''),
                'balance' => $lineBalance,
            ];
        }

        return [
            'rows' => $rows,
            'totalDebit' => $totalDebit,
            'totalCredit' => $totalCredit,
        ];
    }

    /**
     * Build ledger rows for one employee from the project allowances on their
     * approved payslips. Payroll posts allowances to the journal aggregated per
     * project, so payslip items are the only per-employee source.
     *
     * @return array{rows: array<int, array<string, mixed>>, totalDebit: string, totalCredit: string}
     */
    private function getEmployeeReportData(Request $request, int|string $projectId, int|string $employeeId, ?string $accountHeadId): array
    {
        $allowanceAccount = AccountHead::where('code', '5006')->first();

        if (! $allowanceAccount || ($accountHeadId && (int) $accountHeadId !== $allowanceAccount->id)) {
            return ['rows' => [], 'totalDebit' => '0.00', 'totalCredit' => '0.00'];
        }

        $items = PayslipItem::query()
            ->where('type', PayslipItemType::Allowance)
            ->where('project_id', $projectId)
            ->whereHas('payslip', fn ($q) => $q->where('employee_id', $employeeId)
                ->whereHas('payrollRun', fn ($q2) => $q2->where('status', PayrollStatus::Approved)
                    ->when($request->input('date_from'), fn ($q3, $d) => $q3->whereDate('approved_at', '>=', $d))
                    ->when($request->input('date_to'), fn ($q3, $d) => $q3->whereDate('approved_at', '<=', $d))))
            ->with(['payslip:id,payroll_run_id,employee_id', 'payslip.employee:id,name', 'payslip.payrollRun:id,reference,period_start,approved_at'])
            ->get()
            ->sortBy(fn (PayslipItem $item) => [$item->payslip->payrollRun->approved_at, $item->id])
            ->values();

        $total = '0.00';
        $rows = [];

        foreach ($items as $item) {
            $amount = $item->getRawOriginal('amount') ?? $item->amount;
            $total = bcadd($total, $amount, 2);
            $run = $item->payslip->payrollRun;

            $rows[] = [
                'id' => $item->id,
                'date' => $run->approved_at->format('d-m-Y'),
                'reference' => $run->reference,
                'description' => "{$item->name} — {$item->payslip->employee->name} ({$run->period_start->format('M Y')})",
                'account' => [
                    'id' => $allowanceAccount->id,
                    'code' => $allowanceAccount->code,
                    'name' => $allowanceAccount->name,
                    'type' => $allowanceAccount->type->value,
                ],
                'debit' => number_format((float) $amount, 2, '.', ''),
                'credit' => '0.00',
                'balance' => $total,
            ];
        }

        return [
            'rows' => $rows,
            'totalDebit' => $total,
            'totalCredit' => '0.00',
        ];
    }
}
