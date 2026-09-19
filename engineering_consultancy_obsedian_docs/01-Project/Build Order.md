# Build Order

Work in this sequence. Do not start a later step until the earlier accounting invariants have passing tests.

## Phases

| # | Phase | Status | Description |
|---|-------|--------|-------------|
| 1 | **Foundation** | Done | Starter kit, Spatie roles/permissions, shadcn admin layout, sidebar, base DataTable |
| 2 | **Master Data** | Done | Projects, employees, chart of accounts, seeders |
| 3 | **Accounting Core** | Done | JournalService, journal entries/lines, general ledger, trial balance |
| 4 | **Expenses** | Done | Expense CRUD with approval workflow, auto-post via JournalService |
| 5 | **Payroll** | Done | Attendance, leave, payroll runs, payslips, post via PayrollService |
| 6 | **Inter-Project Transfers** | Done | TransferService, receivable/payable tracking, position report |
| 7 | **Financial Statements** | Done | P&L, balance sheet with date and project filters |
| 8 | **Reports & Dashboards** | Pending | Full report set + PDF/Excel export |
| 9 | **Cashbook** | Pending | Per-project running in/out list |
| 10 | **Hardening** | Pending | Role checks, audit trail review, edge cases, polish |

## Dependencies

```
Phase 1 (Foundation)
  └─> Phase 2 (Master Data)
        └─> Phase 3 (Accounting Core)
              ├─> Phase 4 (Expenses)
              ├─> Phase 5 (Payroll)
              └─> Phase 6 (Inter-Project Transfers)
                    └─> Phase 7 (Financial Statements)
                          └─> Phase 8 (Reports)
                                └─> Phase 9 (Cashbook)
                                      └─> Phase 10 (Hardening)
```

## Critical Rule

Every financial change goes through a service. No controller writes journal lines directly. Services enforce the rules and wrap writes in a database transaction.
