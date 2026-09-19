# Action Classes

All actions follow a single-responsibility pattern. Each receives validated data and performs one write operation.

## Reference

### AccountHeads (`app/Actions/AccountHeads/`)
| Action | Input | Output |
|--------|-------|--------|
| `CreateAccountHead` | `array $data` | `AccountHead` |
| `UpdateAccountHead` | `AccountHead $accountHead, array $data` | `AccountHead` |
| `DeleteAccountHead` | `AccountHead $accountHead` | `void` |

### Projects (`app/Actions/Projects/`)
| Action | Input | Output |
|--------|-------|--------|
| `CreateProject` | `array $data` | `Project` |
| `UpdateProject` | `Project $project, array $data` | `Project` |
| `DeleteProject` | `Project $project` | `void` |

### Employees (`app/Actions/Employees/`)
| Action | Input | Output |
|--------|-------|--------|
| `CreateEmployee` | `array $data` | `Employee` |
| `UpdateEmployee` | `Employee $employee, array $data` | `Employee` |
| `DeleteEmployee` | `Employee $employee` | `void` |

### ProjectAssignments (`app/Actions/ProjectAssignments/`)
| Action | Input | Output |
|--------|-------|--------|
| `CreateProjectAssignment` | `array $data` | `ProjectAssignment` |
| `UpdateProjectAssignment` | `ProjectAssignment $assignment, array $data` | `ProjectAssignment` |
| `DeleteProjectAssignment` | `ProjectAssignment $assignment` | `void` |

### JournalEntries (`app/Actions/Accounting/`)
| Action | Input | Output |
|--------|-------|--------|
| `CreateJournalEntryAction` | `array $data, User $user` | `JournalEntry` |
| `UpdateJournalEntryAction` | `JournalEntry $entry, array $data` | `JournalEntry` |
| `PostJournalEntryAction` | `JournalEntry $entry` | `void` |
| `ReverseJournalEntryAction` | `JournalEntry $entry, User $user, string $reason` | `JournalEntry` |

These delegate to `JournalService` (constructor-injected).

### Expenses (`app/Actions/Expenses/`)
| Action | Input | Output |
|--------|-------|--------|
| `CreateExpenseAction` | `array $data, User $user` | `Expense` |
| `UpdateExpenseAction` | `Expense $expense, array $data` | `Expense` |
| `DeleteExpenseAction` | `Expense $expense` | `void` |
| `SubmitExpenseAction` | `Expense $expense` | `void` |
| `ApproveExpenseAction` | `Expense $expense, User $approver` | `void` |
| `RejectExpenseAction` | `Expense $expense, User $rejector, string $reason` | `void` |

These delegate to `ExpenseService` (constructor-injected).

## Usage Pattern

Actions are method-injected into controller methods:

```php
public function store(StoreEmployeeRequest $request, CreateEmployee $action): RedirectResponse
{
    $action->handle($request->validated());
    $this->toast('Employee created.');
    return to_route('employees.index');
}
```

## Note on Delete Actions

Delete actions call `$model->delete()` which triggers:
- SoftDeletes on models that use it (AccountHead, Project, Employee)
- Hard delete on ProjectAssignment, Expense (no SoftDeletes)
- `cascadeOnDelete` on project_assignments FKs, journal_lines FKs
- Expense deletion only allowed for drafts (enforced by ExpenseService)
