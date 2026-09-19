# Frontend Component Rules

## File Structure
- Every React component MUST live in its own file — **never define sub-components inside a parent component file**
- File name uses kebab-case matching the component name (e.g., `DataTablePagination` → `data-table-pagination.tsx`)
- Shared/reusable components go in `resources/js/components/`
- Page-specific components go in `resources/js/components/{domain}/` (e.g., `resources/js/components/projects/`)
- UI primitives (shadcn) live in `resources/js/components/ui/`

## Dialog-First UI
- **Prefer Dialog** for create and edit forms over navigating to a separate page
- Use `Dialog` from `@/components/ui/dialog` for modal forms
- Only use full-page forms for complex multi-step workflows
- Confirmation dialogs for all destructive actions (delete, reverse, etc.)

## Component Guidelines
- Use shadcn/ui components as building blocks — do not create custom UI primitives that duplicate shadcn
- Use the `cn()` utility from `@/lib/utils` for className merging
- Props interfaces should be explicitly typed, not `any`
- Use `React.ComponentProps<>` for extending native HTML element props
- Import icons from `lucide-react`

## State Management
- Use Inertia's `usePage().props` for server-provided state
- Use React `useState` for local UI state (dialog open, dropdown open)
- Use custom hooks in `resources/js/hooks/` for reusable stateful logic
- Never use global state libraries — Inertia handles server state, React handles UI state
