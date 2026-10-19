<?php

namespace App\Concerns;

use App\Enums\AccountType;
use App\Enums\NormalBalance;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ExpenseValidationRules
{
    /**
     * Rules for the expense category (debited) and payment account (credited).
     *
     * The category may be any active debit-normal expense or asset account; the
     * payment account may be any active debit-normal asset account other than the category.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function expenseAccountRules(): array
    {
        return [
            'account_head_id' => [
                'required',
                'integer',
                Rule::exists('account_heads', 'id')
                    ->whereIn('type', [AccountType::Expense->value, AccountType::Asset->value])
                    ->where('normal_balance', NormalBalance::Debit->value)
                    ->where('is_active', true)
                    ->whereNull('deleted_at'),
            ],
            'payment_account_id' => [
                'required',
                'integer',
                'different:account_head_id',
                Rule::exists('account_heads', 'id')
                    ->where('type', AccountType::Asset->value)
                    ->where('normal_balance', NormalBalance::Debit->value)
                    ->where('is_active', true)
                    ->whereNull('deleted_at'),
            ],
        ];
    }
}
