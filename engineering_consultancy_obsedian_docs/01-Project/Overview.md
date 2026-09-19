# Project Overview

## What We're Building

A single connected system for a **civil engineering consultancy** that manages projects, employees, payroll, expenses, ledgers, and full accounting. Everything is tied together so a project, its staff, its costs, and its books stay in sync.

## The Core Value

The hard, high-value part is the **accounting engine**: proper double-entry books that always balance, plus the ability to move funds between projects and trace every movement. The accounting core is the backbone that every other module writes into.

## Currency

Single currency: **PKR** (Pakistani Rupee). All amounts stored as `decimal(18,2)`. Arithmetic uses `bcmath` -- never native floats.

## Feature Modules

| Module | Description |
|--------|-------------|
| **Project Management** | CRUD projects, assign staff, track status and budget |
| **Employee & HR** | Internal vs project employees, profiles, attendance, leave |
| **Payroll** | Payroll runs, payslips, auto-post to journal |
| **Expenses** | Simple entry for Salaries/Rent/Fuel/Food/General, auto-post to journal |
| **Accounting Core** | Journal entries, general ledger, trial balance |
| **Inter-Project Transfers** | Move funds between projects, track receivables/payables |
| **Financial Statements** | P&L, Balance Sheet, derived live from journal lines |
| **Reports & Dashboards** | Project-wise reports, PDF/Excel export |
| **Cashbook** | Per-project running in/out list |

## How Modules Connect

```
Expenses, Payroll, Transfers
         |
         v
   JournalService (enforces double-entry)
         |
         v
   journal_entries + journal_lines
         |
         v
   Financial Statements (read-only from journal_lines)
```

- Projects act as the **dimension** linking costs, staff, payroll, and reports
- Financial statements read only from journal lines -- always reflect reality
- Attachments (receipts, documents) are polymorphic across expenses, journals, projects, employees

## Definition of Done (per module)

A module is done when:
1. Screens work end to end
2. Data persists correctly
3. Related journal entries post and balance
4. Relevant reports reflect the new data
5. Role-based access is enforced on the server
6. Feature tests pass
