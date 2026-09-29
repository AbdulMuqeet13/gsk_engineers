<?php

namespace App\Http\Controllers;

use App\Actions\Incomes\CreateProjectIncomeAction;
use App\Actions\Incomes\ReverseProjectIncomeAction;
use App\Concerns\FlashesToast;
use App\Enums\AccountType;
use App\Http\Requests\Incomes\ReverseProjectIncomeRequest;
use App\Http\Requests\Incomes\StoreProjectIncomeRequest;
use App\Models\AccountHead;
use App\Models\Project;
use App\Models\ProjectIncome;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectIncomeController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ProjectIncome::class);

        $incomes = ProjectIncome::query()
            ->with([
                'project:id,name,code',
                'incomeAccount:id,code,name',
                'depositAccount:id,code,name',
                'journalEntry:id,reference,reversed_by_id',
                'creator:id,name',
            ])
            ->when($request->input('search'), function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('reference', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('received_from', 'like', "%{$search}%");
                });
            })
            ->when($request->input('project_id'), fn ($q, $id) => $q->where('project_id', $id))
            ->when($request->input('deposit_account_id'), fn ($q, $id) => $q->where('deposit_account_id', $id))
            ->when($request->input('date_from'), fn ($q, $d) => $q->where('date', '>=', $d))
            ->when($request->input('date_to'), fn ($q, $d) => $q->where('date', '<=', $d))
            ->orderBy(
                in_array($request->input('sort'), ['date', 'amount'], true) ? $request->input('sort') : 'date',
                $request->input('direction') === 'asc' ? 'asc' : 'desc',
            )
            ->orderByDesc('id')
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        return Inertia::render('incomes/index', [
            'incomes' => $incomes,
            'projects' => fn () => Project::select('id', 'name', 'code')
                ->orderBy('name')
                ->get(),
            'incomeAccounts' => fn () => AccountHead::where('is_active', true)
                ->where('type', AccountType::Income)
                ->select('id', 'code', 'name')
                ->orderBy('code')
                ->get(),
            'assetAccounts' => fn () => AccountHead::where('is_active', true)
                ->where('type', AccountType::Asset)
                ->select('id', 'code', 'name')
                ->orderBy('code')
                ->get(),
        ]);
    }

    public function store(StoreProjectIncomeRequest $request, CreateProjectIncomeAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user());

        $this->flashSuccess('Income recorded and journal entry posted.');

        return redirect()->route('incomes.index');
    }

    public function reverse(ReverseProjectIncomeRequest $request, ProjectIncome $income, ReverseProjectIncomeAction $action): RedirectResponse
    {
        try {
            $action->execute($income, $request->user(), $request->validated()['reason'] ?? '');
            $this->flashSuccess('Income reversed successfully.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('incomes.index');
    }
}
