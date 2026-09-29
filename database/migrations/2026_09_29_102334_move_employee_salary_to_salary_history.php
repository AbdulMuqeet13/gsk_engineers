<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create an initial salary history record for every existing employee,
     * then drop the flat salary column.
     */
    public function up(): void
    {
        $basicComponentId = DB::table('salary_components')->where('name', 'Basic Salary')->value('id');
        $now = now();

        DB::table('employees')->orderBy('id')->each(function (object $employee) use ($basicComponentId, $now) {
            $salaryId = DB::table('employee_salaries')->insertGetId([
                'employee_id' => $employee->id,
                'effective_date' => $employee->date_of_joining,
                'change_type' => 'initial',
                'gross_salary' => $employee->salary,
                'tax_amount' => 0,
                'security_amount' => 0,
                'remarks' => 'Migrated from employee record',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('employee_salary_components')->insert([
                'employee_salary_id' => $salaryId,
                'salary_component_id' => $basicComponentId,
                'amount' => $employee->salary,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn('salary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->decimal('salary', 18, 2)->default(0)->after('date_of_joining');
        });

        DB::table('employees')->orderBy('id')->each(function (object $employee) {
            $latestGross = DB::table('employee_salaries')
                ->where('employee_id', $employee->id)
                ->orderByDesc('effective_date')
                ->orderByDesc('id')
                ->value('gross_salary');

            DB::table('employees')->where('id', $employee->id)->update(['salary' => $latestGross ?? 0]);
        });
    }
};
