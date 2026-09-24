<?php

namespace App\Enums;

enum AttendanceSource: string
{
    case Manual = 'manual';
    case Biometric = 'biometric';

    /**
     * @return string[]
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
