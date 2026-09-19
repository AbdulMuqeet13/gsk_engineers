<?php

namespace App\Enums;

enum EmployeeType: string
{
    case Internal = 'internal';
    case Project = 'project';

    /**
     * @return string[]
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
