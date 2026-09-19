<?php

namespace App\Services;

use App\Enums\AttendanceStatus;
use App\Enums\JournalEntryType;
use App\Enums\PayrollStatus;
use App\Exceptions\Payroll\EmptyPayrollException;
use App\Exceptions\Payroll\PayrollNotDraftException;
use App\Exceptions\Payroll\PayrollNotSubmittedException;
use App\Models\AccountHead;
use App\Models\Attendance;
use App\Models\Employee;
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
     */
    public function create(array $data, User $user): PayrollRun
    {
        return DB::transaction(function () use ($data, $user) {
            $run = PayrollRun::create([
                ...$data,
                'reference' => $this->generateReference(),
                'status' => PayrollStatus::Draft,
                'total_amount' => '0.00',
                'created_by' => $user->id,
            ]);

            $employees = Employee::where('is_active', true)->get();
            $totalAmount = '0.00';

            foreach ($employees as $employee) {
                $attendance = $this->calculateAttendance(
                    $employee->id,
                    $data['period_start'],
                    $data['period_end'],
                );

                $basicSalary = $employee->getRawOriginal('salary') ?? $employee->salary;
                $netSalary = $basicSalary;

                $run->payslips()->create([
                    'employee_id' => $employee->id,
                    'basic_salary' => $basicSalary,
                    'deductions' => '0.00',
                    'net_salary' => $netSalary,
                    'days_worked' => $attendance['days_worked'],
                    'days_absent' => $attendance['days_absent'],
                ]);

                $totalAmount = bcadd($totalAmount, $netSalary, 2);
            }

            $run->update(['total_amount' => $totalAmount]);

            return $run->load('payslips.employee');
        });
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
     * Update a payslip's deductions and recalculate totals.
     *
     * @param  array{deductions: string, notes: string|null}  $data
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
            $basicSalary = $payslip->getRawOriginal('basic_salary') ?? $payslip->basic_salary;
            $deductions = $data['deductions'];
            $netSalary = bcsub($basicSalary, $deductions, 2);

            $payslip->update([
                'deductions' => $deductions,
                'net_salary' => $netSalary,
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
            $totalAmount = $run->getRawOriginal('total_amount') ?? $run->total_amount;

            $salariesAccount = AccountHead::where('code', '5001')->firstOrFail();

            $journalEntry = $this->journalService->create([
                'date' => now()->toDateString(),
                'description' => "Payroll: {$run->reference} ({$run->period_start->format('M Y')})",
                'type' => JournalEntryType::Payroll->value,
                'lines' => [
                    [
                        'account_head_id' => $salariesAccount->id,
                        'project_id' => null,
                        'debit' => $totalAmount,
                        'credit' => '0.00',
                        'memo' => "Salaries for {$run->reference}",
                    ],
                    [
                        'account_head_id' => $run->payment_account_id,
                        'project_id' => null,
                        'debit' => '0.00',
                        'credit' => $totalAmount,
                        'memo' => "Payment for payroll {$run->reference}",
                    ],
                ],
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
