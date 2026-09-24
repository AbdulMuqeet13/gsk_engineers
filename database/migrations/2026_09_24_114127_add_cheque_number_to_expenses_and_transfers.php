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
        Schema::table('expenses', function (Blueprint $table) {
            $table->string('cheque_number', 100)->nullable()->after('notes');
        });

        Schema::table('inter_project_transfers', function (Blueprint $table) {
            $table->string('cheque_number', 100)->nullable()->after('purpose');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropColumn('cheque_number');
        });

        Schema::table('inter_project_transfers', function (Blueprint $table) {
            $table->dropColumn('cheque_number');
        });
    }
};
