<?php

namespace App\Http\Controllers;

use App\Actions\Payroll\ApprovePayrollRunAction;
use App\Actions\Payroll\CreatePayrollRunAction;
use App\Actions\Payroll\DeletePayrollRunAction;
use App\Actions\Payroll\PayPayslipsAction;
use App\Actions\Payroll\RejectPayrollRunAction;
use App\Actions\Payroll\SubmitPayrollRunAction;
use App\Actions\Payroll\UpdatePayslipAction;
use App\Concerns\FlashesToast;
use App\Enums\PayrollStatus;
use App\Exceptions\Payroll\OverlappingPayrollException;
use App\Http\Requests\Payroll\ApprovePayrollRunRequest;
use App\Http\Requests\Payroll\PayPayslipsRequest;
use App\Http\Requests\Payroll\RejectPayrollRunRequest;
use App\Http\Requests\Payroll\StorePayrollRunRequest;
use App\Http\Requests\Payroll\SubmitPayrollRunRequest;
use App\Http\Requests\Payroll\UpdatePayslipRequest;
use App\Models\AccountHead;
use App\Models\Employee;
use App\Models\PayrollRun;
use App\Models\Payslip;
use App\Models\Project;
use Barryvdh\DomPDF\Facade\Pdf;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class PayrollRunController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', PayrollRun::class);

        $payrollRuns = PayrollRun::query()
            ->withCount([
                'payslips',
                'payslips as paid_payslips_count' => fn ($q) => $q->whereNotNull('paid_at'),
            ])
            ->with([
                'creator:id,name',
                'approver:id,name',
                'paymentAccount:id,code,name',
                'project:id,name,code',
            ])
            ->when($request->input('search'), function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('reference', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), fn ($q, $s) => $q->whereIn('status', explode(',', $s)))
            ->when($request->input('date_from'), fn ($q, $d) => $q->where('period_start', '>=', $d))
            ->when($request->input('date_to'), fn ($q, $d) => $q->where('period_end', '<=', $d))
            ->orderBy(
                $request->input('sort', 'created_at'),
                $request->input('direction', 'desc'),
            )
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        return Inertia::render('payroll/index', [
            'payrollRuns' => $payrollRuns,
            'payrollStatuses' => PayrollStatus::values(),
            'paymentAccounts' => fn () => AccountHead::where('is_active', true)
                ->where('type', 'asset')
                ->select('id', 'code', 'name')
                ->orderBy('code')
                ->get(),
            'projects' => fn () => Project::select('id', 'name', 'code')
                ->orderBy('name')
                ->get(),
            'employees' => fn () => Employee::where('is_active', true)
                ->select('id', 'name', 'designation', 'project_id')
                ->with('assignments:id,employee_id,project_id')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function show(PayrollRun $payrollRun): Response
    {
        $this->authorize('view', $payrollRun);

        $payrollRun->load([
            'payslips.employee' => fn ($q) => $q->withTrashed()->select('id', 'name', 'designation', 'department'),
            'payslips.items.project:id,name,code',
            'payslips.paymentAccount:id,code,name',
            'payslips.paymentJournalEntry:id,reference',
            'creator:id,name',
            'approver:id,name',
            'paymentAccount:id,code,name',
            'project:id,name,code',
            'journalEntry:id,reference',
        ]);

        return Inertia::render('payroll/show', [
            'payrollRun' => $payrollRun,
            'paymentAccounts' => fn () => AccountHead::where('is_active', true)
                ->where('type', 'asset')
                ->select('id', 'code', 'name')
                ->orderBy('code')
                ->get(),
        ]);
    }

    public function store(StorePayrollRunRequest $request, CreatePayrollRunAction $action): RedirectResponse
    {
        try {
            $result = $action->execute($request->validated(), $request->user());
        } catch (OverlappingPayrollException $e) {
            throw ValidationException::withMessages(['period_start' => $e->getMessage()]);
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());

            return redirect()->route('payroll.index');
        }

        $run = $result['run'];
        $message = 'Payroll run created with '.$run->payslips->count().' payslips.';

        if ($result['skipped_without_salary'] > 0) {
            $message .= " {$result['skipped_without_salary']} active employee(s) skipped: no salary effective by the period end.";
        }

        if ($result['skipped_already_in_payroll'] > 0) {
            $message .= " {$result['skipped_already_in_payroll']} employee(s) skipped: already in another payroll run for this period.";
        }

        $this->flashSuccess($message);

        return redirect()->route('payroll.show', $run);
    }

    public function destroy(PayrollRun $payrollRun, DeletePayrollRunAction $action): RedirectResponse
    {
        $this->authorize('delete', $payrollRun);

        try {
            $action->execute($payrollRun);
            $this->flashSuccess('Payroll run deleted successfully.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('payroll.index');
    }

    public function submit(SubmitPayrollRunRequest $request, PayrollRun $payrollRun, SubmitPayrollRunAction $action): RedirectResponse
    {
        $this->authorize('submit', $payrollRun);

        try {
            $action->execute($payrollRun);
            $this->flashSuccess('Payroll run submitted for approval.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('payroll.show', $payrollRun);
    }

    public function approve(ApprovePayrollRunRequest $request, PayrollRun $payrollRun, ApprovePayrollRunAction $action): RedirectResponse
    {
        $this->authorize('approve', $payrollRun);

        try {
            $action->execute($payrollRun, $request->user());
            $this->flashSuccess('Payroll approved. Salaries are now payable and can be paid per employee.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('payroll.show', $payrollRun);
    }

    public function reject(RejectPayrollRunRequest $request, PayrollRun $payrollRun, RejectPayrollRunAction $action): RedirectResponse
    {
        $this->authorize('reject', $payrollRun);

        try {
            $action->execute($payrollRun, $request->user(), $request->validated()['reason']);
            $this->flashSuccess('Payroll run rejected.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('payroll.show', $payrollRun);
    }

    public function updatePayslip(UpdatePayslipRequest $request, PayrollRun $payrollRun, Payslip $payslip, UpdatePayslipAction $action): RedirectResponse
    {
        $this->authorize('update', $payrollRun);

        try {
            $action->execute($payslip, $request->validated());
            $this->flashSuccess('Payslip updated successfully.');
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('payroll.show', $payrollRun);
    }

    public function pay(PayPayslipsRequest $request, PayrollRun $payrollRun, PayPayslipsAction $action): RedirectResponse
    {
        $this->authorize('pay', $payrollRun);

        try {
            $payslips = $action->execute($payrollRun, $request->validated(), $request->user());
            $this->flashSuccess($payslips->count() === 1
                ? "Salary of {$payslips->first()->employee->name} paid."
                : "Salaries of {$payslips->count()} employees paid.");
        } catch (DomainException $e) {
            $this->flashError($e->getMessage());
        }

        return redirect()->route('payroll.show', $payrollRun);
    }

    public function downloadPayslip(PayrollRun $payrollRun, Payslip $payslip): HttpResponse
    {
        $this->authorize('view', $payrollRun);

        abort_unless($payslip->payroll_run_id === $payrollRun->id, 404);

        $payslip->load(['employee', 'items.project:id,name,code']);

        $pdf = Pdf::loadView('payroll.payslip', [
            'payrollRun' => $payrollRun,
            'payslip' => $payslip,
            'employee' => $payslip->employee,
        ]);

        $employeeName = str_replace(' ', '-', strtolower($payslip->employee->name));
        $period = $payrollRun->period_start->format('Y-m');

        return $pdf->download("payslip-{$employeeName}-{$period}.pdf");
    }
}
