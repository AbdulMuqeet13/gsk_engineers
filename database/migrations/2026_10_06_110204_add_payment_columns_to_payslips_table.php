<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add per-payslip payment tracking. Runs approved before this change paid
     * every payslip on approval, so their payslips are marked as paid.
     */
    public function up(): void
    {
        Schema::table('payslips', function (Blueprint $table) {
            $table->date('paid_at')->nullable()->after('notes');
            $table->foreignId('payment_account_id')->nullable()->after('paid_at')->constrained('account_heads')->restrictOnDelete();
            $table->foreignId('payment_journal_entry_id')->nullable()->after('payment_account_id')->constrained('journal_entries')->nullOnDelete();
            $table->foreignId('paid_by')->nullable()->after('payment_journal_entry_id')->constrained('users')->nullOnDelete();

            $table->index('paid_at');
        });

        DB::table('payroll_runs')
            ->where('status', 'approved')
            ->orderBy('id')
            ->each(function (object $run) {
                DB::table('payslips')
                    ->where('payroll_run_id', $run->id)
                    ->update([
                        'paid_at' => $run->approved_at !== null ? substr($run->approved_at, 0, 10) : null,
                        'payment_account_id' => $run->payment_account_id,
                        'payment_journal_entry_id' => $run->journal_entry_id,
                        'paid_by' => $run->approved_by,
                    ]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payslips', function (Blueprint $table) {
            $table->dropIndex(['paid_at']);
            $table->dropConstrainedForeignId('paid_by');
            $table->dropConstrainedForeignId('payment_journal_entry_id');
            $table->dropConstrainedForeignId('payment_account_id');
            $table->dropColumn('paid_at');
        });
    }
};
