<?php

namespace App\Enums;

enum PayslipItemType: string
{
    case Component = 'component';
    case Allowance = 'allowance';

    /**
     * @return string[]
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
