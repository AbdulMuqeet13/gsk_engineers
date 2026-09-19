# Phase 7 - Financial Statements

**Status:** Done (completed 2026-09-17)

## What Was Built

Two financial statement reports: Profit & Loss and Balance Sheet. Both are read-only report controllers — no models, no migrations, no services. They query `journal_lines` from posted entries, grouped by account type, using bcmath for all arithmetic.

### Profit & Loss

Income minus expenses over a period. Filterable by date range and project.

**Query logic:**
- Joins `journal_lines` → `journal_entries` (posted only)
- Filters by `date_from`, `date_to`, `project_id`
- Groups by `account_head_id`, sums debit and credit
- Income balance = credit - debit (credit normal balance)
- Expense balance = debit - credit (debit normal balance)
- Net Profit = Total Income - Total Expenses

### Balance Sheet

Assets = Liabilities + Equity as at a point in time. Filterable by as-at date and project.

**Query logic:**
- Cumulative from inception (no `date_from`) — only `as_at_date` as upper bound
- Groups by `account_head_id`, sums debit and credit
- Splits into asset, liability, equity, income, and expense accounts
- Computes net profit from income/expense accounts
- Rolls net profit into Retained Earnings (code 3002)
- If 3002 has no direct activity but net profit is non-zero, adds it as a synthetic entry
- Verifies: `totalAssets === totalLiabilities + totalEquity`

### Architecture

| Layer | Files |
|-------|-------|
| Controller | `ProfitAndLossController.php` — index |
| Controller | `BalanceSheetController.php` — index |
| Routes | `reports/profit-and-loss`, `reports/balance-sheet` |
| Permission | `reports.financial` (already seeded) |
| TypeScript type | `FinancialStatementRow` added to `models.ts` |
| Frontend columns | `profit-and-loss-columns.tsx`, `balance-sheet-columns.tsx` |
| Frontend pages | `reports/profit-and-loss.tsx`, `reports/balance-sheet.tsx` |
| Sidebar | P&L and Balance Sheet added under Reports section |
| Tests | `ProfitAndLossTest.php` (7 feature), `BalanceSheetTest.php` (8 feature) |

## Authorization

Uses `abort_unless($request->user()->can('reports.financial'), 403)` instead of `$this->authorize()`. Spatie permissions are not registered as Laravel gates, so `can()` on the User model (via Spatie's `HasPermissions` trait) is the correct approach.

## Frontend Pattern

Both pages use the same pattern as Trial Balance — `shadcn/ui Table` component (not DataTable, no pagination needed) with section headers (Income/Expenses or Assets/Liabilities/Equity), subtotals per section, and a grand total in the footer.

**P&L page:** Date From, Date To, Project filters. Shows Net Profit/Loss with green/red coloring.

**Balance Sheet page:** As At Date, Project filters. Shows balanced/unbalanced indicator (green/red banner, same pattern as Trial Balance).

Both use `router.reload()` for partial reloading on filter changes with `Inertia::optional()` for the projects list.

## Key Design Decisions

1. **No models or services** — pure query + presentation, computed live from journal_lines
2. **Retained Earnings rollup** — net profit is always added to code 3002, even if that account has no direct journal entries
3. **`match` with closures** — Balance Sheet controller uses `match($type)` with immediately-invoked closures for account categorization
4. **Cumulative balance sheet** — no `date_from`, everything from inception to `as_at_date`

## Verification Results

- 271 tests, 1,080 assertions — all passing (15 new tests added)
- `npm run build` — clean, no TypeScript errors
- Pint — clean
