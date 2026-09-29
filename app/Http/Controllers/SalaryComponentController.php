<?php

namespace App\Http\Controllers;

use App\Actions\Salaries\CreateSalaryComponentAction;
use App\Actions\Salaries\DeleteSalaryComponentAction;
use App\Actions\Salaries\UpdateSalaryComponentAction;
use App\Concerns\FlashesToast;
use App\Enums\PermissionEnum;
use App\Http\Requests\Salaries\StoreSalaryComponentRequest;
use App\Http\Requests\Salaries\UpdateSalaryComponentRequest;
use App\Models\SalaryComponent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SalaryComponentController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        abort_unless($request->user()->can(PermissionEnum::PayrollView->value), 403);

        return Inertia::render('payroll/salary-components/index', [
            'salaryComponents' => SalaryComponent::ordered()->get(['id', 'name', 'sort_order', 'is_active']),
        ]);
    }

    public function store(StoreSalaryComponentRequest $request, CreateSalaryComponentAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        $this->flashSuccess('Salary component created.');

        return redirect()->route('salary-components.index');
    }

    public function update(UpdateSalaryComponentRequest $request, SalaryComponent $salaryComponent, UpdateSalaryComponentAction $action): RedirectResponse
    {
        $action->execute($salaryComponent, $request->validated());

        $this->flashSuccess('Salary component updated.');

        return redirect()->route('salary-components.index');
    }

    public function destroy(Request $request, SalaryComponent $salaryComponent, DeleteSalaryComponentAction $action): RedirectResponse
    {
        abort_unless($request->user()->can(PermissionEnum::PayrollRun->value), 403);

        $action->execute($salaryComponent);

        $this->flashSuccess('Salary component deleted.');

        return redirect()->route('salary-components.index');
    }
}
