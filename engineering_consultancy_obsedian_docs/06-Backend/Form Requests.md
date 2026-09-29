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

### Incomes (`app/Http/Requests/Incomes/`)
**StoreProjectIncomeRequest:** `incomes.create`
- `project_id`: required, exists, not deleted, status not completed/cancelled
- `income_account_id`: required, active `income` account ("must be an active income account")
- `deposit_account_id`: required, active `asset` account
- `amount`: required, numeric, gt:0, decimal:0,2 -- `date` required -- `description` required max:500 -- `received_from`, `cheque_number` nullable

**ReverseProjectIncomeRequest:** policy `reverse`, `reason` nullable max:500

### Account Transfers (`app/Http/Requests/AccountTransfers/`)
**StoreAccountTransferRequest:** `account-transfers.create`
- `from_account_id` / `to_account_id`: required, active `asset` accounts; `to_account_id` `different:from_account_id`
- `project_id`: nullable, active project -- `amount` gt:0 -- `date`, `description` required

### Salaries (`app/Http/Requests/Salaries/`)
Shared rules from `App\Concerns\SalaryValidationRules`:
- `components`: required array min:1; `components.*.salary_component_id` required, distinct, exists (not deleted); `components.*.amount` **nullable**, numeric, min:0 (blank = 0)
- `tax_amount`, `security_amount`: nullable, numeric, min:0
- `after()`: at least one component amount > 0
- readable attribute names via `salaryBreakdownAttributes()`

**StoreEmployeeRequest:** `salary` removed; includes the salary breakdown rules
**UpdateEmployeeRequest:** `salary` removed (salary changes only via history)
**StoreEmployeeSalaryRequest:** policy `update` on the employee; `effective_date` required; `change_type` enum except `initial`; `remarks` nullable
**StoreSecurityRefundRequest:** `payroll.approve`; `amount` gt:0; `date`; `payment_account_id` active asset
**Store/UpdateSalaryComponentRequest:** `payroll.run`; `name` unique; `sort_order` int min:0; `is_active` boolean

### Payroll -- Phase 9 changes
**StorePayrollRunRequest:** `after()` rejects a period overlapping a non-rejected run (error on `period_start`)
**UpdatePayslipRequest:** `tax_amount`, `security_amount`, `deductions` required numeric min:0; `after()` total deductions ≤ gross

### ProjectAssignments -- Phase 9 changes
`allowances` nullable array; `allowances.*.name` required max:100; `allowances.*.amount` gt:0
