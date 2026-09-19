# Civil Engineering Consultancy ERP

Build guidelines and product specification for Claude Code.

This document is the single source of truth for what to build and how to build it.
Read it fully before generating code. When something here conflicts with a habit or a
default, follow this document.

---

## 1. What we are building

A single connected system for a civil engineering consultancy that manages projects,
employees, payroll, expenses, ledgers, and full accounting. Everything is tied together
so a project, its staff, its costs, and its books stay in sync.

The hard, high value part is the accounting engine: proper double entry books that always
balance, plus the ability to move funds between projects and trace every movement. Treat
the accounting core as the backbone that every other module writes into.

---

## 2. Tech stack

- Backend: Laravel 12, PHP 8.2 or newer
- Frontend: Inertia.js with React 19 and TypeScript
- UI: shadcn/ui on Tailwind CSS v4 (build on the existing Laravel React starter kit shell)
- Database: MySQL 8
- Auth and access control: Laravel auth plus Spatie laravel-permission
- Testing: Pest (feature tests first, unit tests for accounting logic)
- Money math: bcmath or integer minor units, never native floats

Frontend pages live in `resources/js/Pages`, shared components in `resources/js/components`.
Use shadcn data tables for all list screens (server driven pagination, filter, sort).

---

## 3. Core principles (do not break these)

1. **Every financial change goes through a service.** No controller writes journal lines
   directly. Services enforce the rules and wrap writes in a database transaction.
2. **Double entry is the core.** Total debits must equal total credits on every posted
   entry. If they do not, the transaction rolls back.
3. **Posted entries are immutable.** To fix a posted entry, create a reversing entry. Never
   edit or hard delete posted financial records. Use draft status for anything still editable.
4. **Project is a dimension on every transaction.** Any journal line can carry a project so
   we can produce project wise reports by filtering, not by copying data.
5. **Full audit trail.** Record who created what and when. Use soft deletes on master data
   and reversals on financial data.
6. **One currency: PKR.** Store amounts as `decimal(18,2)` and do arithmetic with bcmath,
   or store integer paisa. Pick one approach and stay consistent across the whole codebase.

---

## 4. Accounting model (read carefully)

### 4.1 Chart of accounts (account heads)

Table `account_heads`:
- `code`, `name`
- `type`: one of `asset`, `liability`, `equity`, `income`, `expense`
- `normal_balance`: `debit` for asset and expense, `credit` for liability, equity, income
- `parent_id`: nullable, for a hierarchy (for example Expenses > Salaries, Rent, Fuel, Food)
- `is_active`

Seed a default chart of accounts covering: Cash, Bank, project fund accounts, Accounts
Receivable, Accounts Payable, Inter Project Receivable, Inter Project Payable, Owner Equity,
Retained Earnings, Project Income, and expense heads for Salaries, Rent, Fuel, Food, and
General expenses.

### 4.2 Journal entries

Table `journal_entries` (the header):
- `date`, `reference`, `description`
- `type`: `standard`, `simple`, `payroll`, `transfer`, `opening`
- `status`: `draft` or `posted`
- `created_by`

Table `journal_lines`:
- `journal_entry_id`
- `account_head_id`
- `project_id`: nullable (the dimension)
- `debit`, `credit` (one of them is zero on each line)
- `memo`

Invariant enforced in `JournalService::post()`:
`sum(debit) == sum(credit)` and at least two lines, inside a database transaction.

### 4.3 Single entry and mixed entry support

The client wants a mix of single ledger and double ledger entries. Implement it like this:

- The books are always double entry underneath. This keeps trial balance, profit and loss,
  and balance sheet correct.
- Provide a **simple entry** screen for non accountant users: they pick a cash or bank
  source, a category (for example Fuel), a project, and an amount. The service turns that
  one action into a balanced journal entry automatically (debit the expense head, credit the
  chosen cash or bank account). The user experiences single entry, the books stay balanced.
- Also provide a per project **cashbook view**: a simple running in and out list for each
  project, generated from the journal lines that touch that project cash account.

### 4.4 Inter project fund movement

This is a required feature. A user can pay one project's costs from another project's funds,
for example paying Project B salaries from Project A funds.

Table `inter_project_transfers`:
- `from_project_id`, `to_project_id`
- `amount`, `date`, `purpose`
- `from_account_id`, `to_account_id`
- `journal_entry_id` (the balancing entry it created)

`TransferService::execute()` creates one balanced journal entry that:
- credits the source project cash or fund account (money leaves Project A)
- debits either the target expense head tagged to Project B, or the target project fund
  account, depending on whether the transfer funds a specific cost or a general top up
- records a matching Inter Project Receivable on the giving side and Inter Project Payable
  on the receiving side so we always know the net position between any two projects

Provide an **Inter Project Position** report that shows, for each pair of projects, how much
one has funded the other and the net balance outstanding.

### 4.5 Financial statements (all derived, never stored as totals)

Compute these live from `journal_lines`, filterable by date range and by project:

- **General ledger**: per account head, chronological entries with a running balance.
- **Trial balance**: every account head with its debit or credit balance. Total debits must
  equal total credits. If they do not, surface a clear error, the data is inconsistent.
- **Profit and loss**: income heads minus expense heads over a period, with a project filter.
- **Balance sheet**: assets equal liabilities plus equity as at a date, including the period
  net profit rolled into retained earnings.

---

## 5. Feature modules

### 5.1 Project management
- Create, view, edit, and manage projects (`projects`: name, code, client, status, start
  and end dates, budget).
- Assign internal staff and project staff to projects (`project_assignments`: employee,
  project, role on project, allocation percent for internal staff split across projects).
- Track status and progress per project.
- Every project record and its linked costs stay together.

### 5.2 Employee and HR management
- `employees` table with `type`: `internal` or `project`. Project employees carry a
  `project_id`; internal employees are assigned through `project_assignments`.
- Profile, onboarding, documents (polymorphic `attachments`).
- Attendance (`attendance`) and leave (`leave_requests` with approval flow).
- Keep internal and project employee records clearly separate in every list and report.

### 5.3 Payroll
- `payroll_runs` (period, status) and `payslips` (employee, gross, deductions, net,
  project_id).
- `PayrollService` generates a payroll run, computes each payslip, and posts one journal
  entry per run: debit the Salaries expense head (tagged to the relevant project for project
  employees), credit the cash or bank account paid from.
- Salary slip per employee, downloadable.
- For project employees the salary expense hits that project. For internal employees, either
  keep it at company level or split across projects using their assignment allocation.

### 5.4 Expense management
- One friendly `expenses` entry point for Salaries, Rent, Fuel, Food, and General.
- Each expense: category, project (optional but encouraged), amount, paid from account,
  receipt attachment.
- Saving an expense calls `JournalService` to post the matching balanced entry.
- Views for spending per project and across the whole business.

### 5.5 Reports
- Project wise financial reports (project profit and loss, project ledger).
- Inter project transfer and position reports.
- Income and expense summaries by category and by project.
- Payroll reports.
- Trial balance, profit and loss, balance sheet (from section 4.5).
- Overall business performance dashboard.
- Every report exportable to PDF and Excel.

### 5.6 Access control
Roles via Spatie:
- **Super Admin**: everything.
- **Accountant**: full accounting, expenses, transfers, reports.
- **Project Manager**: own projects, project expenses, project reports, no company wide books.
- **HR**: employees, attendance, leave, payroll.
- **Viewer**: read only reports.

Guard every route with policies. The UI hides actions the user cannot perform, but the
server is the real gate.

---

## 6. How the modules connect

- Expenses, payroll, and transfers all write into the same journal through services. They
  never keep their own separate balances.
- Projects act as the dimension that links costs, staff, payroll, and reports.
- Financial statements read only from journal lines, so they always reflect reality.
- Attachments (receipts, employee documents) hang off expenses, journal entries, projects,
  and employees polymorphically.

---

## 7. Build order

Work in this sequence. Do not start a later step until the earlier accounting invariants
have passing tests.

1. **Foundation**: confirm the starter kit, wire Spatie roles and permissions, set up the
   shadcn admin layout, sidebar, and base data table component.
2. **Master data**: projects, employees, chart of accounts, seeders for default heads and roles.
3. **Accounting core**: `JournalService`, journal entries and lines, general ledger, trial
   balance. Write feature tests that assert the trial balance always balances.
4. **Expenses**: the simple entry screen and expense categories, with attachments, posting
   through `JournalService`.
5. **Payroll**: attendance, leave, payroll runs, payslips, posting through `PayrollService`.
6. **Inter project transfers**: `TransferService`, inter project receivable and payable
   tracking, the position report.
7. **Financial statements**: profit and loss, balance sheet, with date and project filters.
8. **Reports and dashboards**: the report set in 5.5 plus PDF and Excel export.
9. **Cashbook and simple ledger views** per project.
10. **Hardening**: role checks, audit trail review, edge cases, and polish.

---

## 8. Working conventions for Claude Code

- Validate with Form Requests. Authorize with Policies. Put business logic in service classes
  under `app/Services`, not in controllers.
- Wrap every multi write operation in `DB::transaction`.
- Never edit a posted journal entry. Reverse it with a new entry.
- Never use native floats for money. Use `decimal(18,2)` with bcmath, or integer paisa.
- Prefer explicit enums for `type` and `status` fields.
- Write a feature test for each accounting rule before moving on: debits equal credits,
  trial balance balances, inter project position nets to zero across the pair, payroll run
  posts the correct entry.
- Keep migrations small and reversible. Seed default chart of accounts and roles.
- Use shadcn data tables with server side pagination, filtering, and sorting for every list.
- Ask before introducing a new package. Keep the dependency list lean.

---

## 9. Definition of done for a module

A module is done when: the screens work end to end, the data persists correctly, the related
journal entries post and balance, the relevant reports reflect the new data, role based access
is enforced on the server, and feature tests pass.
