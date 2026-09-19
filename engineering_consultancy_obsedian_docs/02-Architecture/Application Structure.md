# Application Structure

## Directory Layout

```
app/
├── Actions/                    # Single-responsibility action classes
│   ├── AccountHeads/           #   CreateAccountHead, UpdateAccountHead, DeleteAccountHead
│   ├── Accounting/             #   CreateJournalEntry, UpdateJournalEntry, PostJournalEntry, ReverseJournalEntry
│   ├── Employees/              #   CreateEmployee, UpdateEmployee, DeleteEmployee
│   ├── Expenses/               #   CreateExpense, UpdateExpense, DeleteExpense, SubmitExpense, ApproveExpense, RejectExpense
│   ├── ProjectAssignments/     #   CreateProjectAssignment, UpdateProjectAssignment, DeleteProjectAssignment
│   └── Projects/               #   CreateProject, UpdateProject, DeleteProject
├── Enums/                      # String-backed PHP enums
│   ├── AccountType.php
│   ├── EmployeeType.php
│   ├── ExpenseStatus.php
│   ├── JournalEntryStatus.php
│   ├── JournalEntryType.php
│   ├── NormalBalance.php
│   ├── PermissionEnum.php
│   ├── ProjectStatus.php
│   └── RoleEnum.php
├── Exceptions/                 # Domain exceptions (extend DomainException)
│   ├── Accounting/             #   UnbalancedEntry, InsufficientLines, EntryAlreadyPosted, EntryNotDraft, InactiveAccountHead, EntryAlreadyReversed
│   └── Expenses/               #   ExpenseNotDraft, ExpenseNotSubmitted
├── Http/
│   ├── Controllers/            # Thin controllers, delegate to Actions
│   │   ├── AccountHeadController.php
│   │   ├── EmployeeController.php
│   │   ├── ExpenseController.php
│   │   ├── GeneralLedgerController.php
│   │   ├── JournalEntryController.php
│   │   ├── ProjectAssignmentController.php
│   │   ├── ProjectController.php
│   │   └── TrialBalanceController.php
│   └── Requests/               # Domain-organized Form Requests
│       ├── AccountHeads/
│       ├── Accounting/
│       ├── Employees/
│       ├── Expenses/
│       ├── ProjectAssignments/
│       └── Projects/
├── Models/                     # Eloquent models with LogsActivity
├── Policies/                   # Authorization policies
├── Services/                   # Business logic services
│   ├── JournalService.php      #   Double-entry engine: create, post, reverse
│   └── ExpenseService.php      #   Expense workflow: create, submit, approve, reject
└── Traits/
    └── FlashesToast.php        # Toast notification trait for controllers

database/
├── factories/                  # Model factories with states
├── migrations/                 # Chronological migrations
└── seeders/
    ├── DatabaseSeeder.php
    ├── RolesAndPermissionsSeeder.php
    └── ChartOfAccountsSeeder.php

resources/js/
├── components/
│   ├── account-heads/          # Account head CRUD dialogs + columns
│   ├── app-sidebar.tsx         # Main navigation sidebar
│   ├── data-table/             # Reusable DataTable component
│   ├── employees/              # Employee CRUD dialogs + columns
│   ├── expenses/               # Expense CRUD + workflow dialogs + columns
│   ├── general-ledger/         # General ledger columns
│   ├── journal-entries/        # Journal entry CRUD + post/reverse dialogs + columns + line-form-rows
│   ├── project-assignments/    # Assignment CRUD dialogs + columns
│   ├── projects/               # Project CRUD dialogs + columns
│   ├── trial-balance/          # Trial balance columns
│   └── ui/                     # shadcn/ui primitives
├── hooks/
│   ├── use-data-table.ts       # DataTable hook with partial reloading
│   └── use-can.ts              # Permission/role checking hook
├── pages/
│   ├── accounting/
│   │   ├── chart-of-accounts/
│   │   │   └── index.tsx
│   │   ├── journal-entries/
│   │   │   └── index.tsx
│   │   ├── general-ledger/
│   │   │   └── index.tsx
│   │   └── trial-balance/
│   │       └── index.tsx
│   ├── employees/
│   │   └── index.tsx
│   ├── expenses/
│   │   └── index.tsx
│   └── projects/
│       ├── index.tsx
│       └── assignments/
│           └── index.tsx
└── types/
    ├── index.ts                # Barrel exports
    ├── models.ts               # TypeScript model types + enum unions
    └── permissions.ts          # Permission + Role union types
```

## Architectural Patterns

### Action Pattern
- Single-responsibility classes in `app/Actions/{Domain}/`
- Each action: `Create*`, `Update*`, `Delete*`
- Receives validated `array $data` and optional model instance
- Performs one write operation, returns model or void
- Method-injected into controller methods

### Controller Pattern
- Thin controllers -- only handle HTTP concerns
- Use `FlashesToast` trait for success/error toasts
- Delegate writes to Action classes
- Use `$this->authorize()` for policy checks (requires `AuthorizesRequests` trait)

### Service Pattern (Phase 3+)
- For multi-step business logic (JournalService, PayrollService, TransferService)
- Wrap multi-write operations in `DB::transaction`
- Enforce accounting invariants

### Form Request Pattern
- Domain-organized: `app/Http/Requests/{Domain}/`
- `authorize()` checks Spatie permissions
- `rules()` returns validation rules
- Unique validation uses `Rule::unique()->ignore()` on updates
