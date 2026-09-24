<?php

namespace App\Http\Controllers;

use App\Actions\Payroll\ApprovePayrollRunAction;
use App\Actions\Payroll\CreatePayrollRunAction;
use App\Actions\Payroll\DeletePayrollRunAction;
use App\Actions\Payroll\RejectPayrollRunAction;
use App\Actions\Payroll\SubmitPayrollRunAction;
use App\Actions\Payroll\UpdatePayslipAction;
use App\Concerns\FlashesToast;
use App\Enums\PayrollStatus;
use App\Http\Requests\Payroll\ApprovePayrollRunRequest;
use App\Http\Requests\Payroll\RejectPayrollRunRequest;
use App\Http\Requests\Payroll\StorePayrollRunRequest;
use App\Http\Requests\Payroll\SubmitPayrollRunRequest;
use App\Http\Requests\Payroll\UpdatePayslipRequest;
use App\Models\AccountHead;
use App\Models\PayrollRun;
use App\Models\Payslip;
use Barryvdh\DomPDF\Facade\Pdf;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            ->withCount('payslips')
            ->with([
                'creator:id,name',
                'approver:id,name',
                'paymentAccount:id,code,name',
            ])
            ->when($request->input('search'), function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('reference', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), fn ($q, $s) => $q->where('status', $s))
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
        ]);
    }

    public function show(PayrollRun $payrollRun): Response
    {
        $this->authorize('view', $payrollRun);

        $payrollRun->load([
            'payslips.employee:id,name,designation,department',
            'creator:id,name',
            'approver:id,name',
            'paymentAccount:id,code,name',
            'journalEntry:id,reference',
        ]);

        return Inertia::render('payroll/show', [
            'payrollRun' => $payrollRun,
        ]);
    }

    public function store(StorePayrollRunRequest $request, CreatePayrollRunAction $action): RedirectResponse
    {
        $run = $action->execute($request->validated(), $request->user());

        $this->flashSuccess('Payroll run created with '.$run->payslips->count().' payslips.');

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
            $this->flashSuccess('Payroll approved and journal entry posted.');
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

    public function downloadPayslip(PayrollRun $payrollRun, Payslip $payslip): HttpResponse
    {
        $this->authorize('view', $payrollRun);

        abort_unless($payslip->payroll_run_id === $payrollRun->id, 404);

        $payslip->load('employee');

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
