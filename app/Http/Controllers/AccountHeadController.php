<?php

namespace App\Http\Controllers;

use App\Actions\AccountHeads\CreateAccountHeadAction;
use App\Actions\AccountHeads\DeleteAccountHeadAction;
use App\Actions\AccountHeads\UpdateAccountHeadAction;
use App\Concerns\FlashesToast;
use App\Enums\AccountType;
use App\Enums\NormalBalance;
use App\Http\Requests\AccountHeads\StoreAccountHeadRequest;
use App\Http\Requests\AccountHeads\UpdateAccountHeadRequest;
use App\Models\AccountHead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountHeadController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', AccountHead::class);

        $accountHeads = AccountHead::query()
            ->with('parent:id,name,code')
            ->withCount('children')
            ->when($request->input('search'), function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%");
                });
            })
            ->when($request->input('type'), function ($query, string $type) {
                $query->where('type', $type);
            })
            ->orderBy(
                $request->input('sort', 'code'),
                $request->input('direction', 'asc'),
            )
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        return Inertia::render('accounting/chart-of-accounts/index', [
            'accountHeads' => $accountHeads,
            'accountTypes' => AccountType::values(),
            'normalBalances' => NormalBalance::values(),
            'parentAccounts' => Inertia::optional(fn () => AccountHead::select('id', 'name', 'code')->orderBy('code')->get()),
        ]);
    }

    public function store(StoreAccountHeadRequest $request, CreateAccountHeadAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        $this->flashSuccess('Account head created successfully.');

        return redirect()->route('account-heads.index');
    }

    public function update(UpdateAccountHeadRequest $request, AccountHead $accountHead, UpdateAccountHeadAction $action): RedirectResponse
    {
        $action->execute($accountHead, $request->validated());

        $this->flashSuccess('Account head updated successfully.');

        return redirect()->route('account-heads.index');
    }

    public function destroy(AccountHead $accountHead, DeleteAccountHeadAction $action): RedirectResponse
    {
        $this->authorize('delete', $accountHead);

        $action->execute($accountHead);

        $this->flashSuccess('Account head deleted successfully.');

        return redirect()->route('account-heads.index');
    }
}
