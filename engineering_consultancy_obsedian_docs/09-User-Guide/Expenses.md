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
