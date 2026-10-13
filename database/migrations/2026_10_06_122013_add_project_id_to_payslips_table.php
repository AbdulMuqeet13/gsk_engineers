<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Snapshot the project of project-type employees on their payslips, so
     * salary payments are tagged to the project the salary was earned on.
     * Existing payslips take the employee's current project.
     */
    public function up(): void
    {
        Schema::table('payslips', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->after('employee_id')->constrained()->nullOnDelete();
        });

        DB::table('employees')
            ->where('type', 'project')
            ->whereNotNull('project_id')
            ->orderBy('id')
            ->each(function (object $employee) {
                DB::table('payslips')
                    ->where('employee_id', $employee->id)
                    ->update(['project_id' => $employee->project_id]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payslips', function (Blueprint $table) {
            $table->dropConstrainedForeignId('project_id');
        });
    }
};
