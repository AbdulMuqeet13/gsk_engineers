# Account Transfers

Navigate to **Account Transfers** in the sidebar.

## Overview

Move money between the company's own accounts, for example:

- **Bank → Cash** -- cash withdrawal for site expenses
- **Cash → Bank** -- depositing cash
- **Accounts Receivable → Bank** -- a client paying an invoice you recorded as receivable

This is different from [[09-User-Guide/Transfers]] (Inter-Project Transfers), which move funds **between projects**.

**Required permissions:**
- `account-transfers.view` -- View transfers
- `account-transfers.create` -- Create and reverse transfers

## Creating a Transfer

1. Click **New Transfer**.
2. Fill in:
   - **From Account** and **To Account** -- any active asset account (they must be different)
   - **Project** (optional) -- tag a project so the movement shows in that project's cashbook
   - **Amount**, **Date**, **Description**
   - **Cheque No.** (optional)
3. Click **Transfer**.

Journal entry posted immediately:

| Account | Debit | Credit |
|---|---|---|
| To Account | amount | |
| From Account | | amount |

## Reversing a Transfer

Click the **three-dot menu** on the row, choose **Reverse**, enter an optional reason and confirm. A reversing journal entry is posted and the transfer shows as **Reversed**.

## Viewing Transfers

- **Search** by reference or description
- **Filter** by account (matches either side), project and date range
