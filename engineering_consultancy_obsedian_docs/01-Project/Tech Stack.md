# Tech Stack

## Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **PHP** | 8.4 | Runtime |
| **Laravel** | 13.x | Framework |
| **MySQL** | 8 | Database |
| **Spatie laravel-permission** | 8.3.0 | Roles & permissions |
| **Spatie laravel-activitylog** | 5.1.1 | Audit trail |

## Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19 | UI framework |
| **TypeScript** | 5.x | Type safety |
| **Inertia.js** | v3 | SPA without API |
| **Tailwind CSS** | v4 | Styling |
| **shadcn/ui** | New York style | Component library |
| **@tanstack/react-table** | v9 | DataTable engine |
| **Sonner** | - | Toast notifications |
| **Wayfinder** | - | Type-safe route generation |

## Development Tools

| Tool | Purpose |
|------|---------|
| **Laravel Pint** | PHP code formatting |
| **PHPUnit** | Testing framework |
| **Vite** | Frontend bundling |

## Key Version Notes

- **Laravel 13** does not include `AuthorizesRequests` trait in base Controller -- must add manually
- **TanStack react-table v9** uses `createTableHook` + `createCoreRowModel` (NOT `useReactTable` + `getCoreRowModel`)
- **Inertia v3** removed Axios, `Inertia::lazy()` replaced by `Inertia::optional()`, uses `router.reload()` for partial reloading
- **Spatie activitylog 5.x** has `LogOptions` at `Spatie\Activitylog\Support\LogOptions` (NOT `Spatie\Activitylog\LogOptions`)
