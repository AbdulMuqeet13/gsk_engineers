# Payroll

Navigate to **Payroll** in the sidebar.

## Overview

The payroll module handles batch salary processing. A payroll run groups payslips for a pay period, goes through an approval workflow, and automatically posts to the accounting journal when approved.

**Required permissions:**
- `payroll.view` -- View payroll runs and payslips
- `payroll.run` -- Create and manage payroll runs
- `payroll.approve` -- Submit, approve, and reject payroll runs

## Payroll Workflow

```
Draft --> Submitted --> Approved (auto-creates posted journal entry)
  |          |
  |          +--> Rejected (with reason)
  |
  +-- Can be edited or deleted
```

## Creating a Payroll Run

1. Click **Create** on the Payroll page.
2. Fill in:
   - **Period Start** and **Period End** -- The pay period dates
   - **Description** -- E.g., "September 2026 Salaries"
   - **Payment Account** -- How salaries will be paid (e.g., Bank Account)
3. Click **Save**.

The system generates a payroll run with a unique reference (`PAY-YYYY-NNNNNN`) and creates payslips for eligible employees based on their salary and attendance records.

## Managing Payslips

Click on a payroll run to open its **detail page** (the only module with a dedicated show page).

### Viewing Payslips

Each payslip shows:
- Employee name, designation, department
- Basic salary
- Deductions
- Net salary (basic - deductions)
- Days worked / days absent
- Notes

### Editing a Payslip

While the payroll run is in **Draft** status:

1. Click the **edit** button on a payslip row.
2. Adjust **deductions**, **days worked**, **days absent**, or **notes**.
3. The **net salary** recalculates automatically.
4. Click **Save**.

### Downloading a Payslip as PDF

1. Click the **download** icon on any payslip row.
2. A PDF salary slip is generated containing:
   - Pay period and reference
   - Employee details (name, designation, department, ID)
   - Earnings and deductions breakdown
   - Net salary
   - Days worked and absent
   - Notes (if any)
3. The PDF downloads as `payslip-{employee-name}-{year-month}.pdf`.

## Submitting for Approval

1. On the payroll run detail page, click **Submit**.
2. The run moves to **Submitted** status. Payslips can no longer be edited.

## Approving a Payroll Run

1. Click **Approve** on a submitted payroll run.
2. The system validates that the run has at least one payslip.
3. On approval, a journal entry is automatically created:
   - **Debit** Salaries & Wages (5001) -- one line per payslip, tagged with the employee's project
   - **Credit** Payment Account -- single line for the total amount
   - Entry type: Payroll, immediately posted

## Rejecting a Payroll Run

1. Click **Reject** on a submitted payroll run.
2. Enter a **rejection reason**.
3. The run moves to **Rejected** status.

## Deleting a Payroll Run

Only **draft** payroll runs can be deleted. Click the three-dot menu and select **Delete**.
