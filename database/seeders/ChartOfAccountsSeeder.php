<?php

namespace Database\Seeders;

use App\Enums\AccountType;
use App\Enums\NormalBalance;
use App\Models\AccountHead;
use Illuminate\Database\Seeder;

class ChartOfAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            ['code' => '1000', 'name' => 'Assets', 'type' => AccountType::Asset, 'parent_code' => null],
            ['code' => '1001', 'name' => 'Cash', 'type' => AccountType::Asset, 'parent_code' => '1000'],
            ['code' => '1002', 'name' => 'Bank', 'type' => AccountType::Asset, 'parent_code' => '1000'],
            ['code' => '1003', 'name' => 'Project Fund', 'type' => AccountType::Asset, 'parent_code' => '1000'],
            ['code' => '1010', 'name' => 'Accounts Receivable', 'type' => AccountType::Asset, 'parent_code' => '1000'],
            ['code' => '1020', 'name' => 'Inter-Project Receivable', 'type' => AccountType::Asset, 'parent_code' => '1000'],

            ['code' => '2000', 'name' => 'Liabilities', 'type' => AccountType::Liability, 'parent_code' => null],
            ['code' => '2010', 'name' => 'Accounts Payable', 'type' => AccountType::Liability, 'parent_code' => '2000'],
            ['code' => '2020', 'name' => 'Inter-Project Payable', 'type' => AccountType::Liability, 'parent_code' => '2000'],

            ['code' => '3000', 'name' => 'Equity', 'type' => AccountType::Equity, 'parent_code' => null],
            ['code' => '3001', 'name' => 'Owner Equity', 'type' => AccountType::Equity, 'parent_code' => '3000'],
            ['code' => '3002', 'name' => 'Retained Earnings', 'type' => AccountType::Equity, 'parent_code' => '3000'],

            ['code' => '4000', 'name' => 'Income', 'type' => AccountType::Income, 'parent_code' => null],
            ['code' => '4001', 'name' => 'Project Income', 'type' => AccountType::Income, 'parent_code' => '4000'],

            ['code' => '5000', 'name' => 'Expenses', 'type' => AccountType::Expense, 'parent_code' => null],
            ['code' => '5001', 'name' => 'Salaries', 'type' => AccountType::Expense, 'parent_code' => '5000'],
            ['code' => '5002', 'name' => 'Rent', 'type' => AccountType::Expense, 'parent_code' => '5000'],
            ['code' => '5003', 'name' => 'Fuel', 'type' => AccountType::Expense, 'parent_code' => '5000'],
            ['code' => '5004', 'name' => 'Food', 'type' => AccountType::Expense, 'parent_code' => '5000'],
            ['code' => '5005', 'name' => 'General Expenses', 'type' => AccountType::Expense, 'parent_code' => '5000'],
        ];

        foreach ($accounts as $account) {
            $parentId = null;

            if ($account['parent_code'] !== null) {
                $parentId = AccountHead::where('code', $account['parent_code'])->value('id');
            }

            $normalBalance = in_array($account['type'], [AccountType::Asset, AccountType::Expense])
                ? NormalBalance::Debit
                : NormalBalance::Credit;

            AccountHead::firstOrCreate(
                ['code' => $account['code']],
                [
                    'name' => $account['name'],
                    'type' => $account['type'],
                    'normal_balance' => $normalBalance,
                    'parent_id' => $parentId,
                    'is_active' => true,
                ],
            );
        }
    }
}
