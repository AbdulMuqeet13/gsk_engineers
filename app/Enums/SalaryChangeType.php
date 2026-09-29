<?php

namespace App\Enums;

enum SalaryChangeType: string
{
    case Initial = 'initial';
    case Increment = 'increment';
    case Decrement = 'decrement';
    case Revision = 'revision';

    /**
     * @return string[]
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
