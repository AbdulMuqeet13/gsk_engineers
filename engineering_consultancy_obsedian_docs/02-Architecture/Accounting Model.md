# Accounting Model

## Core Principles

1. **Every financial change goes through a service** -- no controller writes journal lines directly
2. **Double entry is the core** -- total debits must equal total credits on every posted entry
3. **Posted entries are immutable** -- to fix a posted entry, create a reversing entry (never edit/delete)
4. **Project is a dimension** -- any journal line can carry a project_id for project-wise reporting
5. **Full audit trail** -- soft deletes on master data, reversals on financial data
6. **Single currency: PKR** -- `decimal(18,2)` with bcmath, never native floats

## Chart of Accounts (account_heads)

Hierarchical structure with 5 account types:

| Type | Normal Balance | Examples |
|------|---------------|----------|
| Asset | Debit | Cash, Bank, Project Fund, Accounts Receivable |
| Liability | Credit | Accounts Payable, Inter-Project Payable |
| Equity | Credit | Owner Equity, Retained Earnings |
| Income | Credit | Project Income |
| Expense | Debit | Salaries, Rent, Fuel, Food, General |

## Journal Entries

### Header (`journal_entries`)
- `date`, `reference` (auto-generated: JE-YYYY-NNNNNN), `description`
- `type`: standard, simple, payroll, transfer, opening, expense
- `status`: draft (editable) or posted (immutable)
- `created_by` (FK to users)
- `reversal_of_id`, `reversed_by_id` (self-referencing FKs for reversal chain)

### Lines (`journal_lines`)
- `journal_entry_id`, `account_head_id`
- `project_id` (nullable -- the dimension)
- `debit`, `credit` (one is always zero)
- `memo`

### Invariants (enforced by `JournalService`)
- `post()`: `sum(debit) == sum(credit)` with at least two lines, inside a DB transaction
- `post()`: all referenced account heads must be active
- `reverse()`: creates a mirror entry (debits become credits), links via `reversal_of_id`/`reversed_by_id`
- Posted entries are immutable -- only reversible, never edited or deleted
- Draft entries can be updated or deleted freely

## Expenses

### Approval Workflow
```
Draft → Submitted → Approved (auto-creates posted JE)
                   → Rejected (with reason)
```

### How It Works
- User creates a draft expense: picks category (expense account), payment method (cash/bank), project (optional), amount
- Submitting sends it for approval (separation of duties: `expenses.create` vs `expenses.approve`)
- On approval, `ExpenseService` delegates to `JournalService`:
  1. Creates a journal entry with type `expense`
  2. **Debit** expense account (e.g. 5003 Fuel) -- increases expense
  3. **Credit** payment account (e.g. 1001 Cash) -- decreases asset
  4. Both lines carry the expense's `project_id` for project costing
  5. Posts the journal entry immediately
  6. Links the expense to the journal entry via `journal_entry_id`
- On rejection, records the reason and rejector

### Key Design Decisions
- No soft deletes -- status-based approach for financial records
- Only draft expenses can be edited/deleted
- `restrictOnDelete` on accounts and creator -- financial records must not be orphaned
- Nested transactions are safe -- Laravel handles via savepoints

## Inter-Project Transfers (Phase 6)

Table `inter_project_transfers`:
- `from_project_id`, `to_project_id`, `amount`, `date`, `purpose`
- `journal_entry_id` -- the balancing entry it created

`TransferService::execute()` creates one balanced entry:
- Credits source project fund (money leaves Project A)
- Debits target expense or fund account (money enters Project B)
- Records matching Inter-Project Receivable/Payable for net position tracking

## Financial Statements (Phase 7)

All derived live from `journal_lines` -- never stored as totals:

| Statement | Description |
|-----------|-------------|
| **General Ledger** | Per account head, chronological entries with running balance |
| **Trial Balance** | Every account with debit/credit balance (must balance) |
| **Profit & Loss** | Income minus expenses over a period, filterable by project |
| **Balance Sheet** | Assets = Liabilities + Equity at a date, includes period net profit |
