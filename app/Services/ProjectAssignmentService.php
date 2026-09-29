<?php

namespace App\Services;

use App\Models\ProjectAssignment;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class ProjectAssignmentService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): ProjectAssignment
    {
        return DB::transaction(function () use ($data) {
            $assignment = ProjectAssignment::create(Arr::except($data, ['allowances']));

            $this->syncAllowances($assignment, $data['allowances'] ?? []);

            return $assignment;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(ProjectAssignment $assignment, array $data): ProjectAssignment
    {
        return DB::transaction(function () use ($assignment, $data) {
            $assignment->update(Arr::except($data, ['allowances']));

            if (array_key_exists('allowances', $data)) {
                $this->syncAllowances($assignment, $data['allowances'] ?? []);
            }

            return $assignment;
        });
    }

    /**
     * Replace the assignment's allowances with the given list. Past payslips keep
     * their own snapshot, so replacing allowances never changes payroll history.
     *
     * @param  array<int, array{name: string, amount: string}>  $allowances
     */
    private function syncAllowances(ProjectAssignment $assignment, array $allowances): void
    {
        $assignment->allowances()->delete();

        foreach ($allowances as $allowance) {
            $assignment->allowances()->create([
                'name' => $allowance['name'],
                'amount' => $allowance['amount'],
            ]);
        }
    }
}
