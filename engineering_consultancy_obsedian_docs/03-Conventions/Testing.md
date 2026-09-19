# Testing Conventions

## Framework

- **PHPUnit** (not Pest)
- Create tests with: `php artisan make:test --phpunit {TestName}`
- Do NOT include `Feature/` in the name -- it's auto-placed

## Test Structure

```php
class EmployeeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();
    }

    public function test_index_requires_authentication(): void { ... }
    public function test_index_requires_view_permission(): void { ... }
    public function test_index_displays_employees(): void { ... }
    public function test_store_creates_employee(): void { ... }
}
```

## Key Patterns

### Always Include
- `use RefreshDatabase;` for database cleanup
- `$this->seed(RolesAndPermissionsSeeder::class)` in setUp for permission tests
- `$this->withoutVite()` to avoid Vite manifest errors

### Authentication Tests
```php
public function test_index_requires_authentication(): void
{
    $this->get(route('employees.index'))
        ->assertRedirect(route('login'));
}
```

### Authorization Tests
```php
public function test_index_requires_view_permission(): void
{
    $user = User::factory()->create();
    $this->actingAs($user)
        ->get(route('employees.index'))
        ->assertForbidden();
}
```

### CRUD Tests
- Use factories with states: `Employee::factory()->internal()->create()`
- Assert database state: `$this->assertDatabaseHas(...)`, `$this->assertSoftDeleted(...)`
- Assert Inertia responses: `$response->assertInertia(fn ($page) => $page->component('...')->has('...'))`
- Assert validation: `->assertSessionHasErrors('field')`

### Running Tests
```bash
# All tests
php artisan test --compact

# Specific file
php artisan test tests/Feature/EmployeeTest.php

# Specific test
php artisan test --filter=test_store_creates_employee
```

## Test Count (as of Phase 4)

| Test File | Type | Tests |
|-----------|------|-------|
| AccountHeadTest | Feature | 9 |
| ProjectTest | Feature | 9 |
| EmployeeTest | Feature | 10 |
| ProjectAssignmentTest | Feature | 8 |
| ChartOfAccountsSeederTest | Feature | 6 |
| JournalEntryTest | Feature | 15 |
| GeneralLedgerTest | Feature | 8 |
| TrialBalanceTest | Feature | 7 |
| ExpenseTest | Feature | 20 |
| JournalServiceTest | Unit | 13 |
| ExpenseServiceTest | Unit | 16 |
| Auth/Registration/Profile tests | Feature | ~45 |
| **Total** | | **166 tests, 662 assertions** |

## Gotcha: SuperAdmin Gate Bypass

`Gate::before()` in `AppServiceProvider` returns `true` for Super Admin, bypassing all policy checks. When testing that a policy denies access (e.g. editing a non-draft expense), use a **non-SuperAdmin role** (Accountant, Viewer, etc.) that has the base permission but should be denied by the policy's extra condition.
