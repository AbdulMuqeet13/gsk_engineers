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

### Attendance (`app/Actions/Attendance/`)
| Action | Input | Output |
|--------|-------|--------|
| `CreateAttendanceAction` | `array $data, User $user` | `Attendance` |
| `UpdateAttendanceAction` | `Attendance $attendance, array $data` | `Attendance` |
| `DeleteAttendanceAction` | `Attendance $attendance` | `void` |

### Leave (`app/Actions/Leave/`)
| Action | Input | Output |
|--------|-------|--------|
| `CreateLeaveAction` | `array $data, User $user` | `LeaveRequest` |
| `ApproveLeaveAction` | `LeaveRequest $leave, User $approver` | `void` |
| `RejectLeaveAction` | `LeaveRequest $leave, User $rejector, string $reason` | `void` |
| `DeleteLeaveAction` | `LeaveRequest $leave` | `void` |

These delegate to `LeaveService`. Only pending leaves can be approved, rejected, or deleted.

### Payroll (`app/Actions/Payroll/`)
| Action | Input | Output |
|--------|-------|--------|
| `CreatePayrollRunAction` | `array $data, User $user` | `PayrollRun` |
| `SubmitPayrollRunAction` | `PayrollRun $run` | `void` |
| `ApprovePayrollRunAction` | `PayrollRun $run, User $approver` | `void` |
| `RejectPayrollRunAction` | `PayrollRun $run, User $rejector, string $reason` | `void` |
| `DeletePayrollRunAction` | `PayrollRun $run` | `void` |

These delegate to `PayrollService`. Only drafts can be deleted.

### Transfers (`app/Actions/Transfers/`)
| Action | Input | Output |
|--------|-------|--------|
| `ExecuteTransferAction` | `array $data, User $user` | `InterProjectTransfer` |
| `ReverseTransferAction` | `InterProjectTransfer $transfer` | `void` |

These delegate to `TransferService`.

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
- Hard delete on ProjectAssignment, Expense, PayrollRun, LeaveRequest (no SoftDeletes)
- `cascadeOnDelete` on project_assignments FKs, journal_lines FKs

### Delete Safety Checks (Phase 8)

Actions perform dependency checks before deletion to prevent orphaned data:

| Entity | Safety Check | Exception |
|--------|-------------|-----------|
| Employee | Cannot delete if payslips exist | `DomainException` |
| Project | Cannot delete if has posted JEs, approved expenses, or transfers | `DomainException` |
| Account Head | Cannot delete if has posted JEs or child accounts | `DomainException` |
| Expense | Must be draft | `ExpenseNotDraftException` |
| Payroll Run | Must be draft | `PayrollNotDraftException` |
| Leave Request | Must be pending | `LeaveNotPendingException` |
