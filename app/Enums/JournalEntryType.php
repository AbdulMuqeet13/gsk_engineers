<?php

namespace App\Enums;

enum JournalEntryType: string
{
    case Standard = 'standard';
    case Simple = 'simple';
    case Payroll = 'payroll';
    case Transfer = 'transfer';
    case Opening = 'opening';
    case Expense = 'expense';

    /**
     * @return string[]
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
