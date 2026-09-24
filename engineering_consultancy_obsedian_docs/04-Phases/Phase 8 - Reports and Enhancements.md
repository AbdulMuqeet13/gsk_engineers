# Phase 8 - Reports and Enhancements (Done - 2026-09-24)

## What Was Built

This phase delivered the remaining reports, file attachments, payslip PDF downloads, and delete safety checks -- covering Phases 8 (Reports & Dashboards) and 9 (Cashbook) from the original build order, plus cross-cutting enhancements.

### 1. Income & Expense Summary Report

Summarizes income and expenses with two grouping modes:

- **By Category:** Groups by account head (income/expense types), shows code, name, type, and balance.
- **By Project:** Groups by project, shows total income, total expenses, and net per project.

Architecture:
- Controller: `IncomeExpenseSummaryController` (index + export)
- Permission: `reports.financial`
- Page: `resources/js/pages/reports/income-expense-summary.tsx`
- Export: PDF and Excel
- Tests: 6 feature tests

### 2. Payroll Report

Summary of approved payroll runs with expandable employee payslip details:

- Summary cards: total runs, employees paid, total disbursed
- Main table with expandable rows showing individual payslip breakdown
- Filterable by period dates

Architecture:
- Controller: `PayrollReportController` (index + export)
- Permission: `reports.payroll`
- Page: `resources/js/pages/reports/payroll-report.tsx`
- Export: PDF and Excel

### 3. Project Cashbook

Per-project cash inflow/outflow tracking across cash accounts (codes 1001, 1002, 1003):

- Summary cards: opening balance, total in, total out, closing balance
- Running balance per transaction
- Opening balance computed from transactions before the date range
- Filterable by project (required), date range, and specific cash account

Architecture:
- Controller: `ProjectCashbookController` (index + export)
- Permission: `reports.project`
- Constants: `CASH_ACCOUNT_CODES = ['1001', '1002', '1003']`
- Page: `resources/js/pages/reports/project-cashbook.tsx`
- TypeScript types: `CashbookRow`, `CashbookSummary`
- Export: PDF and Excel
- Tests: 13 feature tests

### 4. Project Ledger

All posted transactions for a specific project across all account types:

- Running balance when single account selected, hidden for multi-account view
- Balance direction follows account's normal balance
- Filterable by project (required), date range, and specific account

Architecture:
- Controller: `ProjectLedgerController` (index + export)
- Permission: `reports.project`
- Page: `resources/js/pages/reports/project-ledger.tsx`
- TypeScript type: `ProjectLedgerRow`
- Export: PDF and Excel
- Tests: 10 feature tests

### 5. Payslip PDF Download

Individual payslip download as formatted PDF salary slip:

- Route: `GET /payroll/{payroll_run}/payslips/{payslip}/download`
- Permission: `payroll.view`
- Blade template: `resources/views/payroll/payslip.blade.php`
- Validates payslip belongs to the payroll run
- Filename: `payslip-{employee-name}-{year-month}.pdf`
- Content: employee details, earnings/deductions, days worked/absent, notes
- Tests: 4 feature tests

### 6. Polymorphic File Attachments

Generic file attachment system for multiple entity types:

- Migration: `attachments` table with `attachable_type` / `attachable_id` polymorphic columns
- Model: `Attachment` with `attachable()` MorphTo and `uploader()` BelongsTo
- Trait: `HasAttachments` (in `app/Concerns/`) adds `attachments()` MorphMany
- Used by: Expense, Employee, Project, JournalEntry models
- Controller: `AttachmentController` with store, download, destroy
- Form Request: `StoreAttachmentRequest` with per-type permission checks
- Supported types: `expense`, `employee`, `project`, `journal_entry`
- Allowed files: PDF, JPG, JPEG, PNG, DOC, DOCX, XLS, XLSX (max 10 MB)
- Storage path: `attachments/{type}/{model_id}`
- React component: `resources/js/components/attachments/attachment-list.tsx`
- Routes: POST `/attachments`, GET `/attachments/{id}/download`, DELETE `/attachments/{id}`
- Tests: 9 feature tests

### 7. Delete Safety Checks

Comprehensive safety checks preventing deletion of entities with dependencies:

**Employee:**
- Cannot delete if payslips exist (has payroll history)
- Throws `DomainException`

**Project:**
- Cannot delete if has posted journal entries
- Cannot delete if has approved expenses
- Cannot delete if involved in inter-project transfers

**Account Head:**
- Cannot delete if has posted journal entries
- Cannot delete if has child accounts

**Expense:**
- Can only delete drafts (`ExpenseNotDraftException`)

**Payroll Run:**
- Can only delete drafts (`PayrollNotDraftException`)
- Approval requires at least one payslip (`EmptyPayrollException`)

**Leave Request:**
- Can only delete pending requests (`LeaveNotPendingException`)

### 8. New Exceptions

- `app/Exceptions/Payroll/EmptyPayrollException.php`
- `app/Exceptions/Payroll/PayrollNotDraftException.php`
- `app/Exceptions/Payroll/PayrollNotSubmittedException.php`
- `app/Exceptions/Expenses/ExpenseNotDraftException.php`
- `app/Exceptions/Expenses/ExpenseNotSubmittedException.php`
- `app/Exceptions/Leave/LeaveNotPendingException.php`

### 9. New Permissions

| Permission | Description |
|------------|-------------|
| `reports.financial` | P&L, Balance Sheet, Income/Expense Summary |
| `reports.project` | Project Cashbook, Project Ledger |
| `reports.payroll` | Payroll Report |

## New Routes

```
GET  /reports/income-expense-summary         -> IncomeExpenseSummaryController@index
GET  /reports/income-expense-summary/export   -> IncomeExpenseSummaryController@export
GET  /reports/payroll                         -> PayrollReportController@index
GET  /reports/payroll/export                  -> PayrollReportController@export
GET  /reports/project-cashbook                -> ProjectCashbookController@index
GET  /reports/project-cashbook/export         -> ProjectCashbookController@export
GET  /reports/project-ledger                  -> ProjectLedgerController@index
GET  /reports/project-ledger/export           -> ProjectLedgerController@export
GET  /payroll/{payroll_run}/payslips/{payslip}/download -> PayrollRunController@downloadPayslip
POST /attachments                             -> AttachmentController@store
GET  /attachments/{attachment}/download       -> AttachmentController@download
DELETE /attachments/{attachment}              -> AttachmentController@destroy
```

## Sidebar Navigation

New items under Reports section:
- Income & Expense Summary (`reports.financial`)
- Project Cashbook (`reports.project`)
- Project Ledger (`reports.project`)
- Payroll Report (`reports.payroll`)

## Verification

- All new tests passing
- Clean `npm run build`
- Clean `vendor/bin/pint`
- Reports correctly reflect posted journal data
- PDF/Excel exports match on-screen data
- Attachments upload, download, and delete correctly
- Delete safety checks prevent orphaned data
