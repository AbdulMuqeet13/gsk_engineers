# Seeders

## Execution Order

`DatabaseSeeder` calls seeders in this order:

1. `RolesAndPermissionsSeeder` -- roles and permissions (must run first)
2. `ChartOfAccountsSeeder` -- 23 default account heads
3. `DemoDataSeeder` -- demo projects, employees (with salary records and a mid-year increment), assignments (with allowances), attendance, leave, incomes, expenses, payroll, transfers

## RolesAndPermissionsSeeder

Seeds 5 roles with their permissions. Uses Spatie's `Role::findOrCreate()` and `Permission::findOrCreate()` for idempotency.

## ChartOfAccountsSeeder

Seeds 23 default accounts using `firstOrCreate` on the `code` field (idempotent).

Normal balance auto-determined by type:
- **Debit**: Asset, Expense
- **Credit**: Liability, Equity, Income

Parent accounts are created first, then children reference parent IDs.

See [[04-Phases/Phase 2 - Master Data#Default Accounts Seeded 20]] for the original list. Phase 9 added **2030 Salary Tax Payable**, **2040 Employee Security Deposits** and **5006 Project Allowances** -- re-run the seeder after deploying (it is idempotent).

## Salary Components

The four default components (Basic Salary, House Rent, Medical, Conveyance) are inserted by the `create_salary_components_table` **migration**, not a seeder, so they exist on every environment after `migrate`.

## Running Seeders

```bash
# Fresh migration + seed
php artisan migrate:fresh --seed

# Run specific seeder
php artisan db:seed --class=ChartOfAccountsSeeder
```
