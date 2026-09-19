# Code Style

## PHP

### Formatting
- **Laravel Pint** enforces code style
- Run after any PHP changes: `vendor/bin/pint --dirty --format agent`
- Full format: `vendor/bin/pint --format agent`

### Rules
- Always use curly braces for control structures, even single-line bodies
- PHP 8 constructor property promotion: `public function __construct(public GitHub $github) {}`
- Explicit return types and type hints on all methods
- TitleCase for Enum keys: `FavoritePerson`, `Monthly`
- Prefer PHPDoc blocks over inline comments
- Array shape type definitions in PHPDoc blocks

### Model Conventions
- Use `#[Fillable([...])]` attribute (not `$fillable` property)
- Use `casts()` method (not `$casts` property)
- PHPDoc `@property` annotations for all columns and relationships
- Template types on relationships: `@return BelongsTo<Project, $this>`
- `LogsActivity` trait with `getActivitylogOptions()` on all models

## TypeScript

### Formatting
- Follows project ESLint/Prettier config
- `npm run build` must pass with no errors

### Rules
- Strict types -- no `any`
- Enum types as string unions (not TS enums)
- Every component in its own file
- Props interfaces defined at top of component file
- Named exports for components, default export for pages

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| PHP Class | TitleCase | `CreateEmployee.php` |
| PHP Enum | TitleCase | `EmployeeType.php` |
| Migration | snake_case with timestamp | `2026_09_15_122744_create_employees_table.php` |
| React Component | kebab-case | `create-employee-dialog.tsx` |
| React Page | kebab-case in folders | `pages/employees/index.tsx` |
| TypeScript types | kebab-case | `models.ts` |
