<?php

namespace App\Http\Controllers;

use App\Enums\NormalBalance;
use App\Models\AccountHead;
use App\Models\JournalEntry;
use App\Models\JournalLine;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GeneralLedgerController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', JournalEntry::class);

        $accountHeadId = $request->input('account_head_id');
        $lines = collect();
        $accountHead = null;

        if ($accountHeadId) {
            $accountHead = AccountHead::findOrFail($accountHeadId);

            $lines = JournalLine::query()
                ->whereHas('journalEntry', fn ($q) => $q->posted()
                    ->when($request->input('date_from'), fn ($q2, $d) => $q2->where('date', '>=', $d))
                    ->when($request->input('date_to'), fn ($q2, $d) => $q2->where('date', '<=', $d)))
                ->where('account_head_id', $accountHeadId)
                ->with(['journalEntry:id,date,reference,description', 'project:id,name,code'])
                ->when($request->input('project_id'), fn ($q, $pid) => $q->where('project_id', $pid))
                ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.journal_entry_id')
                ->orderBy('journal_entries.date', 'asc')
                ->orderBy('journal_lines.id', 'asc')
                ->select('journal_lines.*')
                ->get();

            $isDebitNormal = $accountHead->normal_balance === NormalBalance::Debit;
            $balance = '0.00';

            $lines = $lines->map(function ($line) use (&$balance, $isDebitNormal) {
                $debit = $line->getRawOriginal('debit') ?? $line->debit;
                $credit = $line->getRawOriginal('credit') ?? $line->credit;

                if ($isDebitNormal) {
                    $balance = bcadd($balance, bcsub($debit, $credit, 2), 2);
                } else {
                    $balance = bcadd($balance, bcsub($credit, $debit, 2), 2);
                }

                $line->running_balance = $balance;

                return $line;
            });
        }

        return Inertia::render('accounting/general-ledger/index', [
            'lines' => $lines->values(),
            'selectedAccountHead' => $accountHead,
            'accountHeads' => AccountHead::select('id', 'code', 'name', 'type', 'normal_balance')
                ->where('is_active', true)
                ->orderBy('code')
                ->get(),
            'projects' => Inertia::optional(fn () => Project::select('id', 'name', 'code')
                ->orderBy('name')
                ->get()),
        ]);
    }
}
