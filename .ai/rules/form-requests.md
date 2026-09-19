# Form Request Rules

## Usage
- Every controller method that writes data (store, update, destroy) MUST use a dedicated Form Request
- Form Requests live in `app/Http/Requests/{Domain}/` (e.g., `app/Http/Requests/Projects/StoreProjectRequest`)

## Authorization
- Use the `authorize()` method for permission checks: `return $this->user()->can('permission-name');`
- Never duplicate authorization logic in controllers when a Form Request handles it

## Reusable Rules
- Reusable validation rule sets go in `app/Concerns/` as traits (existing pattern: `ProfileValidationRules`, `PasswordValidationRules`)
- Traits provide methods that return rule arrays, not the rules themselves
- Compose rules from traits in the Form Request's `rules()` method

## Conventions
- Name Form Requests with the HTTP verb prefix: `Store{Model}Request`, `Update{Model}Request`, `Delete{Model}Request`
- Use `Rule::enum()` for enum columns
- Use `Rule::unique()->ignore()` for update requests
- Use explicit type hints for all rule values — avoid magic strings where Laravel provides rule objects

## Example
```php
class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('projects.create');
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:projects,code'],
            'status' => ['required', Rule::enum(ProjectStatus::class)],
            'budget' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
```
