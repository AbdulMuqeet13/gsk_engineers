<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payslips', function (Blueprint $table) {
            $table->renameColumn('basic_salary', 'salary_amount');
        });

        Schema::table('payslips', function (Blueprint $table) {
            $table->foreignId('employee_salary_id')->nullable()->after('employee_id')->constrained()->nullOnDelete();
            $table->decimal('allowances_amount', 18, 2)->default(0)->after('salary_amount');
            $table->decimal('gross_salary', 18, 2)->default(0)->after('allowances_amount');
            $table->decimal('tax_amount', 18, 2)->default(0)->after('gross_salary');
            $table->decimal('security_amount', 18, 2)->default(0)->after('tax_amount');
        });

        DB::table('payslips')->update(['gross_salary' => DB::raw('salary_amount')]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payslips', function (Blueprint $table) {
            $table->dropConstrainedForeignId('employee_salary_id');
            $table->dropColumn(['allowances_amount', 'gross_salary', 'tax_amount', 'security_amount']);
        });

        Schema::table('payslips', function (Blueprint $table) {
            $table->renameColumn('salary_amount', 'basic_salary');
        });
    }
};
