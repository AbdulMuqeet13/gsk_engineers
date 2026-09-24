# Inter-Project Transfers

Navigate to **Transfers** in the sidebar.

## Overview

When funds need to move between projects (e.g., one project lending cash to another), use the transfer module. Each transfer immediately creates a posted journal entry with full receivable/payable tracking.

**Required permission:** `transfers.view`, `transfers.create`, `transfers.reverse`

## How Transfers Work

Unlike expenses and payroll, transfers have **no approval workflow**. They are executed immediately because they represent operational fund movements.

Each transfer creates a **4-line journal entry**:

| Line | Account | Project | Debit | Credit |
|------|---------|---------|-------|--------|
| 1 | To Account (e.g., Cash) | To Project | Amount | -- |
| 2 | From Account (e.g., Cash) | From Project | -- | Amount |
| 3 | Inter-Project Receivable | From Project | Amount | -- |
| 4 | Inter-Project Payable | To Project | -- | Amount |

This records both the actual fund movement **and** the receivable/payable between projects.

## Creating a Transfer

1. Click **Create** on the Transfers page.
2. Fill in:
   - **From Project** -- The project sending funds
   - **To Project** -- The project receiving funds
   - **From Account** -- The account to credit (source of funds)
   - **To Account** -- The account to debit (destination of funds)
   - **Amount** -- Transfer amount in PKR
   - **Date** -- Transfer date
   - **Purpose** -- Reason for the transfer
3. Click **Save**.

The transfer is executed immediately with a unique reference (`TRF-YYYY-NNNNNN`) and a posted journal entry.

## Reversing a Transfer

If a transfer was made in error:

1. Click the **three-dot menu** on the transfer row.
2. Select **Reverse**.
3. The system creates a reversal journal entry (mirror of the original) and links both entries.

A transfer can only be reversed once.

## Viewing Transfers

The transfer list shows reference, date, from/to projects, from/to accounts, amount, purpose, and status (active or reversed).
