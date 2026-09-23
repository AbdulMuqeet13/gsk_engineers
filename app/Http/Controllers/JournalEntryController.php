<?php

namespace App\Http\Controllers;

use App\Actions\Accounting\CreateJournalEntryAction;
use App\Actions\Accounting\PostJournalEntryAction;
use App\Actions\Accounting\ReverseJournalEntryAction;
use App\Actions\Accounting\UpdateJournalEntryAction;
use App\Concerns\FlashesToast;
use App\Enums\JournalEntryStatus;
use App\Enums\JournalEntryType;
use App\Http\Requests\Accounting\PostJournalEntryRequest;
use App\Http\Requests\Accounting\ReverseJournalEntryRequest;
use App\Http\Requests\Accounting\StoreJournalEntryRequest;
use App\Http\Requests\Accounting\UpdateJournalEntryRequest;
use App\Models\AccountHead;
use App\Models\JournalEntry;
use App\Models\Project;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JournalEntryController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', JournalEntry::class);

        $journalEntries = JournalEntry::query()
            ->with(['creator:id,name', 'lines.accountHead:id,code,name', 'attachments'])
            ->withCount('lines')
            ->when($request->input('search'), function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('reference', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), fn ($q, $s) => $q->where('status', $s))
            ->when($request->input('type'), fn ($q, $t) => $q->where('type', $t))
            ->when($request->input('date_from'), fn ($q, $d) => $q->where('date', '>=', $d))
            ->when($request->input('date_to'), fn ($q, $d) => $q->where('date', '<=', $d))
            ->orderBy(
                $request->input('sort', 'date'),
                $request->input('direction', 'desc'),
            )
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        return Inertia::render('accounting/journal-entries/index', [
            'journalEntries' => $journalEntries,
            'entryTypes' => JournalEntryType::values(),
            'entryStatuses' => JournalEntryStatus::values(),
            'accountHeads' => Inertia::optional(fn () => AccountHead::where('is_active', true)
                ->select('id', 'code', 'name', 'type', 'normal_balance')
                ->orderBy('code')
                ->get()),
            'projects' => Inertia::optional(fn () => Project::select('id', 'name', 'code')
                ->orderBy('name')
                ->get()),
        ]);
    }

    public function store(StoreJournalEntryRequest $request, CreateJournalEntryAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user());

        $this->flashSuccess('Journal entry created successfully.');

        return redirect()->route('journal-entries.index');
    }

    public function update(UpdateJournalEntryRequest $request, JournalEntry $journalEntry, UpdateJournalEntryAction $action): RedirectResponse
    {
        $action->execute($journalEntry, $request->validated());

        $this->flashSuccess('Journal entry updated successfully.');

        return redirect()->route('journal-entries.index');
    }

    public function destroy(JournalEntry $journalEntry): RedirectResponse
    {
        $this->authorize('update', $journalEntry);

        if ($journalEntry->isPosted()) {
            $this->flashError('Cannot delete a posted journal entry. Use reversal instead.');

            return redirect()->route('journal-entries.index');
        }

        $journalEntry->delete();

        $this->flashSuccess('Draft journal entry deleted successfully.');

        return redirect()->route('journal-entries.index');
    }

    public function post(PostJournalEntryRequest $request, JournalEntry $journalEntry, PostJournalEntryAction $action): RedirectResponse
    {
        try {
            $action->execute($journalEntry);
            $this->flashSuccess('Journal entry posted successfully.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('journal-entries.index');
    }

    public function reverse(ReverseJournalEntryRequest $request, JournalEntry $journalEntry, ReverseJournalEntryAction $action): RedirectResponse
    {
        try {
            $action->execute($journalEntry, $request->user(), $request->validated()['reason'] ?? '');
            $this->flashSuccess('Journal entry reversed successfully.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('journal-entries.index');
    }
}
