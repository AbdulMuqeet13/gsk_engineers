<?php

namespace App\Http\Controllers;

use App\Actions\Transfers\CreateTransferAction;
use App\Actions\Transfers\ReverseTransferAction;
use App\Concerns\FlashesToast;
use App\Http\Requests\Transfers\ReverseTransferRequest;
use App\Http\Requests\Transfers\StoreTransferRequest;
use App\Models\AccountHead;
use App\Models\InterProjectTransfer;
use App\Models\Project;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InterProjectTransferController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', InterProjectTransfer::class);

        $transfers = InterProjectTransfer::query()
            ->with([
                'fromProject:id,name,code',
                'toProject:id,name,code',
                'fromAccount:id,code,name',
                'toAccount:id,code,name',
                'journalEntry:id,reference,reversed_by_id',
                'creator:id,name',
            ])
            ->when($request->input('search'), function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('reference', 'like', "%{$search}%")
                        ->orWhere('purpose', 'like', "%{$search}%");
                });
            })
            ->when($request->input('from_project_id'), fn ($q, $id) => $q->where('from_project_id', $id))
            ->when($request->input('to_project_id'), fn ($q, $id) => $q->where('to_project_id', $id))
            ->when($request->input('date_from'), fn ($q, $d) => $q->where('date', '>=', $d))
            ->when($request->input('date_to'), fn ($q, $d) => $q->where('date', '<=', $d))
            ->orderBy(
                $request->input('sort', 'date'),
                $request->input('direction', 'desc'),
            )
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        return Inertia::render('transfers/index', [
            'transfers' => $transfers,
            'projects' => Inertia::optional(fn () => Project::select('id', 'name', 'code')
                ->orderBy('name')
                ->get()),
            'assetAccounts' => Inertia::optional(fn () => AccountHead::where('is_active', true)
                ->where('type', 'asset')
                ->select('id', 'code', 'name')
                ->orderBy('code')
                ->get()),
        ]);
    }

    public function store(StoreTransferRequest $request, CreateTransferAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user());

        $this->flashSuccess('Transfer executed and journal entry posted.');

        return redirect()->route('transfers.index');
    }

    public function reverse(ReverseTransferRequest $request, InterProjectTransfer $transfer, ReverseTransferAction $action): RedirectResponse
    {
        try {
            $action->execute($transfer, $request->user(), $request->validated()['reason'] ?? '');
            $this->flashSuccess('Transfer reversed successfully.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('transfers.index');
    }
}
