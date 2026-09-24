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
        });

        // Drop the existing foreign key so we can make the column nullable.
        // Done in a separate call so we can handle cases where the FK name differs.
        $fkName = $this->getForeignKeyName('attendances', 'marked_by');

        if ($fkName) {
            Schema::table('attendances', function (Blueprint $table) use ($fkName) {
                $table->dropForeign($fkName);
            });
        }

        Schema::table('attendances', function (Blueprint $table) {
            $table->unsignedBigInteger('marked_by')->nullable()->change();
            $table->foreign('marked_by')->references('id')->on('users')->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $fkName = $this->getForeignKeyName('attendances', 'marked_by');

        if ($fkName) {
            Schema::table('attendances', function (Blueprint $table) use ($fkName) {
                $table->dropForeign($fkName);
            });
        }

        Schema::table('attendances', function (Blueprint $table) {
            $table->unsignedBigInteger('marked_by')->nullable(false)->change();
            $table->foreign('marked_by')->references('id')->on('users')->restrictOnDelete();

            $table->dropColumn('source');
        });
    }

    /**
     * Look up the actual foreign key constraint name from the database.
     */
    private function getForeignKeyName(string $table, string $column): ?string
    {
        $keys = Schema::getForeignKeys($table);

        foreach ($keys as $key) {
            if (in_array($column, $key['columns'], true)) {
                return $key['name'];
            }
        }

        return null;
    }
};
