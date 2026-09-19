# Phase 4 - Expenses

**Status:** Done (completed 2026-09-16)

## What Was Built

Expense management with an approval workflow (Draft → Submitted → Approved/Rejected). The first module to delegate to JournalService — proving the integration pattern that payroll and transfers will follow.

### Approval Workflow

```
Draft ──> Submitted ──> Approved (auto-creates + posts journal entry)
                    ──> Rejected (with reason)
```

**Separation of duties:** `expenses.create` for creators (Project Managers), `expenses.approve` for approvers (Accountants).

### Architecture

| Layer | Files |
|-------|-------|
| Enum | `ExpenseStatus.php` (draft, submitted, approved, rejected) |
| Enum update | `JournalEntryType.php` — added `Expense` case |
| Permission | `PermissionEnum.php` — added `ExpensesApprove` |
| Migration | `create_expenses_table` |
| Model | `Expense.php` (no SoftDeletes — status-based approach) |
| Factory | `ExpenseFactory.php` — states: draft, submitted, approved, rejected, forProject |
| Exceptions | `ExpenseNotDraftException`, `ExpenseNotSubmittedException` |
| Service | `ExpenseService.php` — create, update, submit, approve, reject, delete |
| Policy | `ExpensePolicy.php` — view/create/update/delete/submit/approve/reject |
| Requests | `StoreExpenseRequest`, `UpdateExpenseRequest`, `SubmitExpenseRequest`, `ApproveExpenseRequest`, `RejectExpenseRequest` |
| Actions | `CreateExpense`, `UpdateExpense`, `DeleteExpense`, `SubmitExpense`, `ApproveExpense`, `RejectExpense` |
| Controller | `ExpenseController.php` — index, store, update, destroy, submit, approve, reject |
| Routes | `GET/POST/PUT/DELETE /expenses`, `POST .../submit`, `POST .../approve`, `POST .../reject` |
| Seeder | `RolesAndPermissionsSeeder` — added `expenses.approve` to Accountant role |
| Frontend | 7 components (columns, create/edit/submit/approve/reject/delete dialogs), index page |
| Tests | `ExpenseServiceTest.php` (16 unit), `ExpenseTest.php` (20 feature) |

## ExpenseService — Delegation to JournalService

Constructor-injects `JournalService`.

| Method | Description |
|--------|-------------|
| `generateReference()` | `EXP-YYYY-NNNNNN` with `lockForUpdate` |
| `create(array, User)` | Creates draft expense in transaction |
| `update(Expense, array)` | Updates draft; throws if not draft |
| `submit(Expense)` | Draft → Submitted |
| `approve(Expense, User)` | Submitted → Approved; creates + posts JE via JournalService |
| `reject(Expense, User, reason)` | Submitted → Rejected with reason |
| `delete(Expense)` | Deletes draft; throws if not draft |

**Journal entry created on approval:**
- **Debit:** Expense account (e.g. 5003 Fuel) — increases expense
- **Credit:** Payment account (e.g. 1001 Cash) — decreases asset
- Both lines carry the expense's `project_id` for project costing
- Type: `JournalEntryType::Expense`
- Entry is immediately posted (not left as draft)

**Nested transactions:** `ExpenseService::approve()` wraps a transaction that calls `JournalService::create()` + `post()` (both also use transactions). Laravel handles via savepoints — if posting fails, the entire outer transaction rolls back.

## Key Design Decisions

1. **No SoftDeletes** — financial records use status-based approach; only drafts can be deleted
2. **`restrictOnDelete`** on accounts and creator — financial records must not be orphaned
3. **`nullOnDelete`** on approver — approver deletion shouldn't cascade
4. **`getRawOriginal('amount')`** in service — avoids PHP decimal cast issues with bcmath
5. **SuperAdmin Gate bypass** — `Gate::before()` returns true for Super Admin, so policy tests for denied conditions use non-SuperAdmin roles (e.g. Accountant)

## File Count

| Category | Count |
|----------|-------|
| Enums | 1 new, 2 modified |
| Migration | 1 |
| Model | 1 |
| Factory | 1 |
| Exceptions | 2 |
| Service | 1 |
| Policy | 1 |
| Form Requests | 5 |
| Actions | 6 |
| Controller | 1 |
| Route updates | 1 |
| Seeder update | 1 |
| TypeScript type updates | 2 |
| Frontend components | 7 |
| Page | 1 |
| Sidebar update | 1 |
| Test files | 2 |
| **Total** | **~34** |

## Verification Results

- 166 tests, 662 assertions — all passing (36 new tests added)
- `npm run build` — clean, no TypeScript errors
- `migrate:fresh --seed` — expenses table created, `expenses.approve` permission seeded
- Expense approval auto-creates posted journal entry visible in General Ledger
- Trial Balance reflects expense debits and cash credits correctly
