# Inertia.js Rules

## Partial Reloading (CRITICAL)
- For filters, search, sort, and pagination on the **same page**, ALWAYS use `router.reload({ only: ['propName'], data: { ...params } })`
- **NEVER** use `router.get()` or `router.visit()` to the same route for filter/sort/pagination changes
- This ensures only the specified props are re-fetched from the server, not the entire page

## Example — Correct
```typescript
router.reload({
    only: ['projects', 'filters'],
    data: { search: query, sort: column, direction: dir, page: 1 },
})
```

## Example — WRONG (never do this)
```typescript
// DO NOT DO THIS for same-page filtering
router.get(route('projects.index'), { search: query })
router.visit(window.location.pathname, { data: { search: query } })
```

## Props
- Use `Inertia::optional()` for props that are only needed on partial reloads (replaces removed `Inertia::lazy()`)
- Use `Inertia::defer()` for props that load after initial page render — always pair with skeleton loading states
- Use `Inertia::merge()` for props that should merge with existing data (infinite scroll)

## Routes
- Use Wayfinder-generated route functions from `@/routes/` or `@/actions/` — never hardcode URL strings
- Import routes like: `import { index } from '@/routes/projects'`
- For routes that don't exist yet (future modules), use string placeholders temporarily and mark with `// TODO: replace with Wayfinder route`

## Forms
- Use Inertia's `<Form>` component or `useForm` hook for form submissions
- Never use native `fetch()` or `axios` for form submissions that should trigger Inertia page visits
- Use `useHttp` hook only for standalone JSON API calls that don't need Inertia page visits

## Flash Messages
- Controllers flash toasts via `session()->flash('toast', ['type' => 'success', 'message' => '...'])`
- The `HandleInertiaRequests` middleware shares flash data automatically
- The `useFlashToast` hook in the app layout consumes and displays toasts via Sonner

## Page Components
- Set breadcrumbs via the `.layout` static property on page components
- All list pages use the `DataTable` component with server-driven pagination/sort/filter
