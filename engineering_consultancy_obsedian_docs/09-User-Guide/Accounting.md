# Accounting

The accounting module is the backbone of the system. All financial transactions -- expenses, payroll, transfers -- flow through the double-entry journal as balanced entries.

## Chart of Accounts

Navigate to **Accounting > Chart of Accounts**.

**Required permission:** `chart-of-accounts.view`, `chart-of-accounts.manage`

### Account Types

| Type | Normal Balance | Description |
|------|---------------|-------------|
| Asset | Debit | Cash, bank accounts, receivables |
| Liability | Credit | Payables, loans |
| Equity | Credit | Owner's equity, retained earnings |
| Income | Credit | Revenue, service income |
| Expense | Debit | Salaries, utilities, materials |

### Default Accounts

The system comes pre-seeded with 20 default accounts organized hierarchically:

- **Assets (1000s):** Cash in Hand (1001), Bank Account (1002), Petty Cash (1003), Accounts Receivable (1010), Inter-Project Receivable (1020)
- **Liabilities (2000s):** Accounts Payable (2001), Inter-Project Payable (2020)
- **Equity (3000s):** Owner's Equity (3001), Retained Earnings (3002)
- **Income (4000s):** Service Revenue (4001), Consultancy Fees (4002), Other Income (4003)
- **Expenses (5000s):** Salaries & Wages (5001), Office Rent (5002), Utilities (5003), Transportation (5004), Office Supplies (5005), Professional Fees (5006), Depreciation (5007), General Expenses (5008)

### Managing Accounts

- **Create:** Add new accounts with a unique code, name, type, normal balance, and optional parent account.
- **Edit:** Modify account details. Active/inactive toggle controls whether the account can be used in new transactions.
- **Delete:** Only if the account has no posted journal entries and no child accounts.

---

## Journal Entries

Navigate to **Accounting > Journal Entries**.

**Required permission:** `accounting.view`, `accounting.create`, `accounting.post`, `accounting.reverse`

### Understanding Journal Entries

A journal entry consists of:
- **Header:** Date, reference (auto-generated as `JE-YYYY-NNNNNN`), description, type
- **Lines:** Each line debits or credits an account head, optionally tagged with a project

### Entry Types

| Type | Created By |
|------|-----------|
| Standard | Manual entry |
| Simple | Manual simple entry |
| Expense | Auto-created when an expense is approved |
| Payroll | Auto-created when a payroll run is approved |
| Transfer | Auto-created for inter-project transfers |
| Opening | Opening balance entries |

### Creating a Journal Entry

1. Click **Create**.
2. Set the **Date** and **Description**.
3. Select the **Type** (usually Standard).
4. Add **journal lines** (minimum 2):
   - Select an **Account Head**
   - Enter a **Debit** or **Credit** amount (one must be zero)
   - Optionally select a **Project**
   - Add a **Memo** for the line
5. The form shows a running total -- **debits must equal credits**.
6. Click **Save** to create as a draft.

### Posting a Journal Entry

1. Find the draft entry in the list.
2. Click the **three-dot menu** and select **Post**.
3. The system validates:
   - Total debits equal total credits
   - At least 2 lines exist
   - All account heads are active
4. Once posted, the entry is **immutable** -- it cannot be edited or deleted.

### Reversing a Journal Entry

If a posted entry has an error:

1. Click the **three-dot menu** and select **Reverse**.
2. The system creates a **new mirror entry** that swaps all debits and credits.
3. Both entries are linked (original shows "Reversed by JE-xxx", reversal shows "Reversal of JE-xxx").

### File Attachments

Attach supporting documents (invoices, receipts) to journal entries.

---

## General Ledger

Navigate to **Accounting > General Ledger**.

**Required permission:** `accounting.view`

The general ledger shows a chronological list of all posted transactions for a selected account.

### Using the Ledger

1. Select an **Account Head** from the dropdown.
2. Optionally filter by **Date Range** and **Project**.
3. The table shows each transaction with:
   - Date, reference, description
   - Debit and credit amounts
   - **Running balance** (calculated based on the account's normal balance direction)

---

## Trial Balance

Navigate to **Accounting > Trial Balance**.

**Required permission:** `accounting.view`

The trial balance shows every account with a non-zero balance, listing total debits and credits.

### Reading the Trial Balance

- Each row shows an account's **total debit** and **total credit** from all posted entries.
- The **balance** column shows the net amount.
- The footer shows **grand totals** -- these must always be equal (debits = credits).
- A green **"Balanced"** badge confirms the books are in order.
- Optionally filter by **Project** to see a project-specific trial balance.
