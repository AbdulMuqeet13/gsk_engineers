# Incomes

Navigate to **Incomes** in the sidebar.

## Overview

Record payments received for a project -- milestone payments, advances, progress billing. Each income is posted to the accounting journal immediately, tagged with the project, so it appears in the Profit & Loss, Income & Expense Summary, Project Ledger and Project Cashbook.

**Required permissions:**
- `incomes.view` -- View incomes
- `incomes.create` -- Record and reverse incomes

## Recording an Income

1. Click **Record Income**.
2. Fill in:
   - **Project** -- The project the payment belongs to (completed/cancelled projects are not accepted)
   - **Received From** (optional) -- Client name, e.g. "National Highway Authority"
   - **Income Account** -- Defaults to **4001 Project Income**
   - **Receive Into** -- Where the money goes: **Cash**, **Bank**, or **Accounts Receivable** if the client has been billed but has not paid yet
   - **Amount**, **Date**
   - **Description** -- e.g. "Milestone 1 payment"
   - **Cheque No.** (optional)
3. Click **Record Income**.

Journal entry created (both lines tagged with the project):

| Account | Debit | Credit |
|---|---|---|
| Receive Into account | amount | |
| Income account | | amount |

## Billing First, Collecting Later

1. When you bill the client, record the income with **Receive Into = Accounts Receivable**.
2. When the client pays, go to **Account Transfers** and move the amount **Accounts Receivable → Bank** (tag the same project). See [[09-User-Guide/Account Transfers]].

## Reversing an Income

If an income was entered incorrectly:

1. Click the **three-dot menu** on the row and choose **Reverse**.
2. Enter an optional reason and confirm.

A reversing journal entry is posted and the income shows as **Reversed**. Record it again correctly if needed.

## Viewing Incomes

- **Search** by reference, client or description
- **Filter** by project, receiving account and date range (use the × on a date filter to clear it)
- **Status** shows **Posted** or **Reversed**
