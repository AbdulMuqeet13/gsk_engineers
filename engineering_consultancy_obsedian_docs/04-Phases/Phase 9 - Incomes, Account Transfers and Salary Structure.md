# Phase 9 - Incomes, Account Transfers and Salary Structure (Done - 2026-09-29)

## What Was Built

This phase added project income receipts, transfers between the company's own accounts, a full salary structure (history, breakdown, tax, security deposit, project allowances), a shadcn date picker across the app, and several app-wide fixes.

---

### 1. Project Incomes

Records payments received for a project into any asset account (Cash, Bank, or Accounts Receivable when the client has not paid yet).

- Table: `project_incomes` (reference `INC-YYYY-NNNNNN`)
- Model: `ProjectIncome`
- Service: `IncomeService::record()` / `reverse()`
- Actions: `CreateProjectIncomeAction`, `ReverseProjectIncomeAction`
- Controller: `ProjectIncomeController` (index, store, reverse)
- Requests: `StoreProjectIncomeRequest` (income account must be an active `income` account, deposit account an active `asset` account, project must not be completed/cancelled), `ReverseProjectIncomeRequest`
- Exception: `IncomeAlreadyReversedException`
- Policy: `ProjectIncomePolicy`
- Permissions: `incomes.view`, `incomes.create`
- Page: `resources/js/pages/incomes/index.tsx`
- Journal type: `income`

Journal entry posted immediately on save (both lines tagged with the project):

| Account | Debit | Credit |
|---|---|---|
| Deposit account (Cash / Bank / Receivable) | amount | |
| Income account (default 4001 Project Income) | | amount |

Reversal uses `JournalService::reverse()`; the income shows as **Reversed**.

### 2. Account Transfers

Moves funds between two active asset accounts, e.g. Bank → Cash, Cash → Bank, Receivable → Bank (client paying an invoice recorded as receivable). Optional project tag so the movement appears in that project's cashbook.

- Table: `account_transfers` (reference `ACT-YYYY-NNNNNN`)
- Model: `AccountTransfer`
- Service: `AccountTransferService::execute()` / `reverse()`
- Actions: `CreateAccountTransferAction`, `ReverseAccountTransferAction`
- Controller: `AccountTransferController` (index, store, reverse)
- Requests: `StoreAccountTransferRequest` (`to_account_id` must differ from `from_account_id`), `ReverseAccountTransferRequest`
- Exception: `AccountTransferAlreadyReversedException`
- Policy: `AccountTransferPolicy`
- Permissions: `account-transfers.view`, `account-transfers.create`
- Page: `resources/js/pages/account-transfers/index.tsx` (filter by account on either side, project, dates)
- Journal type: `account_transfer`

Journal entry: **Dr** destination account / **Cr** source account (both lines carry the optional project).

### 3. Salary Structure

Replaces the flat `employees.salary` column.

**Salary history** -- `employee_salaries`
- One record per salary change: `effective_date`, `change_type` (`SalaryChangeType`: initial / increment / decrement / revision), `gross_salary`, `tax_amount`, `security_amount`, `remarks`, `created_by`
- An **Initial** record is created with the employee (effective on date of joining)
- Increments / revisions add new records; nothing is overwritten
- `Employee::currentSalary()` = latest record effective **on or before today** (future-dated increments show as *Upcoming*)
- `Employee::salaryEffectiveOn($date)` = latest record effective on or before a date (used by payroll)
- A record used by a payslip, or an employee's only record, cannot be deleted (`SalaryRecordInUseException`, `OnlySalaryRecordException`)

**Salary breakdown** -- `salary_components` + `employee_salary_components`
- Admin-defined components (default: Basic Salary, House Rent, Medical, Conveyance -- inserted by the migration)
- Each salary record stores an amount per component; gross = sum of components
- Blank / zero component amounts are not stored
- Deleting a component is a soft delete; old records keep their amounts and names

**Tax** -- fixed monthly amount on each salary record.

**Security deposit** -- fixed monthly deduction on each salary record, held as a refundable liability (2040).
- Balance = security deducted in **approved** payroll runs − refunds (`Employee::securityBalance()`)
- Refunds: `security_refunds` table, `SecurityDepositService::refund()` (locks the employee row, cannot exceed the balance -> `InsufficientSecurityBalanceException`), posts **Dr 2040 / Cr payment account**
- Permission: `payroll.approve`

**Project allowances** -- `assignment_allowances`
- Named monthly allowances on a project assignment (e.g. Site 10,000, Fuel 5,000)
- Saved with the assignment form via `ProjectAssignmentService` (create/update replace the allowance list in one transaction)
- Permission: `projects.assign`

Services / actions: `SalaryService` (record, delete), `EmployeeService::create()` (employee + initial salary), `SecurityDepositService`, `ProjectAssignmentService`, `RecordEmployeeSalaryAction`, `DeleteEmployeeSalaryAction`, `RefundSecurityDepositAction`, `Create/Update/DeleteSalaryComponentAction`.

Controllers: `EmployeeController@show` (new employee page), `EmployeeSalaryController` (store, destroy -- scoped bindings), `SecurityRefundController@store`, `SalaryComponentController` (index, store, update, destroy).

Shared validation: `App\Concerns\SalaryValidationRules` (`salaryBreakdownRules()`, `salaryBreakdownAttributes()`, `componentsTotalIsPositive()`), used by `StoreEmployeeRequest` and `StoreEmployeeSalaryRequest`.

### 4. Payroll Changes

`PayrollService::create()` per active employee:
1. `salaryEffectiveOn(period_end)` -- employees with no effective salary are **skipped** (the flash message reports how many)
2. Snapshots components and project allowances into `payslip_items` (`PayslipItemType`: component / allowance, allowance items carry `project_id`)
3. `salary_amount` = record gross, `allowances_amount` = sum of allowances, `gross_salary` = both, `tax_amount`, `security_amount` from the record
4. **Net = gross − tax − security − other deductions**

`payslips` columns: `basic_salary` renamed to `salary_amount`; added `employee_salary_id`, `allowances_amount`, `gross_salary`, `tax_amount`, `security_amount`. `deductions` is now "Other deductions".

Draft payslip edit (`UpdatePayslipRequest`): tax, security, other deductions, notes; total deductions cannot exceed gross.

**Approval journal entry** (`PayrollService::buildApprovalLines()`; zero lines skipped; accounts resolved by code with `firstOrFail`):

| Account | Debit | Credit |
|---|---|---|
| 5001 Salaries | Σ(salary − other deductions) | |
| 5006 Project Allowances (one line per project, tagged) | Σ allowances | |
| 2030 Salary Tax Payable | | Σ tax |
| 2040 Employee Security Deposits | | Σ security |
| Payment account | | Σ net |

**Overlapping runs blocked** -- `PayrollRun::scopeOverlapping()`; a new run cannot overlap an existing run unless that run is **rejected**. Checked in `StorePayrollRunRequest::after()` (field error on `period_start`) and again in `PayrollService::create()` (`OverlappingPayrollException`, with row lock).

Payslip PDF now lists every earning (components + allowances with project code) and deductions (tax, security, other).

### 5. Date Picker and Date Format

- All 46 native `<input type="date">` replaced by `components/date-picker.tsx` (shadcn Calendar + Popover, month/year dropdowns, clearable in filters, `size="sm"` in toolbars)
- New UI primitive: `components/ui/calendar.tsx` (shadcn, `react-day-picker` v9)
- Helpers: `lib/dates.ts` (`parseIsoDate`, `toIsoDate`, `formatDate`), `toInputDate()` in `lib/utils.ts`
- **Display format everywhere: `dd-mm-yyyy`**; timestamps `dd-mm-yyyy hh:mm AM/PM`
  - Model casts `date:d-m-Y` / `datetime:d-m-Y h:i A`
  - Report controllers `format('d-m-Y')`, PDF header "Generated on", payslip period
- The picker always submits **ISO `YYYY-MM-DD`** to the server (see [[08-Gotchas/Known Issues]])

### 6. App-wide Fixes

- **Toasts never appeared** -- `FlashesToast` wrote to `session('toast')` but the frontend listens for Inertia's `flash` router event. Now uses `Inertia::flash('toast', ...)`; the unused shared `flash` prop was removed from `HandleInertiaRequests`. Tests assert with `assertInertiaFlash('toast', ...)`.
- **Clearing a list filter had no effect** -- `useDataTable.reload()` dropped empty values, and Inertia merges `data` into the current query string, so the old value stayed. Empty values are now sent as `undefined`, which removes them.
- **Payroll Report React key warning** -- the fragment in `runs.map` now has a `key`.
- **Long project names overflowed** select fields in the Record Income / Account Transfer dialogs (triggers are now `w-full min-w-0`).

## Migrations

```
2026_09_29_085945_create_project_incomes_table
2026_09_29_085946_create_account_transfers_table
2026_09_29_102327_create_salary_components_table        (inserts 4 default components)
2026_09_29_102328_create_employee_salaries_table
2026_09_29_102329_create_employee_salary_components_table
2026_09_29_102330_create_assignment_allowances_table
2026_09_29_102331_create_payslip_items_table
2026_09_29_102332_create_security_refunds_table
2026_09_29_102333_add_breakdown_columns_to_payslips_table   (renames basic_salary -> salary_amount, backfills gross_salary)
2026_09_29_102334_move_employee_salary_to_salary_history    (Initial record per employee, then drops employees.salary; down() restores it)
```

## New Routes

```
GET    /incomes                                   -> ProjectIncomeController@index
POST   /incomes                                   -> ProjectIncomeController@store
POST   /incomes/{income}/reverse                  -> ProjectIncomeController@reverse
GET    /account-transfers                         -> AccountTransferController@index
POST   /account-transfers                         -> AccountTransferController@store
POST   /account-transfers/{account_transfer}/reverse -> AccountTransferController@reverse
GET    /employees/{employee}                      -> EmployeeController@show
POST   /employees/{employee}/salaries             -> EmployeeSalaryController@store
DELETE /employees/{employee}/salaries/{salary}    -> EmployeeSalaryController@destroy
POST   /employees/{employee}/security-refunds     -> SecurityRefundController@store
GET    /payroll/salary-components                 -> SalaryComponentController@index
POST   /payroll/salary-components                 -> SalaryComponentController@store
PUT    /payroll/salary-components/{salary_component} -> SalaryComponentController@update
DELETE /payroll/salary-components/{salary_component} -> SalaryComponentController@destroy
```

## Sidebar Navigation

- **Incomes** (`incomes.view`)
- **Account Transfers** (`account-transfers.view`)
- **Payroll** now has children: Payroll Runs, Salary Components (`payroll.view`)

## Deployment Steps

```bash
php artisan migrate
php artisan db:seed --class=ChartOfAccountsSeeder        # adds 2030, 2040, 5006
php artisan db:seed --class=RolesAndPermissionsSeeder    # adds incomes.* and account-transfers.*
npm run build
```

`RolesAndPermissionsSeeder` uses `syncPermissions`, so it resets every role to the seeded defaults -- re-apply any manual role changes afterwards.

## Verification

- 426 PHPUnit tests passing (new: `ProjectIncomeTest`, `AccountTransferTest`, `EmployeeSalaryTest`, `PayrollBreakdownTest`, `SecurityRefundTest`, `SalaryComponentTest`, plus updated payroll/employee/assignment tests)
- End-to-end browser run (Playwright) against a throwaway SQLite database: incomes, account transfers + reversal, salary components, employee with breakdown, assignment allowances, increment, payroll generation/breakdown/edit/approve, payslip PDF, security refund, date pickers, filters, toasts -- all passing with no console errors
- Every journal entry balanced; trial balance balanced
