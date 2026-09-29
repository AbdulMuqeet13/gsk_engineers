<?php

namespace App\Services;

use App\Enums\AttendanceStatus;
use App\Enums\JournalEntryType;
use App\Enums\PayrollStatus;
use App\Enums\PayslipItemType;
use App\Exceptions\Payroll\EmptyPayrollException;
use App\Exceptions\Payroll\OverlappingPayrollException;
use App\Exceptions\Payroll\PayrollNotDraftException;
use App\Exceptions\Payroll\PayrollNotSubmittedException;
use App\Models\AccountHead;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\PayrollRun;
use App\Models\Payslip;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PayrollService
{
    public function __construct(private JournalService $journalService) {}

    /**
     * Generate the next sequential reference number.
     *
     * Format: PR-YYYY-NNNNNN
     */
    public function generateReference(): string
    {
        $year = now()->year;
        $prefix = "PR-{$year}-";

        $lastNumber = DB::table('payroll_runs')
            ->where('reference', 'like', "{$prefix}%")
            ->lockForUpdate()
            ->max(DB::raw('CAST(SUBSTRING(reference, '.(strlen($prefix) + 1).') AS UNSIGNED)'));

        $nextNumber = ($lastNumber ?? 0) + 1;

        return $prefix.str_pad((string) $nextNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Create a draft payroll run with auto-generated payslips.
     *
     * @param array{
     *     period_start: string,
     *     period_end: string,
     *     payment_account_id: int,
     *     description: string|null,
     * } $data
     *
     * @throws OverlappingPayrollException
     */
    public function create(array $data, User $user): PayrollRun
    {
        return DB::transaction(function () use ($data, $user) {
            $existing = PayrollRun::overlapping($data['period_start'], $data['period_end'])->lockForUpdate()->first();

            if ($existing !== null) {
                throw new OverlappingPayrollException($existing);
            }

            $run = PayrollRun::create([
                ...$data,
                'reference' => $this->generateReference(),
                'status' => PayrollStatus::Draft,
                'total_amount' => '0.00',
                'created_by' => $user->id,
            ]);

            $employees = Employee::where('is_active', true)
                ->with('assignments.allowances')
                ->get();
            $totalAmount = '0.00';

            foreach ($employees as $employee) {
                $salary = $employee->salaryEffectiveOn($data['period_end']);

                if ($salary === null) {
                    continue;
                }

                $salary->load('components.salaryComponent');

                $attendance = $this->calculateAttendance(
                    $employee->id,
                    $data['period_start'],
                    $data['period_end'],
                );

                $items = $this->buildPayslipItems($salary, $employee);

                $salaryAmount = $salary->getRawOriginal('gross_salary') ?? $salary->gross_salary;
                $allowancesAmount = array_reduce(
                    array_filter($items, fn (array $item) => $item['type'] === PayslipItemType::Allowance),
                    fn (string $total, array $item) => bcadd($total, $item['amount'], 2),
                    '0.00',
                );
                $taxAmount = $salary->getRawOriginal('tax_amount') ?? $salary->tax_amount;
                $securityAmount = $salary->getRawOriginal('security_amount') ?? $salary->security_amount;
                $grossSalary = bcadd($salaryAmount, $allowancesAmount, 2);
                $netSalary = $this->calculateNetSalary($grossSalary, $taxAmount, $securityAmount, '0.00');

                $payslip = $run->payslips()->create([
                    'employee_id' => $employee->id,
                    'employee_salary_id' => $salary->id,
                    'salary_amount' => $salaryAmount,
                    'allowances_amount' => $allowancesAmount,
                    'gross_salary' => $grossSalary,
                    'tax_amount' => $taxAmount,
                    'security_amount' => $securityAmount,
                    'deductions' => '0.00',
                    'net_salary' => $netSalary,
                    'days_worked' => $attendance['days_worked'],
                    'days_absent' => $attendance['days_absent'],
                ]);

                $payslip->items()->createMany($items);

                $totalAmount = bcadd($totalAmount, $netSalary, 2);
            }

            $run->update(['total_amount' => $totalAmount]);

            return $run->load('payslips.employee');
        });
    }

    /**
     * Snapshot the salary components and project allowances for a payslip.
     *
     * @return array<int, array{type: PayslipItemType, name: string, amount: string, project_id: int|null}>
     */
    private function buildPayslipItems(EmployeeSalary $salary, Employee $employee): array
    {
        $items = [];

        foreach ($salary->components as $component) {
            $items[] = [
                'type' => PayslipItemType::Component,
                'name' => $component->salaryComponent->name,
                'amount' => $component->getRawOriginal('amount') ?? $component->amount,
                'project_id' => null,
            ];
        }

        foreach ($employee->assignments as $assignment) {
            foreach ($assignment->allowances as $allowance) {
                $items[] = [
                    'type' => PayslipItemType::Allowance,
                    'name' => $allowance->name,
                    'amount' => $allowance->getRawOriginal('amount') ?? $allowance->amount,
                    'project_id' => $assignment->project_id,
                ];
            }
        }

        return $items;
    }

    /**
     * Net salary = gross − tax − security − other deductions.
     */
    private function calculateNetSalary(string $gross, string $tax, string $security, string $otherDeductions): string
    {
        return bcsub(bcsub(bcsub($gross, $tax, 2), $security, 2), $otherDeductions, 2);
    }

    /**
     * Calculate attendance stats for an employee in a period.
     *
     * @return array{days_worked: int, days_absent: int}
     */
    private function calculateAttendance(int $employeeId, string $periodStart, string $periodEnd): array
    {
        $records = Attendance::where('employee_id', $employeeId)
            ->whereBetween('date', [$periodStart, $periodEnd])
            ->get();

        $daysWorked = $records->filter(fn (Attendance $a) => in_array($a->status, [
            AttendanceStatus::Present,
            AttendanceStatus::HalfDay,
        ]))->count();

        $daysAbsent = $records->filter(fn (Attendance $a) => $a->status === AttendanceStatus::Absent)->count();

        return [
            'days_worked' => $daysWorked,
            'days_absent' => $daysAbsent,
        ];
    }

    /**
     * Update a payslip's tax, security and other deductions, then recalculate totals.
     *
     * @param  array{tax_amount: string, security_amount: string, deductions: string, notes: string|null}  $data
     *
     * @throws PayrollNotDraftException
     */
    public function updatePayslip(Payslip $payslip, array $data): Payslip
    {
        $run = $payslip->payrollRun;

        if (! $run->isDraft()) {
            throw new PayrollNotDraftException($run->status);
        }

        return DB::transaction(function () use ($payslip, $data, $run) {
            $grossSalary = $payslip->getRawOriginal('gross_salary') ?? $payslip->gross_salary;

            $payslip->update([
                'tax_amount' => $data['tax_amount'],
                'security_amount' => $data['security_amount'],
                'deductions' => $data['deductions'],
                'net_salary' => $this->calculateNetSalary(
                    $grossSalary,
                    (string) $data['tax_amount'],
                    (string) $data['security_amount'],
                    (string) $data['deductions'],
                ),
                'notes' => $data['notes'] ?? $payslip->notes,
            ]);

            $this->recalculateTotal($run);

            return $payslip;
        });
    }

    /**
     * Submit a draft payroll run.
     *
     * @throws PayrollNotDraftException
     */
    public function submit(PayrollRun $run): void
    {
        if (! $run->isDraft()) {
            throw new PayrollNotDraftException($run->status);
        }

        $run->update(['status' => PayrollStatus::Submitted]);
    }

    /**
     * Approve a submitted payroll run and create a posted journal entry.
     *
     * @throws PayrollNotSubmittedException
     * @throws EmptyPayrollException
     */
    public function approve(PayrollRun $run, User $approver): void
    {
        if (! $run->isSubmitted()) {
            throw new PayrollNotSubmittedException($run->status);
        }

        $run->load('payslips');

        if ($run->payslips->isEmpty()) {
            throw new EmptyPayrollException;
        }

        DB::transaction(function () use ($run, $approver) {
            $journalEntry = $this->journalService->create([
                'date' => now()->toDateString(),
                'description' => "Payroll: {$run->reference} ({$run->period_start->format('M Y')})",
                'type' => JournalEntryType::Payroll->value,
                'lines' => $this->buildApprovalLines($run),
            ], $approver);

            $this->journalService->post($journalEntry);

            $run->update([
                'status' => PayrollStatus::Approved,
                'journal_entry_id' => $journalEntry->id,
                'approved_by' => $approver->id,
                'approved_at' => now(),
            ]);
        });
    }

    /**
     * Build the balanced journal lines for an approved payroll run.
     *
     * Dr Salaries (salary − other deductions), Dr Project Allowances per project,
     * Cr Salary Tax Payable, Cr Employee Security Deposits, Cr payment account (net).
     *
     * @return array<int, array{account_head_id: int, project_id: int|null, debit: string, credit: string, memo: string|null}>
     */
    private function buildApprovalLines(PayrollRun $run): array
    {
        $run->load('payslips.items');

        $salaryExpense = '0.00';
        $taxTotal = '0.00';
        $securityTotal = '0.00';
        $netTotal = '0.00';
        /** @var array<int, string> $allowancesByProject */
        $allowancesByProject = [];

        foreach ($run->payslips as $payslip) {
            $salaryExpense = bcadd($salaryExpense, bcsub(
                $payslip->getRawOriginal('salary_amount') ?? $payslip->salary_amount,
                $payslip->getRawOriginal('deductions') ?? $payslip->deductions,
                2,
            ), 2);
            $taxTotal = bcadd($taxTotal, $payslip->getRawOriginal('tax_amount') ?? $payslip->tax_amount, 2);
            $securityTotal = bcadd($securityTotal, $payslip->getRawOriginal('security_amount') ?? $payslip->security_amount, 2);
            $netTotal = bcadd($netTotal, $payslip->getRawOriginal('net_salary') ?? $payslip->net_salary, 2);

            foreach ($payslip->items as $item) {
                if ($item->type !== PayslipItemType::Allowance) {
                    continue;
                }

                $projectId = (int) $item->project_id;
                $allowancesByProject[$projectId] = bcadd(
                    $allowancesByProject[$projectId] ?? '0.00',
                    $item->getRawOriginal('amount') ?? $item->amount,
                    2,
                );
            }
        }

        $lines = [
            $this->journalLine('5001', null, $salaryExpense, '0.00', "Salaries for {$run->reference}"),
        ];

        foreach ($allowancesByProject as $projectId => $amount) {
            $lines[] = $this->journalLine('5006', $projectId ?: null, $amount, '0.00', "Project allowances for {$run->reference}");
        }

        $lines[] = $this->journalLine('2030', null, '0.00', $taxTotal, "Tax withheld for {$run->reference}");
        $lines[] = $this->journalLine('2040', null, '0.00', $securityTotal, "Security withheld for {$run->reference}");
        $lines[] = $this->journalLine($run->payment_account_id, null, '0.00', $netTotal, "Payment for payroll {$run->reference}");

        return array_values(array_filter(
            $lines,
            fn (array $line) => bccomp($line['debit'], '0', 2) !== 0 || bccomp($line['credit'], '0', 2) !== 0,
        ));
    }

    /**
     * Build a journal line. A string account is treated as an account code and
     * resolved only when the line carries an amount.
     *
     * @return array{account_head_id: int|null, project_id: int|null, debit: string, credit: string, memo: string|null}
     */
    private function journalLine(int|string $account, ?int $projectId, string $debit, string $credit, ?string $memo): array
    {
        $hasAmount = bccomp($debit, '0', 2) !== 0 || bccomp($credit, '0', 2) !== 0;

        if (is_string($account)) {
            $account = $hasAmount ? AccountHead::where('code', $account)->firstOrFail()->id : null;
        }

        return [
            'account_head_id' => $account,
            'project_id' => $projectId,
            'debit' => $debit,
            'credit' => $credit,
            'memo' => $memo,
        ];
    }

    /**
     * Reject a submitted payroll run.
     *
     * @throws PayrollNotSubmittedException
     */
    public function reject(PayrollRun $run, User $rejector, string $reason): void
    {
        if (! $run->isSubmitted()) {
            throw new PayrollNotSubmittedException($run->status);
        }

        $run->update([
            'status' => PayrollStatus::Rejected,
            'approved_by' => $rejector->id,
            'approved_at' => now(),
            'rejection_reason' => $reason,
        ]);
    }

    /**
     * Delete a draft payroll run.
     *
     * @throws PayrollNotDraftException
     */
    public function delete(PayrollRun $run): void
    {
        if (! $run->isDraft()) {
            throw new PayrollNotDraftException($run->status);
        }

        $run->delete();
    }

    /**
     * Recalculate the total amount for a payroll run from its payslips.
     */
    private function recalculateTotal(PayrollRun $run): void
    {
        $total = '0.00';

        foreach ($run->payslips()->get() as $payslip) {
            $netSalary = $payslip->getRawOriginal('net_salary') ?? $payslip->net_salary;
            $total = bcadd($total, $netSalary, 2);
        }

        $run->update(['total_amount' => $total]);
    }
}
