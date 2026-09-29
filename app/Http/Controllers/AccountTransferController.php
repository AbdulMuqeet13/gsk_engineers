<?php

namespace App\Http\Controllers;

use App\Actions\AccountTransfers\CreateAccountTransferAction;
use App\Actions\AccountTransfers\ReverseAccountTransferAction;
use App\Concerns\FlashesToast;
use App\Enums\AccountType;
use App\Http\Requests\AccountTransfers\ReverseAccountTransferRequest;
use App\Http\Requests\AccountTransfers\StoreAccountTransferRequest;
use App\Models\AccountHead;
use App\Models\AccountTransfer;
use App\Models\Project;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountTransferController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', AccountTransfer::class);

        $accountTransfers = AccountTransfer::query()
            ->with([
                'fromAccount:id,code,name',
                'toAccount:id,code,name',
                'project:id,name,code',
                'journalEntry:id,reference,reversed_by_id',
                'creator:id,name',
            ])
            ->when($request->input('search'), function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('reference', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->input('account_id'), function ($query, $id) {
                $query->where(fn ($q) => $q->where('from_account_id', $id)->orWhere('to_account_id', $id));
            })
            ->when($request->input('project_id'), fn ($q, $id) => $q->where('project_id', $id))
            ->when($request->input('date_from'), fn ($q, $d) => $q->where('date', '>=', $d))
            ->when($request->input('date_to'), fn ($q, $d) => $q->where('date', '<=', $d))
            ->orderBy(
                in_array($request->input('sort'), ['date', 'amount'], true) ? $request->input('sort') : 'date',
                $request->input('direction') === 'asc' ? 'asc' : 'desc',
            )
            ->orderByDesc('id')
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        return Inertia::render('account-transfers/index', [
            'accountTransfers' => $accountTransfers,
            'projects' => fn () => Project::select('id', 'name', 'code')
                ->orderBy('name')
                ->get(),
            'assetAccounts' => fn () => AccountHead::where('is_active', true)
                ->where('type', AccountType::Asset)
                ->select('id', 'code', 'name')
                ->orderBy('code')
                ->get(),
        ]);
    }

    public function store(StoreAccountTransferRequest $request, CreateAccountTransferAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user());

        $this->flashSuccess('Account transfer recorded and journal entry posted.');

        return redirect()->route('account-transfers.index');
    }

    public function reverse(ReverseAccountTransferRequest $request, AccountTransfer $accountTransfer, ReverseAccountTransferAction $action): RedirectResponse
    {
        try {
            $action->execute($accountTransfer, $request->user(), $request->validated()['reason'] ?? '');
            $this->flashSuccess('Account transfer reversed successfully.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('account-transfers.index');
    }
}
