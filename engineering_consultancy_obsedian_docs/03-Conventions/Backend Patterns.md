# Backend Patterns

## Action Pattern

Single-responsibility classes for write operations. Located in `app/Actions/{Domain}/`.

### Structure
```php
class CreateEmployee
{
    public function handle(array $data): Employee
    {
        return Employee::create($data);
    }
}
```

### Usage in Controller (method injection)
```php
public function store(StoreEmployeeRequest $request, CreateEmployee $action): RedirectResponse
{
    $action->handle($request->validated());
    $this->toast('Employee created.');
    return to_route('employees.index');
}
```

### Naming Convention
- `Create{Model}`, `Update{Model}`, `Delete{Model}`
- Located in `app/Actions/{Domain}/`
- Domain matches the model's plural name: `AccountHeads`, `Projects`, `Employees`, `ProjectAssignments`

## Service Pattern (Phase 3+)

For multi-step business logic that crosses model boundaries.

```php
class JournalService
{
    public function post(JournalEntry $entry): void
    {
        DB::transaction(function () use ($entry) {
            // Enforce: sum(debit) == sum(credit)
            // Enforce: at least 2 lines
            // Set status to posted
        });
    }
}
```

- Wrap every multi-write operation in `DB::transaction`
- Services enforce accounting rules -- controllers never write journal lines directly
- Located in `app/Services/`

## Form Request Pattern

Domain-organized validation and authorization.

### Structure
```php
// app/Http/Requests/Employees/StoreEmployeeRequest.php
class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('employees.create');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'unique:employees,email'],
            'type' => ['required', Rule::enum(EmployeeType::class)],
        ];
    }
}
```

### Key Rules
- `authorize()` uses Spatie permission strings
- Update requests use `Rule::unique()->ignore($this->route('model'))` for unique fields
- Conditional validation: `required_if`, `prohibited_if` for type-dependent fields
- Enum validation: `Rule::enum(EnumClass::class)`

## Policy Pattern

Standard Laravel policies with Spatie permissions.

```php
class EmployeePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::EmployeesView);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::EmployeesCreate);
    }
}
```

- Super Admin bypasses all policies via `Gate::before()` in AppServiceProvider
- Policies auto-discovered by Laravel (no manual registration needed)

## Controller Pattern

```php
class EmployeeController extends Controller
{
    use FlashesToast;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Employee::class);

        $employees = Employee::query()
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->with('project:id,name,code')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'employeeTypes' => EmployeeType::values(),
            'projects' => Inertia::optional(fn () => Project::select('id', 'name')->get()),
        ]);
    }
}
```

### Key Patterns
- `$this->authorize()` for policy checks (requires `AuthorizesRequests` trait on base Controller)
- `FlashesToast` trait for toast notifications via Sonner
- `Inertia::optional()` for data needed only on first load (select/filter options)
- `->withQueryString()` to preserve filters in pagination links
- Search via `when()` with `like` queries
- Always `with()` for eager loading relationships (select specific columns)

## Enum Pattern

```php
enum EmployeeType: string
{
    case Internal = 'internal';
    case Project = 'project';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
```

- String-backed with **TitleCase** keys
- `values()` static helper returns array of string values
- Used in model casts, Form Request validation (`Rule::enum`), and as Inertia props
