<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>GSK Engineers - ERP User Guide</title>
    <style>
        @page { margin: 60px 50px; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #333; line-height: 1.6; }

        /* Cover page */
        .cover { text-align: center; padding-top: 200px; page-break-after: always; }
        .cover h1 { font-size: 32px; color: #1a1a1a; margin-bottom: 8px; letter-spacing: 1px; }
        .cover .subtitle { font-size: 18px; color: #555; margin-bottom: 40px; }
        .cover .line { width: 80px; height: 3px; background: #2563eb; margin: 0 auto 40px; }
        .cover .version { font-size: 12px; color: #888; margin-top: 60px; }
        .cover .date { font-size: 11px; color: #999; margin-top: 8px; }

        /* Table of contents */
        .toc { page-break-after: always; }
        .toc h2 { font-size: 20px; color: #1a1a1a; margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 8px; }
        .toc-item { display: block; padding: 6px 0; border-bottom: 1px dotted #ccc; font-size: 12px; color: #333; }
        .toc-item .num { color: #2563eb; font-weight: bold; margin-right: 8px; }
        .toc-section { font-weight: bold; font-size: 13px; padding-top: 12px; border-bottom: none; color: #1a1a1a; }

        /* Sections */
        .section { page-break-before: always; }
        .section:first-of-type { page-break-before: avoid; }
        .section h2 { font-size: 20px; color: #1a1a1a; margin-bottom: 6px; border-bottom: 2px solid #2563eb; padding-bottom: 8px; }
        .section h3 { font-size: 14px; color: #2563eb; margin: 18px 0 8px; }
        .section h4 { font-size: 12px; color: #444; margin: 14px 0 6px; }
        .section p { margin-bottom: 8px; text-align: justify; }

        /* Tables */
        table { width: 100%; border-collapse: collapse; margin: 10px 0 16px; }
        th { background: #2563eb; color: #fff; padding: 7px 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
        td { border: 1px solid #ddd; padding: 6px 10px; font-size: 11px; vertical-align: top; }
        tr:nth-child(even) td { background: #f8f9fa; }

        /* Info boxes */
        .info-box { background: #eff6ff; border-left: 4px solid #2563eb; padding: 10px 14px; margin: 10px 0 14px; font-size: 11px; }
        .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px 14px; margin: 10px 0 14px; font-size: 11px; }
        .success-box { background: #ecfdf5; border-left: 4px solid #10b981; padding: 10px 14px; margin: 10px 0 14px; font-size: 11px; }

        /* Workflow */
        .workflow { text-align: center; margin: 14px 0; font-size: 12px; }
        .workflow .step { display: inline-block; background: #f3f4f6; border: 1px solid #d1d5db; padding: 6px 14px; border-radius: 4px; margin: 0 2px; }
        .workflow .arrow { display: inline-block; margin: 0 4px; color: #2563eb; font-weight: bold; }
        .workflow .step-active { background: #2563eb; color: #fff; border-color: #2563eb; }
        .workflow .step-success { background: #10b981; color: #fff; border-color: #10b981; }
        .workflow .step-danger { background: #ef4444; color: #fff; border-color: #ef4444; }

        /* Lists */
        ul, ol { margin: 6px 0 12px 24px; }
        li { margin-bottom: 4px; }

        /* Footer */
        .page-footer { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #eee; padding-top: 6px; }

        /* Misc */
        .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
        .badge-blue { background: #dbeafe; color: #1d4ed8; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-gray { background: #f3f4f6; color: #374151; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-yellow { background: #fef3c7; color: #92400e; }
        .mt-4 { margin-top: 16px; }
        .mb-4 { margin-bottom: 16px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .text-muted { color: #888; font-size: 10px; }
    </style>
</head>
<body>

{{-- ==================== COVER PAGE ==================== --}}
<div class="cover">
    <h1>GSK ENGINEERS</h1>
    <div class="line"></div>
    <div class="subtitle">Engineering Consultancy ERP</div>
    <div class="subtitle" style="font-size: 14px; color: #888;">User Guide</div>
    <div class="version">Version 1.0</div>
    <div class="date">{{ now()->format('F Y') }}</div>
</div>

{{-- ==================== TABLE OF CONTENTS ==================== --}}
<div class="toc">
    <h2>Table of Contents</h2>

    <div class="toc-item toc-section">Getting Started</div>
    <div class="toc-item"><span class="num">1.1</span> Logging In</div>
    <div class="toc-item"><span class="num">1.2</span> Navigation</div>
    <div class="toc-item"><span class="num">1.3</span> User Roles</div>
    <div class="toc-item"><span class="num">1.4</span> Settings</div>

    <div class="toc-item toc-section">Projects</div>
    <div class="toc-item"><span class="num">2.1</span> Managing Projects</div>
    <div class="toc-item"><span class="num">2.2</span> Project Assignments</div>

    <div class="toc-item toc-section">HR &amp; Employee Management</div>
    <div class="toc-item"><span class="num">3.1</span> Employees</div>
    <div class="toc-item"><span class="num">3.2</span> Attendance</div>
    <div class="toc-item"><span class="num">3.3</span> Leave Requests</div>

    <div class="toc-item toc-section">Accounting</div>
    <div class="toc-item"><span class="num">4.1</span> Chart of Accounts</div>
    <div class="toc-item"><span class="num">4.2</span> Journal Entries</div>
    <div class="toc-item"><span class="num">4.3</span> General Ledger</div>
    <div class="toc-item"><span class="num">4.4</span> Trial Balance</div>

    <div class="toc-item toc-section">Expenses</div>
    <div class="toc-item"><span class="num">5.1</span> Creating Expenses</div>
    <div class="toc-item"><span class="num">5.2</span> Approval Workflow</div>

    <div class="toc-item toc-section">Payroll</div>
    <div class="toc-item"><span class="num">6.1</span> Payroll Runs</div>
    <div class="toc-item"><span class="num">6.2</span> Payslips</div>

    <div class="toc-item toc-section">Inter-Project Transfers</div>
    <div class="toc-item"><span class="num">7.1</span> Creating Transfers</div>
    <div class="toc-item"><span class="num">7.2</span> Reversals</div>

    <div class="toc-item toc-section">Reports</div>
    <div class="toc-item"><span class="num">8.1</span> Financial Reports</div>
    <div class="toc-item"><span class="num">8.2</span> Project Reports</div>
    <div class="toc-item"><span class="num">8.3</span> Payroll Report</div>
    <div class="toc-item"><span class="num">8.4</span> Exporting Reports</div>

    <div class="toc-item toc-section">File Attachments</div>
</div>

{{-- ==================== 1. GETTING STARTED ==================== --}}
<div class="section">
    <h2>1. Getting Started</h2>

    <h3>1.1 Logging In</h3>
    <p>Open the application URL in your web browser (Chrome, Firefox, or Edge recommended). Enter your <strong>email address</strong> and <strong>password</strong> to sign in.</p>
    <p>If two-factor authentication (2FA) is enabled on your account, you will be prompted to enter a verification code from your authenticator app after signing in.</p>

    <div class="info-box">
        <strong>First-time users:</strong> Your administrator will provide your login credentials. Please change your password immediately after first login by going to Settings &rarr; Security.
    </div>

    <h3>1.2 Navigation</h3>
    <p>The application uses a <strong>sidebar menu</strong> on the left side of the screen. Click on any section to expand its sub-items. The sidebar contains the following main sections:</p>

    <table>
        <tr><th>Menu Section</th><th>What It Contains</th></tr>
        <tr><td><strong>Dashboard</strong></td><td>Overview of key business metrics and summaries</td></tr>
        <tr><td><strong>Projects</strong></td><td>Project list, project details, and staff assignments</td></tr>
        <tr><td><strong>HR</strong></td><td>Employee management, attendance tracking, and leave requests</td></tr>
        <tr><td><strong>Accounting</strong></td><td>Chart of accounts, journal entries, general ledger, and trial balance</td></tr>
        <tr><td><strong>Expenses</strong></td><td>Expense entry and approval management</td></tr>
        <tr><td><strong>Payroll</strong></td><td>Payroll runs with payslip management</td></tr>
        <tr><td><strong>Transfers</strong></td><td>Inter-project fund transfers</td></tr>
        <tr><td><strong>Reports</strong></td><td>Financial statements, project reports, and payroll reports</td></tr>
        <tr><td><strong>Settings</strong></td><td>Profile, security, and appearance preferences</td></tr>
    </table>

    <h3>1.3 User Roles</h3>
    <p>Your access to features depends on the role assigned to your account. The system has five roles:</p>

    <table>
        <tr><th>Role</th><th>Access Level</th></tr>
        <tr><td><span class="badge badge-blue">Super Admin</span></td><td>Full access to all features and settings</td></tr>
        <tr><td><span class="badge badge-green">Accountant</span></td><td>Full accounting, expense approval, transfers, and all reports</td></tr>
        <tr><td><span class="badge badge-yellow">Project Manager</span></td><td>Manage own projects, create project expenses, view project reports</td></tr>
        <tr><td><span class="badge badge-gray">HR</span></td><td>Manage employees, attendance, leave requests, and payroll</td></tr>
        <tr><td><span class="badge badge-red">Viewer</span></td><td>Read-only access to reports</td></tr>
    </table>

    <div class="info-box">If you cannot see a menu item or cannot perform a certain action, your role may not have the required permission. Please contact your Super Admin.</div>

    <h3>1.4 Settings</h3>
    <p>Access your personal settings from the <strong>Settings</strong> menu at the bottom of the sidebar:</p>
    <ul>
        <li><strong>Profile</strong> &mdash; Update your name and email address</li>
        <li><strong>Security</strong> &mdash; Change your password and enable/disable two-factor authentication (2FA)</li>
        <li><strong>Appearance</strong> &mdash; Switch between light and dark mode</li>
    </ul>
</div>

{{-- ==================== 2. PROJECTS ==================== --}}
<div class="section">
    <h2>2. Projects</h2>

    <h3>2.1 Managing Projects</h3>
    <p>Navigate to <strong>Projects</strong> in the sidebar to view all projects. You can search projects by name, code, or client, and filter by status.</p>

    <h4>Creating a Project</h4>
    <ol>
        <li>Click the <strong>Create</strong> button at the top of the page.</li>
        <li>Fill in the project details:</li>
    </ol>

    <table>
        <tr><th>Field</th><th>Required</th><th>Description</th></tr>
        <tr><td>Code</td><td>Yes</td><td>Short unique identifier (e.g., PRJ-001)</td></tr>
        <tr><td>Name</td><td>Yes</td><td>Full project name</td></tr>
        <tr><td>Client</td><td>No</td><td>Client or organization name</td></tr>
        <tr><td>Status</td><td>Yes</td><td>Planning, Active, On Hold, Completed, or Cancelled</td></tr>
        <tr><td>Start Date</td><td>No</td><td>Project start date</td></tr>
        <tr><td>End Date</td><td>No</td><td>Expected end date (must be after start date)</td></tr>
        <tr><td>Budget</td><td>No</td><td>Allocated budget in PKR</td></tr>
    </table>

    <h4>Editing &amp; Deleting Projects</h4>
    <p>Click the <strong>three-dot menu (&hellip;)</strong> on any project row to edit or delete it.</p>

    <div class="warning-box">
        <strong>Delete protection:</strong> A project cannot be deleted if it has posted journal entries, approved expenses, or inter-project transfers. This prevents accidental loss of financial data.
    </div>

    <h3>2.2 Project Assignments</h3>
    <p>Navigate to <strong>Projects &rarr; Assignments</strong> to assign employees to projects.</p>
    <ol>
        <li>Click <strong>Create</strong>.</li>
        <li>Select an <strong>Employee</strong> and a <strong>Project</strong>.</li>
        <li>Enter the employee's <strong>Role</strong> on the project (e.g., Site Engineer).</li>
        <li>Set the <strong>Allocation %</strong> (0&ndash;100) &mdash; how much of the employee's time is allocated.</li>
        <li>Click <strong>Save</strong>.</li>
    </ol>
    <div class="info-box">Each employee can only be assigned to a project once.</div>
</div>

{{-- ==================== 3. HR ==================== --}}
<div class="section">
    <h2>3. HR &amp; Employee Management</h2>

    <h3>3.1 Employees</h3>
    <p>Navigate to <strong>HR &rarr; Employees</strong> to manage your workforce.</p>

    <h4>Employee Types</h4>
    <table>
        <tr><th>Type</th><th>Description</th></tr>
        <tr><td><span class="badge badge-blue">Internal</span></td><td>Office/HQ staff not tied to a specific project</td></tr>
        <tr><td><span class="badge badge-green">Project</span></td><td>Field staff assigned to a specific project</td></tr>
    </table>

    <h4>Creating an Employee</h4>
    <p>Click <strong>Create</strong> and fill in: Name, Email, Phone, Type (Internal/Project), Designation, Department, Date of Joining, Salary, CNIC, and Address. If the employee type is <strong>Project</strong>, you must also select which project they belong to.</p>

    <div class="warning-box">
        <strong>Delete protection:</strong> An employee cannot be deleted if they have payroll history (payslips exist). Instead, mark the employee as <strong>Inactive</strong>.
    </div>

    <h3>3.2 Attendance</h3>
    <p>Navigate to <strong>HR &rarr; Attendance</strong> to record daily attendance.</p>
    <ol>
        <li>Click <strong>Create</strong>.</li>
        <li>Select the <strong>Employee</strong>, set the <strong>Date</strong>, and choose a <strong>Status</strong>:</li>
    </ol>

    <table>
        <tr><th>Status</th><th>Meaning</th></tr>
        <tr><td><span class="badge badge-green">Present</span></td><td>Employee was present for the full day</td></tr>
        <tr><td><span class="badge badge-red">Absent</span></td><td>Employee was absent</td></tr>
        <tr><td><span class="badge badge-yellow">Half Day</span></td><td>Employee worked half the day</td></tr>
        <tr><td><span class="badge badge-gray">Leave</span></td><td>Employee is on approved leave</td></tr>
    </table>

    <p>Optionally record <strong>Check In</strong> and <strong>Check Out</strong> times and add notes.</p>
    <div class="info-box">Attendance data is used during payroll to calculate days worked and days absent for each employee.</div>

    <h3>3.3 Leave Requests</h3>
    <p>Navigate to <strong>HR &rarr; Leave Requests</strong> to manage employee leave.</p>

    <h4>Leave Types</h4>
    <table>
        <tr><th>Type</th><th>Description</th></tr>
        <tr><td>Annual</td><td>Regular annual leave</td></tr>
        <tr><td>Sick</td><td>Medical or sick leave</td></tr>
        <tr><td>Casual</td><td>Short-notice casual leave</td></tr>
        <tr><td>Unpaid</td><td>Leave without pay</td></tr>
    </table>

    <h4>Approval Workflow</h4>
    <div class="workflow">
        <span class="step">Pending</span>
        <span class="arrow">&rarr;</span>
        <span class="step step-success">Approved</span>
        <span style="margin: 0 8px; color: #888;">or</span>
        <span class="step step-danger">Rejected</span>
    </div>
    <p>To approve or reject a leave request, click the <strong>three-dot menu (&hellip;)</strong> on the request row and select the appropriate action. When rejecting, you must provide a reason.</p>
    <div class="info-box">Only <strong>Pending</strong> leave requests can be approved, rejected, or deleted.</div>
</div>

{{-- ==================== 4. ACCOUNTING ==================== --}}
<div class="section">
    <h2>4. Accounting</h2>
    <p>The accounting module is the backbone of the system. All financial transactions &mdash; expenses, payroll, and transfers &mdash; automatically create balanced journal entries in the double-entry ledger.</p>

    <h3>4.1 Chart of Accounts</h3>
    <p>Navigate to <strong>Accounting &rarr; Chart of Accounts</strong> to manage your account structure.</p>

    <h4>Account Types</h4>
    <table>
        <tr><th>Type</th><th>Normal Balance</th><th>Examples</th></tr>
        <tr><td><span class="badge badge-blue">Asset</span></td><td>Debit</td><td>Cash in Hand, Bank Account, Petty Cash</td></tr>
        <tr><td><span class="badge badge-red">Liability</span></td><td>Credit</td><td>Accounts Payable, Inter-Project Payable</td></tr>
        <tr><td><span class="badge badge-gray">Equity</span></td><td>Credit</td><td>Owner's Equity, Retained Earnings</td></tr>
        <tr><td><span class="badge badge-green">Income</span></td><td>Credit</td><td>Service Revenue, Consultancy Fees</td></tr>
        <tr><td><span class="badge badge-yellow">Expense</span></td><td>Debit</td><td>Salaries, Utilities, Transportation</td></tr>
    </table>

    <p>The system comes pre-loaded with 20 default accounts. You can add custom accounts as needed.</p>

    <div class="warning-box"><strong>Delete protection:</strong> An account cannot be deleted if it has posted journal entries or child accounts.</div>

    <h3>4.2 Journal Entries</h3>
    <p>Navigate to <strong>Accounting &rarr; Journal Entries</strong> to create and manage journal entries.</p>

    <h4>Creating a Journal Entry</h4>
    <ol>
        <li>Click <strong>Create</strong>.</li>
        <li>Set the <strong>Date</strong>, <strong>Description</strong>, and <strong>Type</strong>.</li>
        <li>Add at least <strong>2 journal lines</strong>. Each line specifies an account, a debit or credit amount, and optionally a project.</li>
        <li><strong>Total debits must equal total credits</strong> &mdash; the form shows a running total.</li>
        <li>Click <strong>Save</strong> to create the entry as a draft.</li>
    </ol>

    <h4>Posting &amp; Reversing</h4>
    <p>Draft entries can be edited or deleted. When ready, <strong>Post</strong> the entry to make it permanent.</p>

    <div class="workflow">
        <span class="step">Draft</span>
        <span class="arrow">&rarr;</span>
        <span class="step step-active">Posted</span>
        <span class="arrow">&rarr;</span>
        <span class="step step-danger">Reversed</span>
        <span class="text-muted" style="margin-left: 4px;">(if needed)</span>
    </div>

    <div class="warning-box">
        <strong>Important:</strong> Posted entries are <strong>immutable</strong> &mdash; they cannot be edited or deleted. If a posted entry has an error, use the <strong>Reverse</strong> action to create a correcting entry.
    </div>

    <div class="info-box"><strong>Automatic entries:</strong> You do not need to create journal entries for expenses, payroll, or transfers &mdash; the system creates them automatically when these transactions are approved.</div>

    <h3>4.3 General Ledger</h3>
    <p>Navigate to <strong>Accounting &rarr; General Ledger</strong> to view a chronological list of all posted transactions for a selected account. Select an account from the dropdown, optionally filter by date range and project, and view each transaction with its <strong>running balance</strong>.</p>

    <h3>4.4 Trial Balance</h3>
    <p>Navigate to <strong>Accounting &rarr; Trial Balance</strong> to view every account with a non-zero balance. The trial balance shows total debits and credits, and a green <strong>"Balanced"</strong> badge confirms the books are in order (total debits = total credits).</p>
</div>

{{-- ==================== 5. EXPENSES ==================== --}}
<div class="section">
    <h2>5. Expenses</h2>
    <p>Navigate to <strong>Expenses</strong> in the sidebar to record and manage day-to-day expenditures.</p>

    <h3>5.1 Creating an Expense</h3>
    <ol>
        <li>Click <strong>Create</strong>.</li>
        <li>Fill in the details:</li>
    </ol>

    <table>
        <tr><th>Field</th><th>Required</th><th>Description</th></tr>
        <tr><td>Date</td><td>Yes</td><td>Date of the expense</td></tr>
        <tr><td>Description</td><td>Yes</td><td>What the expense is for (max 500 characters)</td></tr>
        <tr><td>Amount</td><td>Yes</td><td>Amount in PKR (must be greater than 0)</td></tr>
        <tr><td>Expense Account</td><td>Yes</td><td>Category (e.g., Office Supplies, Transportation)</td></tr>
        <tr><td>Payment Account</td><td>Yes</td><td>How it was paid (e.g., Cash in Hand, Bank Account)</td></tr>
        <tr><td>Project</td><td>No</td><td>Optionally tag the expense to a specific project</td></tr>
        <tr><td>Notes</td><td>No</td><td>Additional details (max 2000 characters)</td></tr>
    </table>

    <p>The expense is created with a unique reference number (e.g., <strong>EXP-2026-000001</strong>) and <strong>Draft</strong> status.</p>

    <h3>5.2 Approval Workflow</h3>

    <div class="workflow">
        <span class="step">Draft</span>
        <span class="arrow">&rarr;</span>
        <span class="step step-active">Submitted</span>
        <span class="arrow">&rarr;</span>
        <span class="step step-success">Approved</span>
        <span style="margin: 0 8px; color: #888;">or</span>
        <span class="step step-danger">Rejected</span>
    </div>

    <table>
        <tr><th>Status</th><th>What You Can Do</th></tr>
        <tr><td><span class="badge badge-gray">Draft</span></td><td>Edit, delete, attach files, or submit for approval</td></tr>
        <tr><td><span class="badge badge-blue">Submitted</span></td><td>Waiting for approval &mdash; no edits allowed</td></tr>
        <tr><td><span class="badge badge-green">Approved</span></td><td>Journal entry is automatically created and posted</td></tr>
        <tr><td><span class="badge badge-red">Rejected</span></td><td>Includes a rejection reason &mdash; no further changes</td></tr>
    </table>

    <div class="success-box">
        <strong>Automatic accounting:</strong> When an expense is approved, the system automatically creates a journal entry that debits the expense account and credits the payment account. No manual accounting needed!
    </div>
</div>

{{-- ==================== 6. PAYROLL ==================== --}}
<div class="section">
    <h2>6. Payroll</h2>
    <p>Navigate to <strong>Payroll</strong> in the sidebar to manage salary processing.</p>

    <h3>6.1 Payroll Runs</h3>

    <h4>Creating a Payroll Run</h4>
    <ol>
        <li>Click <strong>Create</strong>.</li>
        <li>Set the <strong>Period Start</strong> and <strong>Period End</strong> dates (the pay period).</li>
        <li>Add a <strong>Description</strong> (e.g., "September 2026 Salaries").</li>
        <li>Select the <strong>Payment Account</strong> (e.g., Bank Account).</li>
        <li>Click <strong>Save</strong>.</li>
    </ol>
    <p>The system generates payslips for all eligible employees based on their salary and attendance records.</p>

    <h4>Approval Workflow</h4>
    <div class="workflow">
        <span class="step">Draft</span>
        <span class="arrow">&rarr;</span>
        <span class="step step-active">Submitted</span>
        <span class="arrow">&rarr;</span>
        <span class="step step-success">Approved</span>
        <span style="margin: 0 8px; color: #888;">or</span>
        <span class="step step-danger">Rejected</span>
    </div>

    <div class="success-box">
        <strong>Automatic accounting:</strong> When a payroll run is approved, the system creates a journal entry debiting Salaries &amp; Wages (per employee) and crediting the payment account for the total amount.
    </div>

    <h3>6.2 Payslips</h3>
    <p>Click on a payroll run to view its <strong>detail page</strong> with individual payslips.</p>

    <h4>Each Payslip Shows:</h4>
    <ul>
        <li>Employee name, designation, and department</li>
        <li>Basic salary, deductions, and net salary</li>
        <li>Days worked and days absent</li>
        <li>Notes</li>
    </ul>

    <h4>Editing Payslips</h4>
    <p>While the payroll run is in <strong>Draft</strong> status, you can adjust individual payslip deductions, days, and notes. The net salary recalculates automatically.</p>

    <h4>Downloading Payslip PDF</h4>
    <p>Click the <strong>download icon</strong> on any payslip row to download a formatted <strong>PDF salary slip</strong>. The PDF includes employee details, earnings/deductions breakdown, and attendance summary.</p>
</div>

{{-- ==================== 7. TRANSFERS ==================== --}}
<div class="section">
    <h2>7. Inter-Project Transfers</h2>
    <p>Navigate to <strong>Transfers</strong> in the sidebar to move funds between projects.</p>

    <h3>7.1 Creating a Transfer</h3>
    <ol>
        <li>Click <strong>Create</strong>.</li>
        <li>Select the <strong>From Project</strong> (source) and <strong>To Project</strong> (destination).</li>
        <li>Select the <strong>From Account</strong> and <strong>To Account</strong> (e.g., Cash/Bank accounts).</li>
        <li>Enter the <strong>Amount</strong> in PKR.</li>
        <li>Set the <strong>Date</strong> and add a <strong>Purpose</strong> description.</li>
        <li>Click <strong>Save</strong>.</li>
    </ol>

    <div class="info-box">
        <strong>No approval needed:</strong> Unlike expenses and payroll, transfers are executed immediately. A journal entry is created and posted automatically.
    </div>

    <h3>7.2 Reversals</h3>
    <p>If a transfer was made in error, click the <strong>three-dot menu (&hellip;)</strong> and select <strong>Reverse</strong>. The system creates a reversal journal entry that mirrors the original. A transfer can only be reversed once.</p>
</div>

{{-- ==================== 8. REPORTS ==================== --}}
<div class="section">
    <h2>8. Reports</h2>
    <p>Navigate to <strong>Reports</strong> in the sidebar. The system provides seven reports with PDF and Excel export support.</p>

    <h3>8.1 Financial Reports</h3>

    <h4>Profit &amp; Loss (P&amp;L)</h4>
    <p>Shows total income minus total expenses over a selected period. Filterable by <strong>date range</strong> and <strong>project</strong>. Shows Net Profit at the bottom.</p>

    <h4>Balance Sheet</h4>
    <p>Shows Assets = Liabilities + Equity as at a specific date. A green <strong>"Balanced"</strong> badge confirms the accounting equation holds. Filterable by <strong>date</strong> and <strong>project</strong>.</p>

    <h4>Income &amp; Expense Summary</h4>
    <p>Summarizes income and expenses with two views:</p>
    <ul>
        <li><strong>By Category</strong> &mdash; Groups by account (e.g., Salaries, Utilities, Revenue)</li>
        <li><strong>By Project</strong> &mdash; Shows income, expenses, and net per project</li>
    </ul>
    <p>Filterable by <strong>date range</strong> and <strong>project</strong>. Toggle between views using the <strong>Group By</strong> selector.</p>

    <h4>Inter-Project Position</h4>
    <p>Shows the net financial position between pairs of projects based on fund transfers. Helps track how much one project owes another.</p>

    <h3>8.2 Project Reports</h3>

    <h4>Project Cashbook</h4>
    <p>Shows cash inflows and outflows for a specific project. Select a project to see:</p>
    <ul>
        <li><strong>Summary cards</strong>: Opening Balance, Total In, Total Out, Closing Balance</li>
        <li><strong>Transaction table</strong>: Each cash transaction with a running balance</li>
    </ul>
    <p>Filterable by <strong>date range</strong> and specific <strong>cash account</strong>.</p>

    <h4>Project Ledger</h4>
    <p>Shows all posted transactions for a specific project across all account types. Select a project to view every debit and credit. Optionally filter by a specific account to see a running balance.</p>

    <h3>8.3 Payroll Report</h3>
    <p>Shows a summary of approved payroll runs. Three summary cards display total runs, employees paid, and total amount disbursed. Click the <strong>expand arrow</strong> on any payroll run to see individual payslip details.</p>

    <h3>8.4 Exporting Reports</h3>
    <p>Most reports support <strong>PDF</strong> and <strong>Excel</strong> export:</p>
    <ol>
        <li>Apply your desired date range and project filters.</li>
        <li>Click the <strong>PDF</strong> or <strong>Excel</strong> button.</li>
        <li>The file downloads automatically to your browser.</li>
    </ol>
</div>

{{-- ==================== 9. ATTACHMENTS ==================== --}}
<div class="section">
    <h2>9. File Attachments</h2>
    <p>You can attach supporting documents to <strong>Expenses</strong>, <strong>Employees</strong>, <strong>Projects</strong>, and <strong>Journal Entries</strong>.</p>

    <h4>Supported File Types</h4>
    <table>
        <tr><th>Format</th><th>Extensions</th></tr>
        <tr><td>Documents</td><td>PDF, DOC, DOCX</td></tr>
        <tr><td>Spreadsheets</td><td>XLS, XLSX</td></tr>
        <tr><td>Images</td><td>JPG, JPEG, PNG</td></tr>
    </table>

    <p><strong>Maximum file size:</strong> 10 MB per file.</p>

    <h4>How to Use</h4>
    <ul>
        <li><strong>Upload:</strong> Open the relevant record's dialog and use the Attachments section to upload files.</li>
        <li><strong>Download:</strong> Click the download icon next to any attachment.</li>
        <li><strong>Delete:</strong> Click the delete icon to remove an attachment (only if you uploaded it or have the appropriate permission).</li>
    </ul>
</div>

{{-- ==================== BACK COVER ==================== --}}
<div class="section" style="text-align: center; padding-top: 200px;">
    <h1 style="font-size: 24px; color: #1a1a1a;">GSK ENGINEERS</h1>
    <div style="width: 60px; height: 3px; background: #2563eb; margin: 16px auto;"></div>
    <p style="color: #888; font-size: 12px;">Engineering Consultancy ERP &mdash; User Guide v1.0</p>
    <p style="color: #aaa; font-size: 11px; margin-top: 8px;">{{ now()->format('F Y') }}</p>
    <p style="color: #ccc; font-size: 10px; margin-top: 40px;">All amounts in Pakistani Rupees (PKR)</p>
    <p style="color: #ccc; font-size: 10px;">For support, contact your system administrator</p>
</div>

</body>
</html>
