# Enum Conventions

## PHP Enums
- Use **string-backed** PHP enums for all `type` and `status` database columns
- Enum keys use **TitleCase** (e.g., `SuperAdmin`, `ProjectManager`, `Draft`, `Posted`)
- Store the enum **string value** in the database, not integers
- Cast in Eloquent models using Laravel's built-in enum cast: `'status' => StatusEnum::class`

## Structure
- All enums live in `app/Enums/`
- Group related enums by domain when they share a prefix (e.g., `JournalEntryStatus`, `JournalEntryType`)
- Add a static `values()` helper that returns all enum values as a string array — useful for seeders and validation rules

## Example
```php
enum JournalEntryStatus: string
{
    case Draft = 'draft';
    case Posted = 'posted';

    /** @return string[] */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
```

## TypeScript Mirroring
- Mirror PHP enums as TypeScript union types in `resources/js/types/`
- Example: `type JournalEntryStatus = 'draft' | 'posted'`

## Validation
- Use `Rule::enum(StatusEnum::class)` in Form Request validation rules
