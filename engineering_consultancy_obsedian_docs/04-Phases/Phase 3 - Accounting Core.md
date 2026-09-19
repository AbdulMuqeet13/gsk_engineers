# Phase 3 - Accounting Core

**Status:** Done (completed 2026-09-16)

## What Was Built

The double-entry accounting engine — the backbone that every other module writes into. Includes JournalService, journal entries with lines, general ledger with running balance, and trial balance.

### 1. Journal Entries & Lines

**Purpose:** Double-entry bookkeeping with full audit trail. Posted entries are immutable — corrections via reversals only.

| Layer | Files |
|-------|-------|
| Enums | `JournalEntryType.php` (standard, simple, payroll, transfer, opening, expense), `JournalEntryStatus.php` (draft, posted) |
| Migrations | `create_journal_entries_table`, `create_journal_lines_table` |
| Models | `JournalEntry.php` (no SoftDeletes), `JournalLine.php` |
| Factory | `JournalEntryFactory.php` — states: draft, posted, withLines |
| Exceptions | `UnbalancedEntryException`, `InsufficientLinesException`, `EntryAlreadyPostedException`, `EntryNotDraftException`, `InactiveAccountHeadException`, `EntryAlreadyReversedException` |
| Service | `JournalService.php` — create, update, post, reverse |
| Policy | `JournalEntryPolicy.php` — view/create/update/post/reverse |
| Requests | `StoreJournalEntryRequest`, `UpdateJournalEntryRequest`, `PostJournalEntryRequest`, `ReverseJournalEntryRequest` |
| Actions | `CreateJournalEntryAction`, `UpdateJournalEntryAction`, `PostJournalEntryAction`, `ReverseJournalEntryAction` |
| Controller | `JournalEntryController.php` — index, store, update, destroy, post, reverse |
| Routes | `GET/POST/PUT/DELETE /accounting/journal-entries`, `POST .../post`, `POST .../reverse` |
| Frontend | 7 components (columns, line-form-rows, create/edit/post/reverse/delete dialogs), index page |
| Tests | `JournalServiceTest.php` (13 unit), `JournalEntryTest.php` (15 feature) |

### 2. General Ledger

**Purpose:** Per-account chronological view of posted lines with running balance.

| Layer | Files |
|-------|-------|
| Controller | `GeneralLedgerController.php` — index with account/date/project filters |
| Frontend | columns component, index page with account selector and filters |
| Tests | `GeneralLedgerTest.php` (8 feature tests) |

**Running balance** calculated server-side based on account's normal balance direction:
- Debit-normal accounts: balance = previous + debit - credit
- Credit-normal accounts: balance = previous + credit - debit

### 3. Trial Balance

**Purpose:** Aggregated debit/credit totals for all accounts — must always balance.

| Layer | Files |
|-------|-------|
| Controller | `TrialBalanceController.php` — index with date/project filters |
| Frontend | columns component, index page with balance verification badge |
| Tests | `TrialBalanceTest.php` (7 feature tests) |

## JournalService — The Engine

Constructor: no dependencies (standalone).

| Method | Description |
|--------|-------------|
| `generateReference()` | `JE-YYYY-NNNNNN` with `lockForUpdate` |
| `create(array, User)` | Creates draft entry with lines in transaction |
| `update(JournalEntry, array)` | Updates draft; throws `EntryNotDraftException` if posted |
| `post(JournalEntry)` | Validates balance + min 2 lines + active accounts; sets status=posted |
| `reverse(JournalEntry, User, reason)` | Creates mirror entry (debits↔credits), links via reversal FKs |

**Invariants enforced by `post()`:**
- `sum(debit) == sum(credit)` (bcmath precision)
- At least 2 lines
- All referenced account heads must be active
- Entry must be in draft status

**Reversal chain:** `reversed_by_id` and `reversal_of_id` self-referencing FKs link original to reversal.

## File Count

| Category | Count |
|----------|-------|
| Enums | 2 |
| Migrations | 2 |
| Models | 2 |
| Factories | 1 |
| Exceptions | 6 |
| Service | 1 |
| Policy | 1 |
| Form Requests | 4 |
| Actions | 4 |
| Controllers | 3 |
| Route updates | 1 |
| TypeScript types | 1 update |
| Frontend components | 9 |
| Pages | 3 |
| Test files | 4 |
| **Total** | **~44** |

## Verification Results

- 130 tests, 557 assertions — all passing (43 new tests added)
- `npm run build` — clean, no TypeScript errors
- `migrate:fresh --seed` — journal tables created
- Trial balance always balances with posted entries
- Reversals correctly mirror original entries
