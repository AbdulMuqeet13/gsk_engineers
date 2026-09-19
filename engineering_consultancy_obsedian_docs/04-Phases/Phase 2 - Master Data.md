# Phase 2 - Master Data

**Status:** Done (completed 2026-09-15)

## What Was Built

Four CRUD modules following a consistent architecture: Enum -> Migration -> Model -> Factory -> Seeder -> Policy -> Form Request -> Action -> Controller -> Routes -> Frontend -> Tests.

### 1. Chart of Accounts (AccountHead)

**Purpose:** Hierarchical chart of accounts for double-entry bookkeeping.

| Layer | Files |
|-------|-------|
| Enum | `AccountType.php`, `NormalBalance.php` |
| Migration | `create_account_heads_table` |
| Model | `AccountHead.php` -- self-referencing parent/children, SoftDeletes |
| Factory | `AccountHeadFactory.php` -- states: inactive, asset, expense, withParent |
| Seeder | `ChartOfAccountsSeeder.php` -- 20 default accounts, idempotent |
| Policy | `AccountHeadPolicy.php` -- view/manage permissions |
| Requests | `StoreAccountHeadRequest`, `UpdateAccountHeadRequest` |
| Actions | `CreateAccountHead`, `UpdateAccountHead`, `DeleteAccountHead` |
| Controller | `AccountHeadController.php` -- search by code/name, type filter |
| Route | `GET/POST/PUT/DELETE /accounting/chart-of-accounts` (named `account-heads.*`) |
| Frontend | columns, create/edit/delete dialogs, index page |
| Tests | `AccountHeadTest.php` (9 tests), `ChartOfAccountsSeederTest.php` (6 tests) |

**Default Accounts Seeded (20):**

| Code | Name | Type |
|------|------|------|
| 1000 | Assets | asset |
| 1001 | Cash | asset |
| 1002 | Bank | asset |
| 1003 | Project Fund | asset |
| 1010 | Accounts Receivable | asset |
| 1020 | Inter-Project Receivable | asset |
| 2000 | Liabilities | liability |
| 2010 | Accounts Payable | liability |
| 2020 | Inter-Project Payable | liability |
| 3000 | Equity | equity |
| 3001 | Owner Equity | equity |
| 3002 | Retained Earnings | equity |
| 4000 | Income | income |
| 4001 | Project Income | income |
| 5000 | Expenses | expense |
| 5001 | Salaries | expense |
| 5002 | Rent | expense |
| 5003 | Fuel | expense |
| 5004 | Food | expense |
| 5005 | General Expenses | expense |

### 2. Projects

**Purpose:** Track engineering projects with status, dates, budget, and staff.

| Layer | Files |
|-------|-------|
| Enum | `ProjectStatus.php` (Planning, Active, OnHold, Completed, Cancelled) |
| Migration | `create_projects_table` |
| Model | `Project.php` -- hasMany employees & assignments, SoftDeletes |
| Factory | `ProjectFactory.php` -- states: planning, active, completed, onHold, cancelled |
| Policy | `ProjectPolicy.php` -- view/create/update/delete permissions |
| Requests | `StoreProjectRequest`, `UpdateProjectRequest` |
| Actions | `CreateProject`, `UpdateProject`, `DeleteProject` |
| Controller | `ProjectController.php` -- search by name/code/client, status filter |
| Route | `GET/POST/PUT/DELETE /projects` |
| Frontend | columns, create/edit/delete dialogs, index page |
| Tests | `ProjectTest.php` (9 tests) |

### 3. Employees

**Purpose:** Manage internal and project-based employees.

| Layer | Files |
|-------|-------|
| Enum | `EmployeeType.php` (Internal, Project) |
| Migration | `create_employees_table` |
| Model | `Employee.php` -- belongsTo project, hasMany assignments, scopes, SoftDeletes |
| Factory | `EmployeeFactory.php` -- states: internal, projectBased, inactive |
| Policy | `EmployeePolicy.php` -- view/create/update/delete permissions |
| Requests | `StoreEmployeeRequest`, `UpdateEmployeeRequest` |
| Actions | `CreateEmployee`, `UpdateEmployee`, `DeleteEmployee` |
| Controller | `EmployeeController.php` -- search, type/project filters |
| Route | `GET/POST/PUT/DELETE /employees` |
| Frontend | columns, create/edit/delete dialogs, index page |
| Tests | `EmployeeTest.php` (10 tests) |

**Key Rule:** `project_id` is `required_if` type is "project" and `prohibited_if` type is "internal".

### 4. Project Assignments

**Purpose:** Assign internal employees to projects with role and allocation.

| Layer | Files |
|-------|-------|
| Migration | `create_project_assignments_table` |
| Model | `ProjectAssignment.php` -- no SoftDeletes, unique [employee_id, project_id] |
| Factory | `ProjectAssignmentFactory.php` |
| Policy | `ProjectAssignmentPolicy.php` -- all operations require `projects.assign` |
| Requests | `StoreProjectAssignmentRequest`, `UpdateProjectAssignmentRequest` |
| Actions | `CreateProjectAssignment`, `UpdateProjectAssignment`, `DeleteProjectAssignment` |
| Controller | `ProjectAssignmentController.php` -- project/employee filters |
| Route | `GET/POST/PUT/DELETE /projects/assignments` (named `project-assignments.*`) |
| Frontend | columns, create/edit/delete dialogs, index page |
| Tests | `ProjectAssignmentTest.php` (8 tests) |

## File Count

| Category | Count |
|----------|-------|
| Enums | 4 |
| Migrations | 4 |
| Models | 4 |
| Factories | 4 |
| Seeders | 1 (+ DatabaseSeeder update) |
| Policies | 4 |
| Form Requests | 8 |
| Actions | 12 |
| Controllers | 4 |
| Route updates | 1 |
| TypeScript types | 2 |
| Frontend components | 16 |
| Pages | 4 |
| Test files | 5 |
| **Total** | **~68** |

## Verification Results

- 87 tests, 360 assertions -- all passing
- `npm run build` -- clean, no TypeScript errors
- `migrate:fresh --seed` -- all tables created, 20 account heads + roles seeded
- `vendor/bin/pint` -- no formatting issues
