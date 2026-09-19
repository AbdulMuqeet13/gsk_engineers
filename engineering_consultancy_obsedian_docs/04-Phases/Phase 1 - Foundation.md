# Phase 1 - Foundation

**Status:** Done (completed 2026-09-15)

## What Was Built

### Authentication & Authorization
- Laravel starter kit with Inertia + React (registration, login, profile, email verification)
- Spatie laravel-permission v8.3.0 integrated
- 5 roles: Super Admin, Accountant, Project Manager, HR, Viewer
- ~20 permissions across all planned modules
- `RolesAndPermissionsSeeder` seeds roles with assigned permissions
- `Gate::before()` in AppServiceProvider grants Super Admin full access
- `PermissionEnum` and `RoleEnum` string-backed enums

### Admin Layout
- shadcn/ui New York style components installed
- App layout with collapsible sidebar (`app-sidebar.tsx`)
- `NavItem` component with collapsible children for nested navigation
- Sidebar sections: Dashboard, Projects (Projects, Assignments), HR (Employees), Accounting (Chart of Accounts)
- Responsive layout with mobile support

### Base Components
- **DataTable** (`resources/js/components/data-table/data-table.tsx`)
  - Built on @tanstack/react-table v9
  - Uses `createTableHook` + `createCoreRowModel` (v9 API)
  - Reusable across all list pages
- **useDataTable hook** (`resources/js/hooks/use-data-table.ts`)
  - Partial reloading via `router.reload({ only: [...] })`
  - Search debouncing, filter state, pagination

### Activity Logging
- Spatie laravel-activitylog v5.1.1 configured
- `CausesActivity` trait on User model
- `LogsActivity` trait ready for all master data models

### Controller Base
- Added `AuthorizesRequests` trait to `app/Http/Controllers/Controller.php` (required for Laravel 13)
- `FlashesToast` trait for toast notifications via Sonner

### Wayfinder
- Type-safe route generation configured
- Import routes from `@/actions/App/Http/Controllers/...`

## Files Created/Modified

| Category | Files |
|----------|-------|
| Enums | `PermissionEnum.php`, `RoleEnum.php` |
| Seeders | `RolesAndPermissionsSeeder.php`, `DatabaseSeeder.php` |
| Traits | `FlashesToast.php` |
| Controller | `Controller.php` (modified) |
| Components | `app-sidebar.tsx`, `data-table.tsx`, `use-data-table.ts` |
| Config | `activitylog.php`, Spatie permission config |
