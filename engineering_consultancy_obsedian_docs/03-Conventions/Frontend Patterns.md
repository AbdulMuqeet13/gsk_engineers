# Frontend Patterns

## Dialog-First UI

All CRUD operations use modal dialogs -- no separate create/edit pages.

### Component Structure (per module)
```
resources/js/components/{module}/
├── {module}-columns.tsx        # TanStack column definitions
├── create-{module}-dialog.tsx  # Create dialog with useForm
├── edit-{module}-dialog.tsx    # Edit dialog, pre-populated
└── delete-{module}-dialog.tsx  # Confirmation dialog
```

### Every component in its own file
No inline sub-components. Each dialog, column definition, and page is a separate file.

## DataTable Pattern

Uses `@tanstack/react-table` v9 + shadcn Table + `useDataTable` hook.

### v9 API (NOT v8)
```tsx
import { createCoreRowModel, createTableHook, flexRender } from '@tanstack/react-table';

const useTable = createTableHook({ features: [createCoreRowModel] });

// In component:
const table = useTable({
    data,
    columns,
});
```

### useDataTable Hook
Located at `resources/js/hooks/use-data-table.ts`. Provides:
- Partial reloading via `router.reload({ only: ['mainProp'] })`
- Search debouncing
- Filter state management (read from the URL, so filters survive a refresh)
- Pagination integration
- `getFilterValues(key)` for multi-select filters

### Multi-Select Filters
`DataTableFilter` values are sent comma-separated: `setFilter('status', value.join(','))`, read back with `getFilterValues('status')`. Controllers filter with `whereIn('status', explode(',', $status))`.

### Report Page Filters
Report pages keep filters in `useState` and reload with `router.reload({ data })`, which writes them to the URL. Seed each filter from the URL with `useQueryParams()` (`hooks/use-query-params.ts`) -- e.g. `useState(queryParams.get('project_id') ?? '')` -- or a browser refresh shows filtered data with empty filter controls.

### Key Rule: Partial Reloading
**Always** use `router.reload({ only: [...] })` for same-page data refreshes. **Never** use `router.get()` to reload the current route.

## Page Pattern

```tsx
// resources/js/pages/employees/index.tsx
export default function EmployeesIndex({ employees, employeeTypes, projects }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
    const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);

    return (
        <AppLayout>
            <Head title="Employees" />
            {/* Header with Create button */}
            <DataTable columns={columns} data={employees.data} />
            {/* Pagination */}
            <CreateEmployeeDialog open={createOpen} onOpenChange={setCreateOpen} />
            <EditEmployeeDialog employee={editEmployee} onClose={() => setEditEmployee(null)} />
            <DeleteEmployeeDialog employee={deleteEmployee} onClose={() => setDeleteEmployee(null)} />
        </AppLayout>
    );
}
```

### Props Pattern
- Main data as paginated collection (e.g. `employees: PaginatedData<Employee>`)
- Filter options as simple arrays (e.g. `employeeTypes: string[]`)
- Related models for selects (e.g. `projects: Pick<Project, 'id' | 'name'>[]`)

## Form Pattern (Inertia useForm)

```tsx
const form = useForm({
    name: '',
    email: '',
    type: 'internal' as EmployeeType,
});

const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    form.post(route('employees.store'), {
        onSuccess: () => onOpenChange(false),
    });
};
```

- Use `useForm` from `@inertiajs/react`
- POST for create, PUT for update, DELETE for destroy
- `onSuccess` callback to close dialog
- Display validation errors from `form.errors`

## Sidebar Navigation

Located at `resources/js/components/app-sidebar.tsx`. Uses Wayfinder for type-safe routes:

```tsx
import { index as accountHeadsIndex } from '@/actions/App/Http/Controllers/AccountHeadController';

// In nav items:
{ title: 'Chart of Accounts', href: accountHeadsIndex().url }
```

## TypeScript Types

Located at `resources/js/types/models.ts`:

```typescript
export type EmployeeType = 'internal' | 'project';

export type Employee = {
    id: number;
    name: string;
    email: string | null;
    type: EmployeeType;
    project?: Pick<Project, 'id' | 'name' | 'code'>;
    // ...
};
```

- Enum types as string unions matching PHP enum values
- Model types with optional relationship fields
- Barrel-exported from `resources/js/types/index.ts`

## Dates (Phase 9)

- **Never** use `<Input type="date">` -- use `DatePicker` from `@/components/date-picker`.
- Form state and requests use ISO `YYYY-MM-DD`; the picker displays **dd-mm-yyyy**.
- Server sends display dates as `dd-mm-yyyy` (model casts); when pre-filling an edit form convert with `toInputDate()`.
- Filters: `<DatePicker clearable size="sm" className="w-[150px]" ... />` and `setFilter(key, value || undefined)`.

## Money Formatting

Use `formatAmount()` from `@/lib/utils` in new code (older columns files still define local helpers).

## Select Triggers and Dialog Sizing

The `SelectTrigger` primitive defaults to `w-full min-w-0` and truncates long values with an ellipsis, so selects in dialog grids no longer need a width class. Filter-toolbar selects pass an explicit width (e.g. `h-8 w-[160px]`). `SelectContent` is capped to the viewport width and long options wrap.

`DialogContent` is capped to `100dvh - 2rem` and scrolls (`overflow-y-auto`), so tall forms are scrollable on mobile without per-dialog `max-h` classes.

## Toasts

Controllers flash via `FlashesToast` → `Inertia::flash('toast', ...)`; `useFlashToast` listens to the `flash` router event. Don't read toasts from shared props.
