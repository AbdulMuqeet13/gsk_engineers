# Page Component Rules

## Breadcrumbs
- Set breadcrumbs via the `.layout` static property on page components:
```typescript
PageComponent.layout = {
    breadcrumbs: [
        { title: 'Projects', href: '/projects' },
        { title: 'Create', href: '/projects/create' },
    ],
};
```

## List Pages
- All list pages use the `DataTable` component with server-driven pagination, sorting, and filtering
- Server returns data using the `PaginatedResponse<T>` shape: `{ data: T[], meta: { current_page, last_page, per_page, total, from, to } }`
- The paginated data prop is named after the resource (e.g., `projects`, `employees`, `journalEntries`)
- Companion props `filters` and `sort` carry the current filter/sort state for the DataTable

## Create/Edit
- Use **Dialogs** for create and edit forms — do not navigate to separate pages
- Dialog state is managed with React `useState` in the list page component
- Form submission uses Inertia `useForm` hook or `<Form>` component
- On success, the dialog closes and the list refreshes via partial reload

## Page Structure
```
resources/js/pages/
  projects/
    index.tsx          # List page with DataTable
    show.tsx           # Detail/view page (when needed)
  employees/
    index.tsx
    show.tsx
  accounting/
    chart-of-accounts/
      index.tsx
    journal-entries/
      index.tsx
      show.tsx
```
