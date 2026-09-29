<?php

namespace App\Services;

use App\Enums\JournalEntryType;
use App\Exceptions\Salaries\InsufficientSecurityBalanceException;
use App\Models\AccountHead;
use App\Models\Employee;
use App\Models\SecurityRefund;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SecurityDepositService
{
    public function __construct(private JournalService $journalService) {}

    /**
     * Refund part or all of an employee's held security deposit and post
     * the journal entry (Dr Employee Security Deposits / Cr payment account).
     *
     * @param  array{amount: string, date: string, payment_account_id: int, remarks?: string|null}  $data
     *
     * @throws InsufficientSecurityBalanceException
     */
    public function refund(Employee $employee, array $data, User $user): SecurityRefund
    {
        return DB::transaction(function () use ($employee, $data, $user) {
            Employee::whereKey($employee->id)->lockForUpdate()->first();

            $balance = $employee->securityBalance();

            if (bccomp((string) $data['amount'], $balance, 2) === 1) {
                throw new InsufficientSecurityBalanceException($balance);
            }

            $refund = $employee->securityRefunds()->create([
                ...$data,
                'created_by' => $user->id,
            ]);

            $amount = $refund->getRawOriginal('amount') ?? $refund->amount;
            $securityAccount = AccountHead::where('code', '2040')->firstOrFail();

            $journalEntry = $this->journalService->create([
                'date' => $data['date'],
                'description' => "Security deposit refund: {$employee->name}",
                'type' => JournalEntryType::Payroll->value,
                'lines' => [
                    [
                        'account_head_id' => $securityAccount->id,
                        'project_id' => null,
                        'debit' => $amount,
                        'credit' => '0.00',
                        'memo' => "Security refund to {$employee->name}",
                    ],
                    [
                        'account_head_id' => $data['payment_account_id'],
                        'project_id' => null,
                        'debit' => '0.00',
                        'credit' => $amount,
                        'memo' => $data['remarks'] ?? null,
                    ],
                ],
            ], $user);

            $this->journalService->post($journalEntry);

            $refund->update(['journal_entry_id' => $journalEntry->id]);

            return $refund;
        });
    }
}
