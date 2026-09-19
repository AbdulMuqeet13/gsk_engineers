<?php

namespace App\Http\Controllers;

use App\Actions\Expenses\ApproveExpenseAction;
use App\Actions\Expenses\CreateExpenseAction;
use App\Actions\Expenses\DeleteExpenseAction;
use App\Actions\Expenses\RejectExpenseAction;
use App\Actions\Expenses\SubmitExpenseAction;
use App\Actions\Expenses\UpdateExpenseAction;
use App\Concerns\FlashesToast;
use App\Enums\ExpenseStatus;
use App\Http\Requests\Expenses\ApproveExpenseRequest;
use App\Http\Requests\Expenses\RejectExpenseRequest;
use App\Http\Requests\Expenses\StoreExpenseRequest;
use App\Http\Requests\Expenses\SubmitExpenseRequest;
use App\Http\Requests\Expenses\UpdateExpenseRequest;
use App\Models\AccountHead;
use App\Models\Expense;
use App\Models\Project;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Expense::class);

        $expenses = Expense::query()
            ->with([
                'accountHead:id,code,name',
                'paymentAccount:id,code,name',
                'project:id,name,code',
                'creator:id,name',
                'approver:id,name',
            ])
            ->when($request->input('search'), function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('reference', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), fn ($q, $s) => $q->where('status', $s))
            ->when($request->input('account_head_id'), fn ($q, $id) => $q->where('account_head_id', $id))
            ->when($request->input('project_id'), fn ($q, $id) => $q->where('project_id', $id))
            ->when($request->input('date_from'), fn ($q, $d) => $q->where('date', '>=', $d))
            ->when($request->input('date_to'), fn ($q, $d) => $q->where('date', '<=', $d))
            ->orderBy(
                $request->input('sort', 'date'),
                $request->input('direction', 'desc'),
            )
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        return Inertia::render('expenses/index', [
            'expenses' => $expenses,
            'expenseStatuses' => ExpenseStatus::values(),
            'expenseAccounts' => Inertia::optional(fn () => AccountHead::where('is_active', true)
                ->where('type', 'expense')
                ->select('id', 'code', 'name')
                ->orderBy('code')
                ->get()),
            'paymentAccounts' => Inertia::optional(fn () => AccountHead::where('is_active', true)
                ->where('type', 'asset')
                ->whereIn('code', ['1001', '1002'])
                ->select('id', 'code', 'name')
                ->orderBy('code')
                ->get()),
            'projects' => Inertia::optional(fn () => Project::select('id', 'name', 'code')
                ->orderBy('name')
                ->get()),
        ]);
    }

    public function store(StoreExpenseRequest $request, CreateExpenseAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user());

        $this->flashSuccess('Expense created successfully.');

        return redirect()->route('expenses.index');
    }

    public function update(UpdateExpenseRequest $request, Expense $expense, UpdateExpenseAction $action): RedirectResponse
    {
        $action->execute($expense, $request->validated());

        $this->flashSuccess('Expense updated successfully.');

        return redirect()->route('expenses.index');
    }

    public function destroy(Expense $expense, DeleteExpenseAction $action): RedirectResponse
    {
        $this->authorize('delete', $expense);

        try {
            $action->execute($expense);
            $this->flashSuccess('Expense deleted successfully.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('expenses.index');
    }

    public function submit(SubmitExpenseRequest $request, Expense $expense, SubmitExpenseAction $action): RedirectResponse
    {
        try {
            $action->execute($expense);
            $this->flashSuccess('Expense submitted for approval.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('expenses.index');
    }

    public function approve(ApproveExpenseRequest $request, Expense $expense, ApproveExpenseAction $action): RedirectResponse
    {
        try {
            $action->execute($expense, $request->user());
            $this->flashSuccess('Expense approved and journal entry posted.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('expenses.index');
    }

    public function reject(RejectExpenseRequest $request, Expense $expense, RejectExpenseAction $action): RedirectResponse
    {
        try {
            $action->execute($expense, $request->user(), $request->validated()['reason']);
            $this->flashSuccess('Expense rejected.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('expenses.index');
    }
}
