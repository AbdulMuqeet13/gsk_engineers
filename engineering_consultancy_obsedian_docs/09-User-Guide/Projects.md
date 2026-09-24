# Projects

## Overview

Projects represent the construction or consultancy engagements your firm undertakes. Every financial transaction (expense, payroll, transfer) is linked to a project, giving you per-project financial visibility.

**Required permission:** `projects.view`, `projects.create`, `projects.update`, `projects.delete`

## Viewing Projects

Navigate to **Projects** in the sidebar. The project list shows:

| Column | Description |
|--------|-------------|
| Code | Short unique identifier (e.g., `PRJ-001`) |
| Name | Full project name |
| Client | Client name |
| Status | Planning, Active, On Hold, Completed, or Cancelled |
| Budget | Allocated budget in PKR |
| Start Date | Project start date |
| End Date | Expected completion date |

Use the **search bar** to find projects by name, code, or client. Use the **status filter** to narrow results.

## Creating a Project

1. Click the **Create** button on the Projects page.
2. Fill in the form:
   - **Code** (required, unique) -- Short identifier like `PRJ-001`
   - **Name** (required) -- Full project name
   - **Client** -- Client or organization name
   - **Status** -- Select from the dropdown (defaults to Planning)
   - **Start Date / End Date** -- Optional date range
   - **Budget** -- Optional budget amount in PKR
3. Click **Save**.

## Editing a Project

1. Click the **three-dot menu** on the project row.
2. Select **Edit**.
3. Modify the fields and click **Save**.

## Deleting a Project

1. Click the **three-dot menu** on the project row.
2. Select **Delete**.
3. Confirm the deletion.

**Note:** A project cannot be deleted if it has:
- Posted journal entries
- Approved expenses
- Inter-project transfers

The system will show an error message explaining which dependency prevents deletion.

## File Attachments

You can attach files to a project (contracts, drawings, documents):

1. Open the project edit dialog.
2. Use the **Attachments** section to upload files.
3. Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX (max 10 MB).
4. Click the **download** icon to retrieve an attachment.
5. Click the **delete** icon to remove an attachment.

## Project Assignments

Navigate to **Projects > Assignments** to manage staff allocation.

### Creating an Assignment

1. Click **Create** on the Assignments page.
2. Select an **Employee** and a **Project**.
3. Enter the **Role** (e.g., Site Engineer, Project Lead).
4. Set **Allocation %** (0-100) -- how much of the employee's time is allocated.
5. Click **Save**.

Each employee can only be assigned to a project once (unique combination).

### Editing / Deleting Assignments

Use the three-dot menu on any assignment row to edit or delete it.
