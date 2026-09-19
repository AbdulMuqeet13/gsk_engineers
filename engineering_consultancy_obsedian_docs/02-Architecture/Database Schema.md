# Database Schema

## Entity Relationship Overview

```
users ──< role_assignments >── roles ──< permission_assignments >── permissions

account_heads (self-referencing parent_id)

projects ──< employees (project-based only, via project_id)
projects ──< project_assignments >── employees (internal, via pivot)

journal_entries ──< journal_lines ──> account_heads
                                  ──> projects (nullable dimension)
journal_entries ──> journal_entries (reversal self-refs)

expenses ──> account_heads (expense category + payment account)
         ──> projects (nullable)
         ──> journal_entries (set on approval)
         ──> users (created_by, approved_by)

(Phase 5+)
inter_project_transfers ──> journal_entries
payroll_runs ──< payslips ──> employees
```

## Tables (Phase 1-4)

### users
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| name | string | |
| email | string, unique | |
| email_verified_at | timestamp, nullable | |
| password | string | |
| remember_token | string, nullable | |
| timestamps | | |

### account_heads
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| code | string, unique | e.g. "1000", "5003" |
| name | string | |
| type | string | asset, liability, equity, income, expense |
| normal_balance | string | debit, credit |
| parent_id | FK -> account_heads, nullable | nullOnDelete |
| is_active | boolean, default true | |
| timestamps | | |
| deleted_at | softDeletes | |
| **Indexes** | type, is_active | |

### projects
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| name | string | |
| code | string, unique | |
| client | string, nullable | |
| status | string | planning, active, on_hold, completed, cancelled |
| start_date | date, nullable | |
| end_date | date, nullable | |
| budget | decimal(18,2), nullable | |
| timestamps | | |
| deleted_at | softDeletes | |
| **Indexes** | status | |

### employees
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| name | string | |
| email | string, nullable, unique | |
| phone | string, nullable | |
| type | string | internal, project |
| project_id | FK -> projects, nullable | nullOnDelete; only for project employees |
| designation | string | |
| department | string | |
| date_of_joining | date | |
| salary | decimal(18,2) | |
| cnic | string | National ID |
| address | text | |
| is_active | boolean, default true | |
| timestamps | | |
| deleted_at | softDeletes | |
| **Indexes** | type, is_active | |

### project_assignments
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| employee_id | FK -> employees | cascadeOnDelete |
| project_id | FK -> projects | cascadeOnDelete |
| role | string | Role on the project |
| allocation_percent | decimal(5,2), default 100 | |
| timestamps | | |
| **Unique** | [employee_id, project_id] | No duplicate assignments |
| **No softDeletes** | | Pivot-like table |

### journal_entries
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| date | date | |
| reference | string, unique | Format: JE-YYYY-NNNNNN |
| description | string | |
| type | string | standard, simple, payroll, transfer, opening, expense |
| status | string | draft, posted |
| created_by | FK -> users | restrictOnDelete |
| reversed_by_id | FK -> journal_entries, nullable | nullOnDelete |
| reversal_of_id | FK -> journal_entries, nullable | nullOnDelete |
| timestamps | | |
| **Indexes** | date, status, type, created_by | |

### journal_lines
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| journal_entry_id | FK -> journal_entries | cascadeOnDelete |
| account_head_id | FK -> account_heads | restrictOnDelete |
| project_id | FK -> projects, nullable | nullOnDelete; cost dimension |
| debit | decimal(18,2), default 0 | |
| credit | decimal(18,2), default 0 | |
| memo | string, nullable | |
| timestamps | | |
| **Indexes** | journal_entry_id, account_head_id, project_id | |

### expenses
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| reference | string, unique | Format: EXP-YYYY-NNNNNN |
| date | date | |
| description | string(500) | |
| amount | decimal(18,2) | |
| status | string | draft, submitted, approved, rejected |
| account_head_id | FK -> account_heads | restrictOnDelete; expense category |
| payment_account_id | FK -> account_heads | restrictOnDelete; cash/bank |
| project_id | FK -> projects, nullable | nullOnDelete |
| journal_entry_id | FK -> journal_entries, nullable | nullOnDelete; set on approval |
| created_by | FK -> users | restrictOnDelete |
| approved_by | FK -> users, nullable | nullOnDelete |
| approved_at | timestamp, nullable | |
| rejection_reason | string(500), nullable | |
| notes | text, nullable | |
| timestamps | | |
| **Indexes** | date, status, project_id, account_head_id, created_by | |
| **No softDeletes** | | Status-based approach for financial records |

### activity_log (Spatie)
Managed by `spatie/laravel-activitylog`. Logs all model create/update/delete events with attribute changes.

### Spatie Permission Tables
- `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, `role_has_permissions`
