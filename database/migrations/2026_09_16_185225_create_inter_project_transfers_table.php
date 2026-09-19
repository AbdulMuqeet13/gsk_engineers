<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inter_project_transfers', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('from_project_id')->constrained('projects')->restrictOnDelete();
            $table->foreignId('to_project_id')->constrained('projects')->restrictOnDelete();
            $table->foreignId('from_account_id')->constrained('account_heads')->restrictOnDelete();
            $table->foreignId('to_account_id')->constrained('account_heads')->restrictOnDelete();
            $table->decimal('amount', 18, 2);
            $table->date('date');
            $table->string('purpose', 500);
            $table->foreignId('journal_entry_id')->nullable()->constrained('journal_entries')->nullOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();

            $table->index('from_project_id');
            $table->index('to_project_id');
            $table->index('date');
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inter_project_transfers');
    }
};
