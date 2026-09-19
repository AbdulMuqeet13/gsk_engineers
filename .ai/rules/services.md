# Services Pattern

## Structure
- Services live in `app/Services/` (e.g., `JournalService`, `PayrollService`, `TransferService`)
- Services are classes with multiple related methods, not single-use invokables

## Rules
- Services are **constructor-injected** into Actions or Controllers, never instantiated with `app()` or `resolve()`
- Every multi-write operation MUST be wrapped in `DB::transaction()`
- Services enforce **business invariants** (e.g., debits == credits, posted entries immutable)
- Services must not return HTTP responses — return models, DTOs, or throw domain exceptions
- Services must not access `Request` objects — receive typed parameters instead
- Financial services (JournalService, TransferService, PayrollService) must never allow direct edits to posted journal entries — only reversals

## Example
```php
class JournalService
{
    public function post(JournalEntry $entry): void
    {
        DB::transaction(function () use ($entry) {
            $this->validateBalance($entry);
            $entry->update(['status' => JournalEntryStatus::Posted]);
        });
    }

    private function validateBalance(JournalEntry $entry): void
    {
        $debits = $entry->lines->sum('debit');
        $credits = $entry->lines->sum('credit');

        if (bccomp($debits, $credits, 2) !== 0) {
            throw new UnbalancedEntryException($debits, $credits);
        }
    }
}
```
