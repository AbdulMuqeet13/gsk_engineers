# Seeders

## Execution Order

`DatabaseSeeder` calls seeders in this order:

1. `RolesAndPermissionsSeeder` -- roles and permissions (must run first)
2. `ChartOfAccountsSeeder` -- 20 default account heads

## RolesAndPermissionsSeeder

Seeds 5 roles with their permissions. Uses Spatie's `Role::findOrCreate()` and `Permission::findOrCreate()` for idempotency.

## ChartOfAccountsSeeder

Seeds 20 default accounts using `firstOrCreate` on the `code` field (idempotent).

Normal balance auto-determined by type:
- **Debit**: Asset, Expense
- **Credit**: Liability, Equity, Income

Parent accounts are created first, then children reference parent IDs.

See [[04-Phases/Phase 2 - Master Data#Default Accounts Seeded 20]] for the full list.

## Running Seeders

```bash
# Fresh migration + seed
php artisan migrate:fresh --seed

# Run specific seeder
php artisan db:seed --class=ChartOfAccountsSeeder
```
