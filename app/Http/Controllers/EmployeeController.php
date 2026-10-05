<?php

namespace App\Http\Controllers;

use App\Actions\Employees\CreateEmployeeAction;
use App\Actions\Employees\DeleteEmployeeAction;
use App\Actions\Employees\UpdateEmployeeAction;
use App\Concerns\FlashesToast;
use App\Enums\AccountType;
use App\Enums\EmployeeType;
use App\Enums\SalaryChangeType;
use App\Http\Requests\Employees\StoreEmployeeRequest;
use App\Http\Requests\Employees\UpdateEmployeeRequest;
use App\Models\AccountHead;
use App\Models\Employee;
use App\Models\Project;
use App\Models\SalaryComponent;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Employee::class);

        $employees = Employee::query()
            ->with(['project:id,name,code', 'attachments', 'fingerprints', 'currentSalary'])
            ->when($request->input('search'), function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->input('type'), function ($query, string $type) {
                $query->whereIn('type', explode(',', $type));
            })
            ->when($request->input('project_id'), function ($query, string $projectId) {
                $query->whereIn('project_id', explode(',', $projectId));
            })
            ->orderBy(
                $request->input('sort', 'created_at'),
                $request->input('direction', 'desc'),
            )
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'employeeTypes' => EmployeeType::values(),
            'projects' => fn () => Project::select('id', 'name', 'code')->orderBy('name')->get(),
            'salaryComponents' => fn () => SalaryComponent::where('is_active', true)->ordered()->get(['id', 'name']),
        ]);
    }

    public function show(Employee $employee): Response
    {
        $this->authorize('view', $employee);

        $employee->load([
            'project:id,name,code',
            'salaries.components.salaryComponent:id,name',
            'salaries.creator:id,name',
            'assignments.project:id,name,code',
            'assignments.allowances',
            'securityRefunds' => fn ($query) => $query->latest('date')->with('paymentAccount:id,code,name'),
        ]);

        return Inertia::render('employees/show', [
            'employee' => $employee,
            'securityBalance' => $employee->securityBalance(),
            'currentSalaryId' => $employee->salaryEffectiveOn(now()->toDateString())?->id,
            'payslips' => $employee->payslips()
                ->with('payrollRun:id,reference,period_start,period_end,status')
                ->latest('id')
                ->limit(12)
                ->get(),
            'salaryComponents' => fn () => SalaryComponent::where('is_active', true)->ordered()->get(['id', 'name']),
            'salaryChangeTypes' => array_values(array_diff(SalaryChangeType::values(), [SalaryChangeType::Initial->value])),
            'paymentAccounts' => fn () => AccountHead::where('is_active', true)
                ->where('type', AccountType::Asset)
                ->select('id', 'code', 'name')
                ->orderBy('code')
                ->get(),
        ]);
    }

    public function store(StoreEmployeeRequest $request, CreateEmployeeAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user());

        $this->flashSuccess('Employee created successfully.');

        return redirect()->route('employees.index');
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee, UpdateEmployeeAction $action): RedirectResponse
    {
        $action->execute($employee, $request->validated());

        $this->flashSuccess('Employee updated successfully.');

        return redirect()->route('employees.index');
    }

    public function destroy(Employee $employee, DeleteEmployeeAction $action): RedirectResponse
    {
        $this->authorize('delete', $employee);

        try {
            $action->execute($employee);
            $this->flashSuccess('Employee deleted successfully.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('employees.index');
    }
}
