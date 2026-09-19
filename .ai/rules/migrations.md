# Migration Rules

## General
- Keep migrations small and focused — one table or one related set of changes per migration
- All migrations must be reversible (implement `down()`)
- Use `php artisan make:migration` to create migrations — never create migration files manually

## Money Columns
- Use `$table->decimal('column_name', 18, 2)` for all monetary amounts
- Never use `float`, `double`, or `integer` for money storage

## Enum Columns
- Use `$table->string('column_name')` for enum-backed columns — not database-level ENUMs
- This ensures portability across database engines and easier enum value additions

## Foreign Keys
- Always add foreign key constraints: `$table->foreignId('project_id')->constrained()->cascadeOnDelete()` or `->nullOnDelete()` as appropriate
- Use `nullOnDelete()` for optional relationships, `cascadeOnDelete()` for ownership relationships
- Use `restrictOnDelete()` for financial records that must not be orphaned

## Soft Deletes
- Add `$table->softDeletes()` to master data tables (projects, employees, account_heads)
- Do NOT add soft deletes to financial transaction tables (journal_entries, journal_lines) — these use status-based immutability

## Indexes
- Add indexes on columns used in WHERE clauses, JOINs, and ORDER BY
- Always index `project_id` on journal_lines (frequent dimension filtering)
- Always index `status` on tables with status-based queries
