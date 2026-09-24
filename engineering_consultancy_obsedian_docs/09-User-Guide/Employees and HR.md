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

The employee list shows name, email, type, project (for project employees), designation, department, salary, and active status.

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
   - **Date of Joining**
   - **Salary** -- Monthly salary in PKR
   - **CNIC** -- National ID number
   - **Address**
   - **Active** -- Whether the employee is currently active
3. Click **Save**.

### Editing / Deleting Employees

- Use the **three-dot menu** to edit or delete.
- An employee **cannot be deleted** if they have payroll history (payslips exist).
- Prefer marking an employee as **inactive** instead of deleting.

### File Attachments

Attach documents (ID copies, contracts, certificates) to employee records via the Attachments section.

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
