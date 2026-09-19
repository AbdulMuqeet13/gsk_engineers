# Actions Pattern

## Structure
- Actions live in `app/Actions/{Domain}/` (e.g., `app/Actions/Accounting/PostJournalEntryAction`)
- Each action is a single-responsibility class with one public method: `execute()` or `__invoke()`

## Rules
- Actions receive **validated data** (from Form Requests or DTOs), never raw `Request` objects
- Actions are injected into controllers via **method injection**, not constructed manually
- Simple single-write operations stay in the Action; complex multi-step logic delegates to a Service
- Actions must not call other Actions directly — compose through Services if orchestration is needed
- Actions must not contain authorization logic — that belongs in Form Requests or Policies
- Return the created/updated model or a result DTO, never an HTTP response

## Example
```php
class CreateProjectAction
{
    public function execute(array $data): Project
    {
        return Project::create($data);
    }
}
```

## Controller Usage
```php
public function store(StoreProjectRequest $request, CreateProjectAction $action): RedirectResponse
{
    $action->execute($request->validated());
    return redirect()->route('projects.index');
}
```
