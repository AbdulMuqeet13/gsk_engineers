<?php

namespace App\Enums;

enum RoleEnum: string
{
    case SuperAdmin = 'Super Admin';
    case Accountant = 'Accountant';
    case ProjectManager = 'Project Manager';
    case Hr = 'HR';
    case Viewer = 'Viewer';

    /**
     * @return string[]
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
