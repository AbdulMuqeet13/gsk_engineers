# Reports

Navigate to **Reports** in the sidebar.

The system provides seven reports covering financial statements, project-level analysis, and payroll summaries. Most reports support **PDF and Excel export**.

---

## Financial Reports

**Required permission:** `reports.financial`

### Profit & Loss (P&L)

Shows income minus expenses over a period.

**Filters:**
- **Date From / Date To** -- Reporting period
- **Project** -- Filter to a specific project (optional)

**Columns:** Account Code, Account Name, Type (Income/Expense), Balance

**Footer:** Total Income, Total Expenses, **Net Profit** (Income - Expenses)

**Export:** PDF, Excel

---

### Balance Sheet

Shows Assets = Liabilities + Equity at a point in time.

**Filters:**
- **As At Date** -- The reporting date (cumulative from inception)
- **Project** -- Filter to a specific project (optional)

**Sections:**
- **Assets** -- All asset accounts with balances
- **Liabilities** -- All liability accounts with balances
- **Equity** -- All equity accounts with balances, including Retained Earnings (which includes the period's net profit)

**Footer:** Total Assets, Total Liabilities + Equity, **Balance Check** (green badge if balanced)

**Export:** PDF, Excel

---

### Income & Expense Summary

Summarizes income and expenses, viewable **by category** (account) or **by project**.

**Filters:**
- **Date From / Date To** -- Reporting period
- **Project** -- Filter to a specific project (category mode only)
- **Group By** -- Toggle between Category and Project views

**By Category View:**
| Column | Description |
|--------|-------------|
| Code | Account code |
| Account | Account name |
| Type | Income or Expense |
| Amount | Balance for the period |

**By Project View:**
| Column | Description |
|--------|-------------|
| Project Code | Project identifier |
| Project | Project name |
| Income | Total income for the project |
| Expenses | Total expenses for the project |
| Net | Income minus expenses |

**Footer:** Total Income, Total Expenses, Net Profit (green if positive, red if negative)

**Export:** PDF, Excel

---

## Project Reports

**Required permission:** `reports.project`

### Project Cashbook

Shows cash inflows and outflows for a specific project across cash/bank accounts (codes 1001, 1002, 1003).

**Filters:**
- **Project** (required) -- Select the project to view
- **Date From / Date To** -- Optional date range
- **Account** -- All cash accounts or a specific one

**Summary Cards:**
- **Opening Balance** -- Balance before the selected period
- **Total In** -- Sum of all cash inflows
- **Total Out** -- Sum of all cash outflows
- **Closing Balance** -- Opening + In - Out

**Columns:** Date, Reference, Description, Account, Money In, Money Out, Running Balance

**Export:** PDF, Excel (available only when a project is selected)

---

### Project Ledger

Shows all posted transactions for a specific project across all account types.

**Filters:**
- **Project** (required) -- Select the project to view
- **Date From / Date To** -- Optional date range
- **Account** -- All accounts or filter to a specific one

**Columns:** Date, Reference, Description, Account (Code - Name), Type, Debit, Credit, Balance

**Note:** The **Balance** column only shows a running balance when a single account is selected. When viewing all accounts, it shows "--" because a running balance across different account types is not meaningful.

**Footer:** Total Debits, Total Credits

**Export:** PDF, Excel (available only when a project is selected)

---

## Payroll Report

**Required permission:** `reports.payroll`

### Overview

Shows a summary of approved payroll runs with expandable employee payslip details.

**Filters:**
- **Period From / Period To** -- Filter by payroll period dates

**Summary Cards:**
- **Payroll Runs** -- Number of approved runs in the period
- **Employees Paid** -- Total payslips across all runs
- **Total Disbursed** -- Sum of all net salaries paid

**Main Table:** Each row is a payroll run showing reference, period, total amount, and payslip count.

**Expandable Detail:** Click the **chevron** on a row to expand and see individual payslips with:
- Employee Name, Designation, Days Worked, Days Absent
- Basic Salary, Deductions, Net Salary

**Export:** PDF, Excel

---

## Inter-Project Position Report

**Required permission:** `reports.financial`

Shows the net financial position between pairs of projects based on inter-project transfers.

**Columns:**
- **Project A / Project B** -- The two projects
- **A to B** -- Total transferred from A to B
- **B to A** -- Total transferred from B to A
- **Net** -- Net position (positive means A owes B)

This report helps track how much one project owes another.

---

## Exporting Reports

For reports that support export:

1. Apply your desired filters.
2. Click the **PDF** or **Excel** button.
3. The file downloads to your browser.

PDF exports use a clean print layout. Excel exports include headers, data rows, and totals.
