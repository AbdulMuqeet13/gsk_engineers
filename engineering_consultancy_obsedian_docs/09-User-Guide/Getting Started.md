# Getting Started

## Overview

The **Engineering Consultancy ERP** is a web-based system for managing the day-to-day operations of a civil engineering consultancy firm. It covers project management, employee & HR, payroll, expense tracking, double-entry accounting, inter-project fund transfers, and financial reporting -- all in a single connected platform.

All financial amounts are in **PKR** (Pakistani Rupees).

## Accessing the System

1. Open the application URL in your browser (Chrome, Firefox, or Edge recommended).
2. Enter your **email** and **password** on the login page.
3. If two-factor authentication (2FA) is enabled on your account, enter the code from your authenticator app.

## First-Time Setup

After logging in for the first time:

1. Go to **Settings > Profile** to review your name and email.
2. Go to **Settings > Security** to change your default password and optionally enable 2FA.
3. Go to **Settings > Appearance** to switch between light and dark themes.

## User Roles

Your role determines what you can see and do. The system has five roles:

| Role | What You Can Do |
|------|----------------|
| **Super Admin** | Full access to everything |
| **Accountant** | Accounting, expenses (including approval), transfers, all reports |
| **Project Manager** | Manage projects, create expenses, view project reports |
| **HR** | Manage employees, attendance, leave, payroll |
| **Viewer** | Read-only access to reports |

If you cannot see a menu item or perform an action, your role may not have the required permission. Contact your Super Admin.

## Navigation

The **sidebar** on the left provides access to all modules:

- **Dashboard** -- Overview of key metrics
- **Projects** -- Project list and assignments
- **HR** -- Employees, attendance, leave requests
- **Accounting** -- Chart of accounts, journal entries, general ledger, trial balance
- **Expenses** -- Expense entry and approval
- **Payroll** -- Payroll runs with payslip management
- **Transfers** -- Inter-project fund transfers
- **Reports** -- Financial statements and operational reports

Click the **chevron** next to a section to expand or collapse its sub-items. On mobile, use the **hamburger menu** to toggle the sidebar.

## Key Concepts

### Double-Entry Accounting

Every financial transaction in the system creates a **journal entry** with balanced debit and credit lines. You don't need to understand accounting to use modules like Expenses or Payroll -- the system creates journal entries automatically when transactions are approved.

### Projects as Dimensions

Every financial transaction is tagged with a **project**. This lets you see income, expenses, and cash flow per project through the reporting module.

### Approval Workflows

Expenses and payroll follow a status-based workflow:

```
Draft --> Submitted --> Approved (auto-posts to journal)
                   --> Rejected (with reason)
```

Only **draft** items can be edited or deleted. Once submitted, they must go through approval.

### File Attachments

You can attach files (PDF, images, Word, Excel) to **expenses**, **employees**, **projects**, and **journal entries**. Maximum file size is 10 MB per file.
