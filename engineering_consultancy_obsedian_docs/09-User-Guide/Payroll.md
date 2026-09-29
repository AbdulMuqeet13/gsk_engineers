# Payroll

Navigate to **Payroll → Payroll Runs** in the sidebar.

## Overview

The payroll module handles batch salary processing. A payroll run groups payslips for a pay period, goes through an approval workflow, and automatically posts to the accounting journal when approved.

Each payslip is built from:
- The employee's **salary record** in effect at the end of the period (see [[09-User-Guide/Employees and HR#Salary & Employment History]])
- The **allowances** on the employee's project assignments (see [[09-User-Guide/Projects#Project Assignments]])

**Required permissions:**
- `payroll.view` -- View payroll runs, payslips and salary components
- `payroll.run` -- Create and manage payroll runs, manage salary components
- `payroll.approve` -- Approve / reject payroll runs, refund security deposits

## Payroll Workflow

```
Draft --> Submitted --> Approved (auto-creates posted journal entry)
  |          |
  |          +--> Rejected (with reason)
  |
  +-- Payslips can be edited, run can be deleted
```

## How a Payslip Is Calculated

| Line | Source |
|---|---|
| Salary components (Basic, House Rent, ...) | Latest salary record effective on or before the period end |
| Project allowances | Allowances on the employee's project assignments |
| **Gross salary** | components + allowances |
| Income tax | Monthly tax on the salary record |
| Security deposit | Monthly security on the salary record (refundable) |
| Other deductions | Entered manually on the draft payslip |
| **Net salary** | gross − tax − security − other deductions |

The payslip keeps a copy of its breakdown, so later salary or allowance changes never alter past payslips.

## Creating a Payroll Run

1. Click **New Payroll Run**.
2. Fill in:
   - **Period Start** and **Period End**
   - **Payment Account** -- how salaries will be paid (e.g. Bank)
   - **Description** (optional)
3. Click **Create**.

The run gets a reference like `PR-2026-000004` and payslips are generated for all active employees.

- Active employees with **no salary effective by the period end** are skipped; the confirmation message says how many.
- A run **cannot overlap** the period of an existing run (e.g. two runs for September). The only exception is a **rejected** run, whose period can be run again.

## Managing Payslips

Click a payroll run to open its detail page. Each row shows the employee, salary, allowances, gross, tax, security, other deductions, net salary, days worked/absent and notes.

### Viewing the Breakdown

Click the **eye** icon to see every earning (components, and allowances with their project code) and every deduction.

### Editing a Payslip (draft runs only)

1. Click the **edit** (pencil) icon.
2. Adjust **Tax**, **Security** or **Other Deductions**, and **Notes**. The net salary updates as you type.
3. Click **Save**. Total deductions cannot exceed the gross salary.

### Downloading a Payslip as PDF

Click the **download** icon. The PDF lists the pay period, employee details, all earnings, gross salary, tax, security, other deductions, net salary and days worked/absent. File name: `payslip-{employee-name}-{year-month}.pdf`.

## Submitting, Approving and Rejecting

1. **Submit** a draft run -- payslips can no longer be edited.
2. **Approve** a submitted run -- the run must have at least one payslip. A journal entry is posted:

| Account | Debit | Credit |
|---|---|---|
| 5001 Salaries | salaries (less other deductions) | |
| 5006 Project Allowances | allowances, one line per project (tagged) | |
| 2030 Salary Tax Payable | | total tax |
| 2040 Employee Security Deposits | | total security |
| Payment account | | total net pay |

3. **Reject** a submitted run with a reason.

Only **draft** runs can be deleted.

## Salary Components

Navigate to **Payroll → Salary Components**.

Components are the parts of a salary breakdown. Defaults: **Basic Salary, House Rent, Medical, Conveyance**.

- **Add Component** -- name, display order, active
- **Edit** -- rename, reorder, or deactivate (inactive components are hidden on salary forms)
- **Delete** -- removes it from forms; existing salary records and payslips keep their amounts

## Security Deposit Refunds

Security deducted from salaries is held for the employee (account 2040). To refund it, open the employee's page and use **Security Deposit → Refund** -- see [[09-User-Guide/Employees and HR#Security Deposit]].
