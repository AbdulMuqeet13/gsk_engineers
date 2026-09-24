<?php

namespace App\Http\Controllers;

use App\Models\AccountHead;
use App\Models\JournalLine;
use App\Models\Project;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\SimpleExcel\SimpleExcelWriter;

class ProjectCashbookController extends Controller
{
    /** @var string[] */
    private const CASH_ACCOUNT_CODES = ['1001', '1002', '1003'];

    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('reports.project'), 403);

        $cashAccounts = AccountHead::whereIn('code', self::CASH_ACCOUNT_CODES)
            ->select('id', 'code', 'name')
            ->orderBy('code')
            ->get();

        $cashAccountIds = $cashAccounts->pluck('id');
        $projectId = $request->input('project_id');
        $rows = [];
        $summary = [
            'openingBalance' => '0.00',
            'totalIn' => '0.00',
            'totalOut' => '0.00',
            'closingBalance' => '0.00',
        ];

        if ($projectId) {
            $accountFilter = $request->input('account_id');
            $filteredIds = $accountFilter
                ? $cashAccountIds->intersect([$accountFilter])
                : $cashAccountIds;

            $data = $this->getReportData($request, $projectId, $filteredIds);
            $rows = $data['rows'];
            $summary = $data['summary'];
        }

        return Inertia::render('reports/project-cashbook', [
            'rows' => $rows,
            'summary' => $summary,
            'cashAccounts' => $cashAccounts,
            'projects' => fn () => Project::select('id', 'name', 'code')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        abort_unless($request->user()->can('reports.project'), 403);

        $projectId = $request->input('project_id');
        abort_unless($projectId, 422);

        $cashAccounts = AccountHead::whereIn('code', self::CASH_ACCOUNT_CODES)
            ->select('id', 'code', 'name')
            ->orderBy('code')
            ->get();

        $cashAccountIds = $cashAccounts->pluck('id');
        $accountFilter = $request->input('account_id');
        $filteredIds = $accountFilter
            ? $cashAccountIds->intersect([$accountFilter])
            : $cashAccountIds;

        $data = $this->getReportData($request, $projectId, $filteredIds);
        $project = Project::findOrFail($projectId);
        $format = $request->input('format', 'pdf');

        if ($format === 'excel') {
            $path = tempnam(sys_get_temp_dir(), 'cashbook').'.xlsx';
            $writer = SimpleExcelWriter::create($path);

            $writer->addRow([
                'Date' => '',
                'Reference' => '',
                'Description' => 'Opening Balance',
                'Account' => '',
                'Money In' => '',
                'Money Out' => '',
                'Balance' => $data['summary']['openingBalance'],
            ]);

            foreach ($data['rows'] as $row) {
                $writer->addRow([
                    'Date' => $row['date'],
                    'Reference' => $row['reference'],
                    'Description' => $row['description'],
                    'Account' => $row['account']['code'].' - '.$row['account']['name'],
                    'Money In' => $row['money_in'],
                    'Money Out' => $row['money_out'],
                    'Balance' => $row['balance'],
                ]);
            }

            $writer->addRow([
                'Date' => '',
                'Reference' => '',
                'Description' => 'Totals',
                'Account' => '',
                'Money In' => $data['summary']['totalIn'],
                'Money Out' => $data['summary']['totalOut'],
                'Balance' => $data['summary']['closingBalance'],
            ]);
            $writer->close();

            return response()->download($path, 'project-cashbook-'.$project->code.'.xlsx')->deleteFileAfterSend(true);
        }

        $pdf = Pdf::loadView('reports.project-cashbook', array_merge($data, ['project' => $project]));

        return $pdf->download('project-cashbook-'.$project->code.'.pdf');
    }

    /**
     * @param  Collection<int, int>  $accountIds
     * @return array{rows: array<int, array<string, mixed>>, summary: array<string, string>}
     */
    private function getReportData(Request $request, int|string $projectId, $accountIds): array
    {
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        // Compute opening balance when date_from is set
        $openingBalance = '0.00';
        if ($dateFrom) {
            $opening = JournalLine::query()
                ->whereHas('journalEntry', fn ($q) => $q->posted()->where('date', '<', $dateFrom))
                ->where('project_id', $projectId)
                ->whereIn('account_head_id', $accountIds)
                ->selectRaw('COALESCE(SUM(debit), 0) as total_debit, COALESCE(SUM(credit), 0) as total_credit')
                ->first();

            $openingBalance = bcsub(
                number_format((float) $opening->total_debit, 2, '.', ''),
                number_format((float) $opening->total_credit, 2, '.', ''),
                2
            );
        }

        $lines = JournalLine::query()
            ->whereHas('journalEntry', fn ($q) => $q->posted()
                ->when($dateFrom, fn ($q2, $d) => $q2->where('date', '>=', $d))
                ->when($dateTo, fn ($q2, $d) => $q2->where('date', '<=', $d)))
            ->where('project_id', $projectId)
            ->whereIn('account_head_id', $accountIds)
            ->with(['journalEntry:id,date,reference,description', 'accountHead:id,code,name'])
            ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.journal_entry_id')
            ->orderBy('journal_entries.date', 'asc')
            ->orderBy('journal_lines.id', 'asc')
            ->select('journal_lines.*')
            ->get();

        $balance = $openingBalance;
        $totalIn = '0.00';
        $totalOut = '0.00';
        $rows = [];

        foreach ($lines as $line) {
            $debit = $line->getRawOriginal('debit') ?? $line->debit;
            $credit = $line->getRawOriginal('credit') ?? $line->credit;

            // Cash/bank accounts are debit-normal: debit = money in, credit = money out
            $balance = bcadd($balance, bcsub($debit, $credit, 2), 2);
            $totalIn = bcadd($totalIn, $debit, 2);
            $totalOut = bcadd($totalOut, $credit, 2);

            $rows[] = [
                'id' => $line->id,
                'date' => $line->journalEntry->date->format('d-m-Y'),
                'reference' => $line->journalEntry->reference,
                'description' => $line->journalEntry->description,
                'account' => [
                    'id' => $line->accountHead->id,
                    'code' => $line->accountHead->code,
                    'name' => $line->accountHead->name,
                ],
                'money_in' => number_format((float) $debit, 2, '.', ''),
                'money_out' => number_format((float) $credit, 2, '.', ''),
                'balance' => $balance,
            ];
        }

        return [
            'rows' => $rows,
            'summary' => [
                'openingBalance' => $openingBalance,
                'totalIn' => $totalIn,
                'totalOut' => $totalOut,
                'closingBalance' => $balance,
            ],
        ];
    }
}
