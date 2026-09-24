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
        Schema::table('attendances', function (Blueprint $table) {
            $table->string('source', 50)->default('manual')->after('notes');

            // Drop the existing foreign key so we can make the column nullable
            $table->dropForeign(['marked_by']);
            $table->foreignId('marked_by')->nullable()->change();
            $table->foreign('marked_by')->references('id')->on('users')->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropForeign(['marked_by']);
            $table->foreignId('marked_by')->nullable(false)->change();
            $table->foreign('marked_by')->references('id')->on('users')->restrictOnDelete();

            $table->dropColumn('source');
        });
    }
};
