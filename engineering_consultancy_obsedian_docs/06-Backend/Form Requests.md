# Form Requests

All form requests are domain-organized in `app/Http/Requests/{Domain}/`.

## Authorization

Each request's `authorize()` method checks the relevant Spatie permission:

```php
public function authorize(): bool
{
    return $this->user()->can('employees.create');
}
```

## Validation Highlights

### AccountHeads
- `code`: required, string, unique (ignore self on update)
- `name`: required, string
- `type`: required, `Rule::enum(AccountType::class)`
- `normal_balance`: required, `Rule::enum(NormalBalance::class)`
- `parent_id`: nullable, exists in account_heads
- `is_active`: boolean

### Projects
- `code`: required, string, unique (ignore self on update)
- `name`: required, string
- `status`: required, `Rule::enum(ProjectStatus::class)`
- `start_date`: nullable, date
- `end_date`: nullable, date, after_or_equal:start_date
- `budget`: nullable, numeric, min:0

### Employees
- `type`: required, `Rule::enum(EmployeeType::class)`
- `project_id`: `required_if:type,project` + `prohibited_if:type,internal` + exists in projects
- `email`: nullable, email, unique (ignore self on update)
- `salary`: required, numeric, min:0
- `date_of_joining`: required, date
- Standard string fields: name, phone, designation, department, cnic, address

### ProjectAssignments
- `employee_id`: required, exists in employees, unique combo with project_id (ignore self on update)
- `project_id`: required, exists in projects
- `role`: required, string
- `allocation_percent`: required, numeric, min:0, max:100

### JournalEntries (`app/Http/Requests/Accounting/`)
**StoreJournalEntryRequest / UpdateJournalEntryRequest:**
- `date`: required, date
- `description`: required, string
- `type`: required, `Rule::enum(JournalEntryType::class)`
- `lines`: required, array, min:2
- `lines.*.account_head_id`: required, exists in account_heads
- `lines.*.project_id`: nullable, exists in projects
- `lines.*.debit`: required, numeric, min:0, decimal:0,2
- `lines.*.credit`: required, numeric, min:0, decimal:0,2
- `lines.*.memo`: nullable, string

**PostJournalEntryRequest:** Authorize only (accounting.post + isDraft)
**ReverseJournalEntryRequest:** Authorize only (accounting.reverse + isPosted + not reversed), optional `reason` field

### Expenses (`app/Http/Requests/Expenses/`)
**StoreExpenseRequest / UpdateExpenseRequest:**
- `date`: required, date
- `description`: required, string, max:500
- `amount`: required, numeric, gt:0, decimal:0,2
- `account_head_id`: required, exists in account_heads (where type=expense, is_active=true)
- `payment_account_id`: required, exists in account_heads (where type=asset, is_active=true)
- `project_id`: nullable, exists in projects
- `notes`: nullable, string, max:2000

**SubmitExpenseRequest:** Authorize only (expenses.create + isDraft)
**ApproveExpenseRequest:** Authorize only (expenses.approve + isSubmitted)
**RejectExpenseRequest:** Authorize (expenses.approve + isSubmitted), `reason` required string max:500
