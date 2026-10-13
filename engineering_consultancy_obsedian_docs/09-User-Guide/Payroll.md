# Payroll

Navigate to **Payroll → Payroll Runs** in the sidebar.

## Overview

The payroll module handles batch salary processing. A payroll run groups payslips for a pay period, goes through an approval workflow, and posts the payroll expense to the journal when approved. Net salaries are then **paid per employee** (or all at once) from the run's page.

Each payslip is built from:
- The employee's **salary record** in effect at the end of the period (see [[09-User-Guide/Employees and HR#Salary & Employment History]])
- The **allowances** on the employee's project assignments (see [[09-User-Guide/Projects#Project Assignments]])

**Required permissions:**
- `payroll.view` -- View payroll runs, payslips and salary components
- `payroll.run` -- Create and manage payroll runs, manage salary components
- `payroll.approve` -- Approve / reject payroll runs, pay salaries, refund security deposits

## Payroll Workflow

```
Draft --> Submitted --> Approved (posts expense, salaries payable) --> each payslip Paid
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
   - **Payment Account** -- the default account salaries are paid from (e.g. Bank); can be changed per payment
   - **Project** (optional) -- limit the run to one project's employees: project employees and employees assigned to it
   - **Employees** (optional) -- limit the run to chosen employees (within the project, if one is chosen)
   - **Description** (optional)
3. Click **Create**.

The run gets a reference like `PR-2026-000004` and payslips are generated for the active employees in scope (everyone when no project or employees are chosen).

- Active employees with **no salary effective by the period end** are skipped; the confirmation message says how many.
- An employee can only be on **one run per period**. Employees already on another (non-rejected) run with an overlapping period are skipped and counted in the message, so you can run one project first and everyone else later. If *every* employee in scope is already covered, the run is not created. Rejected runs don't count.

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
2. **Approve** a submitted run -- the run must have at least one payslip. A journal entry is posted and the net salaries become payable (nothing leaves the bank yet):

| Account | Debit | Credit |
|---|---|---|
| 5001 Salaries | salaries (less other deductions) | |
| 5006 Project Allowances | allowances, one line per project (tagged) | |
| 2030 Salary Tax Payable | | total tax |
| 2040 Employee Security Deposits | | total security |
| 2050 Salaries Payable | | total net pay |

3. **Reject** a submitted run with a reason.

## Paying Salaries

On an approved run, the **Payment** column shows each payslip as **Paid** (with date and account) or **Unpaid**, and the details show the unpaid total.

- **Pay one employee** -- click the **banknote** icon on the payslip row.
- **Pay everyone remaining** -- click **Pay All Unpaid**; all unpaid payslips are paid in one journal entry.

Choose the **Pay From** account (defaults to the run's payment account) and the **Payment Date** (not before the approval date, not in the future). Each payment posts:

| Account | Debit | Credit |
|---|---|---|
| 2050 Salaries Payable | net salary per employee | |
| Pay-from account | | net salary per employee, tagged with the employee and (project-type employees) their project |

The project of a project-type employee is saved on the payslip when the run is created, so moving the employee to another project later doesn't change where past salaries are reported. These payment lines are what the **Project Ledger** employee filter shows.

A payslip can only be paid once. Runs approved before per-employee payments existed were marked as paid on their approval date.

Only **draft** runs can be deleted.

## Salary Components

Navigate to **Payroll → Salary Components**.

Components are the parts of a salary breakdown. Defaults: **Basic Salary, House Rent, Medical, Conveyance**.

- **Add Component** -- name, display order, active
- **Edit** -- rename, reorder, or deactivate (inactive components are hidden on salary forms)
- **Delete** -- removes it from forms; existing salary records and payslips keep their amounts

## Security Deposit Refunds

Security deducted from salaries is held for the employee (account 2040). To refund it, open the employee's page and use **Security Deposit → Refund** -- see [[09-User-Guide/Employees and HR#Security Deposit]].
