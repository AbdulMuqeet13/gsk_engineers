<?php

namespace App\Services;

use App\Enums\SalaryChangeType;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class EmployeeService
{
    public function __construct(private SalaryService $salaryService) {}

    /**
     * Create an employee together with their initial salary record,
     * effective from the date of joining.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?User $user): Employee
    {
        return DB::transaction(function () use ($data, $user) {
            $employee = Employee::create(Arr::except($data, ['components', 'tax_amount', 'security_amount']));

            $this->salaryService->record($employee, [
                'effective_date' => $data['date_of_joining'],
                'change_type' => SalaryChangeType::Initial->value,
                'components' => $data['components'],
                'tax_amount' => $data['tax_amount'] ?? null,
                'security_amount' => $data['security_amount'] ?? null,
                'remarks' => null,
            ], $user);

            return $employee;
        });
    }
}
