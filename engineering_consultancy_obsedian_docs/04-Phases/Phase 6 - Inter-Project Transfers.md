# Phase 6 - Inter-Project Transfers

**Status:** Done (completed 2026-09-17)

## What Was Built

Fund transfers between projects with automatic double-entry accounting via 4-line journal entries. Includes an Inter-Project Position report showing net balances between project pairs.

### Transfer Flow

```
Execute ──> 4-line JE created + posted (immediate, no approval)
Reverse ──> Delegates to JournalService::reverse()
```

No approval workflow — transfers execute immediately. Reversal is available if the journal entry hasn't already been reversed.

### Architecture

| Layer | Files |
|-------|-------|
| Migration | `create_inter_project_transfers_table` |
| Model | `InterProjectTransfer.php` — relations: fromProject, toProject, fromAccount, toAccount, journalEntry, creator |
| Factory | `InterProjectTransferFactory.php` |
| Exception | `TransferAlreadyReversedException.php` |
| Service | `TransferService.php` — execute, reverse, generateReference |
| Policy | `InterProjectTransferPolicy.php` |
| Requests | `StoreTransferRequest`, `ReverseTransferRequest` |
| Actions | `CreateTransferAction`, `ReverseTransferAction` |
| Controller | `InterProjectTransferController.php` — index, store, reverse |
| Controller | `InterProjectPositionController.php` — index (position report) |
| Frontend | transfer columns, create/reverse dialogs, index page |
| Frontend | position columns, position report page |
| Tests | `TransferServiceTest.php` (10 unit), `InterProjectTransferTest.php` (12 feature), `InterProjectPositionTest.php` (4 feature) |

## TransferService — 4-Line Journal Entry

Constructor-injects `JournalService`. Reference format: `TRF-YYYY-NNNNNN`.

**Journal entry on execute (4 lines):**

| # | Account | Project | Debit | Credit |
|---|---------|---------|-------|--------|
| 1 | To Account (e.g. Cash) | To Project | amount | — |
| 2 | From Account (e.g. Cash) | From Project | — | amount |
| 3 | Inter-Project Receivable (1020) | From Project | amount | — |
| 4 | Inter-Project Payable (2020) | To Project | — | amount |

- Type: `JournalEntryType::Transfer`
- Entry is immediately posted
- Lines 1-2 move the actual funds; lines 3-4 track the inter-project obligation

## Inter-Project Position Report

Queries `inter_project_transfers` joined with `journal_entries` (excluding reversed). Groups by project pairs, computes `a_to_b`, `b_to_a`, and `net` balance using bcmath. Positive net means A owes B.

## Key Design Decisions

1. **No approval workflow** — transfers are operational, not financial approvals
2. **4-line JE** — actual fund movement + receivable/payable tracking in a single balanced entry
3. **`nullOnDelete` on journal_entry_id** — if JE is deleted (shouldn't happen), transfer record survives
4. **Position report uses raw query** — groups by canonical project pair (lower ID first) to avoid A→B / B→A duplication

## Verification Results

- 256 tests, 968 assertions — all passing (26 new tests added)
- `npm run build` — clean, no TypeScript errors
- `migrate:fresh --seed` — transfers table created
