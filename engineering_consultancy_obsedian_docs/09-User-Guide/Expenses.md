# Expenses

Navigate to **Expenses** in the sidebar.

## Overview

The expense module handles day-to-day expenditure recording with an approval workflow. When an expense is approved, the system automatically creates a posted journal entry -- no manual accounting needed.

**Required permissions:**
- `expenses.view` -- View expenses
- `expenses.create` -- Create and edit expenses
- `expenses.approve` -- Submit, approve, and reject expenses

## Expense Workflow

```
Draft --> Submitted --> Approved (auto-creates posted journal entry)
  |          |
  |          +--> Rejected (with reason, stays as rejected)
  |
  +-- Can be edited or deleted
```

- **Draft:** Can be edited, deleted, or submitted.
- **Submitted:** Locked for editing. Awaiting approval.
- **Approved:** Creates a journal entry automatically. Cannot be modified.
- **Rejected:** Includes a rejection reason. Cannot be modified.

## Viewing Expenses

The expense list shows:

| Column | Description |
|--------|-------------|
| Reference | Auto-generated (`EXP-YYYY-NNNNNN`) |
| Date | Expense date |
| Description | What the expense is for |
| Amount | Amount in PKR |
| Account | Expense account (category) |
| Payment Account | How it was paid (cash, bank) |
| Project | Associated project |
| Status | Draft, Submitted, Approved, or Rejected |
| Created By | Who created the expense |

Use **search** (by description or reference) and **status filter** to find expenses.

## Creating an Expense

1. Click **Create**.
2. Fill in:
   - **Date** (required)
   - **Description** (required, max 500 characters)
   - **Amount** (required, must be greater than 0)
   - **Expense Account** (required) -- Category of the expense (e.g., Office Supplies, Transportation). Only expense-type accounts are shown.
   - **Payment Account** (required) -- How it was paid (e.g., Cash in Hand, Bank Account). Only asset-type accounts are shown.
   - **Project** -- Optional, tag the expense to a specific project
   - **Notes** -- Additional details (max 2000 characters)
3. Click **Save**.

The expense is created with **Draft** status.

## Submitting for Approval

1. Click the **three-dot menu** on a draft expense.
2. Select **Submit**.
3. The expense moves to **Submitted** status and is locked for editing.

## Approving an Expense

1. Click the **three-dot menu** on a submitted expense.
2. Select **Approve**.
3. The system automatically:
   - Creates a journal entry (type: Expense)
   - Debits the expense account
   - Credits the payment account
   - Both lines carry the expense's project
   - Posts the journal entry immediately

## Rejecting an Expense

1. Click the **three-dot menu** on a submitted expense.
2. Select **Reject**.
3. Enter a **rejection reason**.
4. The expense moves to **Rejected** status.

## File Attachments

Attach receipts, invoices, or supporting documents:

1. Open the expense (edit dialog for drafts, or view).
2. Upload files in the **Attachments** section.
3. Supported: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX (max 10 MB).

## Separation of Duties

The system enforces separation between expense creators and approvers:
- **Project Managers** can create expenses (`expenses.create`)
- **Accountants** can approve/reject expenses (`expenses.approve`)
- Both roles can view expenses (`expenses.view`)

## Vendor Credit Purchases and Partial Payments

The Expenses module only records expenses paid immediately from Cash or Bank. To record a purchase **on credit** from a vendor and pay it in parts, use **Journal Entries** with the **Accounts Payable** account.

### One-time setup: a payable account per vendor (recommended)

In **Accounting → Chart of Accounts**, add an account for each credit vendor:
- **Code:** 2011, 2012, ... **Name:** `Payable – ABC Traders` **Type:** Liability **Parent:** 2010 Accounts Payable

This gives each vendor its own balance. (Using 2010 for everyone works, but you can't see who is owed what.)

### Step 1 -- Record the purchase

Example: cement from ABC Traders for **100,000** on the Motorway project, **40,000** paid now from Bank.

**Accounting → Journal Entries → Create**, Type **Expense**, Description `ABC Traders – cement, Bill #123`:

| Account | Project | Debit | Credit | Memo |
|---|---|---|---|---|
| 5005 General Expenses (or the right expense account) | Motorway | 100,000 | | Cement, Bill #123 |
| 1002 Bank | Motorway | | 40,000 | Paid on purchase |
| 2011 Payable – ABC Traders | Motorway | | 60,000 | Balance due, Bill #123 |

Debits must equal credits. Save, then **Post** the entry. If nothing is paid up front, omit the Bank line and credit the vendor the full amount.

### Step 2 -- Record each later payment

Example: 25,000 paid two weeks later:

| Account | Project | Debit | Credit | Memo |
|---|---|---|---|---|
| 2011 Payable – ABC Traders | Motorway | 25,000 | | Part payment, Bill #123 |
| 1002 Bank | Motorway | | 25,000 | Chq #... |

**Post** it. Repeat until the balance is zero. This entry does not touch an expense account, so the cost is not counted twice.

### Seeing what you owe

- **One vendor:** **Accounting → General Ledger**, select the vendor's payable account -- the running balance is the amount still owed.
- **All vendors:** **Trial Balance** / **Balance Sheet** under Liabilities.
- **Project cost:** Project Ledger and Income & Expense Summary include the full purchase amount.

### Tips

- Put the bill number in the description and memos to match payments to bills.
- Posted entries can't be edited -- **Reverse** and re-enter to correct.
- Tag payment lines with the same project as the purchase so the project cashbook matches.
- This method does not give a per-bill Unpaid / Partially Paid / Paid status; that needs a dedicated vendors feature.

