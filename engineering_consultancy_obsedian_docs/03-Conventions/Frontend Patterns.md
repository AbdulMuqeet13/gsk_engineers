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
- Filter state management
- Pagination integration

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
