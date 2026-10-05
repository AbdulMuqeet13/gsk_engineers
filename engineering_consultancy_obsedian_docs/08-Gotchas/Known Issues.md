# Known Issues & Gotchas

## Laravel 13

### AuthorizesRequests Not Included
Laravel 13's base `Controller` class does not include the `AuthorizesRequests` trait. You must add it manually:

```php
// app/Http/Controllers/Controller.php
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller
{
    use AuthorizesRequests;
}
```

Without this, `$this->authorize()` calls in controllers will throw "method not found".

## Spatie ActivityLog

### LogOptions Namespace
The correct import is:
```php
use Spatie\Activitylog\Support\LogOptions;
```

**NOT** `Spatie\Activitylog\LogOptions`. Laravel Pint's `ordered_imports` fixer may incorrectly simplify the namespace. If you get "class not found" for LogOptions, check the import.

## TanStack React Table v9

### Breaking API Changes from v8
v9 completely changed the core API:

| v8 (old) | v9 (current) |
|----------|-------------|
| `import { useReactTable, getCoreRowModel }` | `import { createTableHook, createCoreRowModel }` |
| `useReactTable({ getCoreRowModel: getCoreRowModel(), ... })` | `const useTable = createTableHook({ features: [createCoreRowModel] }); useTable({ ... })` |

If you see `useReactTable is not exported`, you're using v8 patterns with v9.

## Route Parameter Naming

### Chart of Accounts Route
The resource route for chart of accounts needs an explicit parameter name:

```php
Route::resource('accounting/chart-of-accounts', AccountHeadController::class)
    ->parameter('chart-of-accounts', 'account_head');
```

Without `.parameter()`, Laravel generates `{chart_of_account}` (singularized from the URL segment), which doesn't match the controller's `AccountHead $accountHead` type hint.

## shadcn CLI

### Installation Issues
The `npx shadcn@latest add` command may fail or produce unexpected results. If components don't install correctly, manually copy component code from the shadcn/ui docs into `resources/js/components/ui/`.

## Decimal Fields in JSON

PHP's `decimal:2` cast sends values as **strings** in JSON responses (e.g. `"50000.00"` not `50000`). TypeScript types must use `string`, not `number`, for these fields. This applies to: `salary`, `budget`, `allocation_percent`.

## Vite Manifest Error

If you see "Unable to locate file in Vite manifest", run:
```bash
npm run build
# or for development:
npm run dev
```

Tests should use `$this->withoutVite()` in setUp to avoid this.

## TanStack React Table v9 API

### createTableHook Returns an Object, Not a Function

`createTableHook()` returns `{ useAppTable, ... }`, not a callable function. Destructure to get the hook:

```tsx
const { useAppTable: useTable } = createTableHook({ features: [createCoreRowModel] });
```

### Prefer useTable + tableFeatures Over createTableHook

The simpler v9 pattern uses `tableFeatures({})` + `useTable` directly:

```tsx
import { tableFeatures, useTable } from '@tanstack/react-table';
const features = tableFeatures({});
const table = useTable({ features, columns, data });
```

### Feature-Gated Methods

In v9, methods like `row.getVisibleCells()` and `row.getIsSelected()` require their features to be registered (`columnVisibilityFeature`, `rowSelectionFeature`). Without them, use `row.getAllCells()` and skip selection checks.

### FlexRender is Now a Component

v9 provides `<table.FlexRender header={header} />` and `<table.FlexRender cell={cell} />` as components. The old `flexRender()` function still works but the component pattern is preferred.

## Inertia::optional Props

`Inertia::optional()` props are `undefined` until explicitly requested via partial reloading. Always provide default values in the component destructure:

```tsx
export default function Page({ projects = [], accounts = [] }: Props) { ... }
```

Without defaults, `.map()` calls on these props will crash with "Cannot read properties of undefined".

## SuperAdmin Gate Bypass in Tests

`Gate::before()` in `AppServiceProvider` returns `true` for Super Admin, bypassing ALL policy checks including status conditions (e.g. "must be draft"). When testing that a policy denies access based on model state, use a **non-SuperAdmin role** that has the base permission (e.g. Accountant for expenses).

## Inertia v3 Changes

- `Inertia::lazy()` is removed -- use `Inertia::optional()` instead
- Axios removed -- use built-in XHR client or install Axios separately
- `router.cancel()` replaced by `router.cancelAll()`
- Always use `router.reload({ only: [...] })` for partial reloading, not `router.get()` on the same route

## Phase 9 Gotchas

### Dates must be sent as ISO
Display format is `dd-mm-yyyy`, but always submit `YYYY-MM-DD`. PHP's `strtotime` reads dashed dates as day-month-year, so sending display strings would silently swap day and month for US-style input. `DatePicker` already emits ISO.

### Clearing Inertia GET filters
`router.reload({ data })` merges `data` into the **current** query string. Omitting a key keeps its old value; pass the key as `undefined` to remove it (fixed in `useDataTable`).

### Filters lost on refresh / multi-select returned nothing
Report pages initialised filters to `''`, so after a refresh the server (reading the URL) showed filtered data while the controls were blank -- they now seed from `useQueryParams()`. Multi-select filters were sent as `a,b` but controllers used `where('col', 'a,b')` (no rows) and pages didn't split the value back; controllers now use `whereIn` + `explode` and pages use `getFilterValues()`.

### Toasts need `Inertia::flash`
`session()->flash('toast', ...)` does not fire the frontend `flash` event. Use `FlashesToast` (which calls `Inertia::flash`).

### New permissions need the seeder
Permissions exist only after `RolesAndPermissionsSeeder` runs; until then sidebar items are hidden even for Super Admin (sidebar filters on `getAllPermissions()`). The seeder resets roles to defaults.

### shadcn CLI picks pnpm
`npx shadcn add ...` tried `pnpm` and extra packages (`radix-ui`, `date-fns`). This project uses **npm**: install the dependency with npm and add the component file manually.

### Prettier is not configured
There is no Prettier config or dependency; `npx prettier` downloads defaults (double quotes) and reformats files. Don't run it -- match the existing style by hand.

### Current vs latest salary
`Employee::currentSalary` excludes future-dated records; payroll uses `salaryEffectiveOn(period_end)`. Don't use "latest record" for display.

### Payroll run overlap
A new run cannot overlap a non-rejected run. Demo data already has July-September 2026 runs.

### Project ledger employee filter needs payslip items
The employee filter reads allowance `payslip_items`, not journal lines (payroll posts allowances summed per project). Payslips created before itemised allowances have no items, so those runs never appear and the Employee dropdown can be empty. Only approved runs count.
