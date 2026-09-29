# Employees and HR

## Employee Management

Navigate to **HR > Employees** in the sidebar.

**Required permission:** `employees.view`, `employees.create`, `employees.update`, `employees.delete`

### Employee Types

| Type | Description |
|------|-------------|
| **Internal** | Office/HQ staff not tied to a specific project |
| **Project** | Field staff assigned to a specific project |

### Viewing Employees

The employee list shows name, email, type, project (for project employees), designation, department, **gross salary** (current salary record), and active status. Click an employee's **name** to open their employee page.

- **Search** by name, email, or CNIC.
- **Filter** by employee type (Internal / Project) or active status.

### Creating an Employee

1. Click **Create**.
2. Fill in the form:
   - **Name** (required)
   - **Email** (required, unique)
   - **Phone**
   - **Type** (required) -- Internal or Project
   - **Project** -- Required if type is Project, hidden if Internal
   - **Designation** -- Job title
   - **Department**
   - **Date of Joining** -- also the effective date of the first salary record
   - **CNIC** -- National ID number
   - **Address**
   - **Salary Breakdown** -- a monthly amount for each salary component (Basic Salary, House Rent, Medical, Conveyance, ...). Leave components blank if they don't apply; at least one must have an amount.
   - **Monthly Tax** and **Monthly Security Deduction** (optional)
   - **Active** -- Whether the employee is currently active
3. The form shows the **Gross Salary** and **Net (before allowances)** as you type.
4. Click **Add Employee**. An **Initial** salary record is created automatically.

### Editing / Deleting Employees

The edit form does not change salary -- use **Add Increment / Revision** on the employee page instead, so the history is kept.

- Use the **three-dot menu** to edit or delete.
- An employee **cannot be deleted** if they have payroll history (payslips exist).
- Prefer marking an employee as **inactive** instead of deleting.

### File Attachments

Attach documents (ID copies, contracts, certificates) to employee records via the Attachments section.

---

## Employee Page

Click an employee's name in the list. The page shows:

- **Current Salary** -- the salary record in effect today: each component, project allowances, gross, tax, security and net salary. If a future increment exists, the card notes the new amount and the date it starts.
- **Project Assignments** -- each project with role, allocation and allowances.
- **Security Deposit** -- balance held and past refunds.
- **Salary & Employment History** -- every salary record.
- **Recent Payslips** -- the last 12 payroll runs with gross, tax, security and net.

### Salary & Employment History

Every salary change is kept as its own record, newest first, showing effective date, type (Initial / Increment / Decrement / Revision), gross, the **change from the previous record** (amount and %), tax, security and remarks. Records effective in the future are marked **Upcoming**.

**Adding an increment or revision:**

1. Click **Add Increment / Revision** (requires `employees.update`).
2. The form is pre-filled with the latest salary. Set the **Effective Date** and **Type**.
3. Change the component amounts, tax or security, and add **Remarks** (e.g. "Annual increment 2026").
4. Click **Save Salary**.

Payroll uses the latest record effective **on or before the end of the pay period**, so an increment effective 01-10-2026 is paid from the October payroll onwards.

**Deleting a record:** use the bin icon. A record already used in a payroll run, or an employee's only record, cannot be deleted.

### Security Deposit

The monthly security deduction is held for the employee as a refundable deposit. The balance counts deductions from **approved** payroll runs only.

**Refunding** (requires `payroll.approve`, e.g. on final settlement):

1. Click **Refund** on the Security Deposit card.
2. Enter the **Amount** (cannot exceed the balance), **Date**, **Pay From** account (Cash / Bank) and optional remarks.
3. Click **Refund**. A journal entry is posted: Dr 2040 Employee Security Deposits / Cr the payment account.

---

## Attendance

Navigate to **HR > Attendance** in the sidebar.

**Required permission:** `attendance.view`, `attendance.create`, `attendance.update`, `attendance.delete`

### Recording Attendance

1. Click **Create**.
2. Select the **Employee**.
3. Set the **Date**.
4. Choose **Status**: Present, Absent, Half Day, or Leave.
5. Optionally enter **Check In** and **Check Out** times.
6. Add **Notes** if needed.
7. Click **Save**.

### Editing / Deleting

Use the three-dot menu on any attendance row to edit or delete records.

**Tip:** Attendance data is used during payroll creation to calculate days worked and days absent for each employee.

---

## Leave Requests

Navigate to **HR > Leave Requests** in the sidebar.

**Required permission:** `leave.view`, `leave.create`, `leave.approve`

### Leave Types

| Type | Description |
|------|-------------|
| Annual | Regular annual leave |
| Sick | Medical/sick leave |
| Casual | Short-notice casual leave |
| Unpaid | Leave without pay |

### Creating a Leave Request

1. Click **Create**.
2. Select the **Employee**.
3. Choose the **Leave Type**.
4. Set **Start Date** and **End Date**.
5. The system calculates **Days** automatically.
6. Enter a **Reason**.
7. Click **Save**.

The request is created with **Pending** status.

### Approval Workflow

```
Pending --> Approved
        --> Rejected (with reason)
```

- Click the **three-dot menu** on a pending request.
- Select **Approve** or **Reject**.
- If rejecting, provide a **rejection reason**.
- Only pending leave requests can be approved, rejected, or deleted.
