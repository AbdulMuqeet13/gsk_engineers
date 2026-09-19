<?php

namespace Database\Factories;

use App\Enums\JournalEntryStatus;
use App\Enums\JournalEntryType;
use App\Models\AccountHead;
use App\Models\JournalEntry;
use App\Models\JournalLine;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JournalEntry>
 */
class JournalEntryFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => fake()->date(),
            'reference' => 'JE-'.fake()->unique()->numerify('######'),
            'description' => fake()->sentence(),
            'type' => JournalEntryType::Standard,
            'status' => JournalEntryStatus::Draft,
            'created_by' => User::factory(),
        ];
    }

    public function draft(): static
    {
        return $this->state(['status' => JournalEntryStatus::Draft]);
    }

    public function posted(): static
    {
        return $this->state(['status' => JournalEntryStatus::Posted]);
    }

    public function standard(): static
    {
        return $this->state(['type' => JournalEntryType::Standard]);
    }

    public function simple(): static
    {
        return $this->state(['type' => JournalEntryType::Simple]);
    }

    public function payroll(): static
    {
        return $this->state(['type' => JournalEntryType::Payroll]);
    }

    public function transfer(): static
    {
        return $this->state(['type' => JournalEntryType::Transfer]);
    }

    public function opening(): static
    {
        return $this->state(['type' => JournalEntryType::Opening]);
    }

    public function withBalancedLines(
        AccountHead $debitAccount,
        AccountHead $creditAccount,
        string $amount = '1000.00',
        ?int $projectId = null,
    ): static {
        return $this->afterCreating(function (JournalEntry $entry) use ($debitAccount, $creditAccount, $amount, $projectId) {
            JournalLine::factory()->create([
                'journal_entry_id' => $entry->id,
                'account_head_id' => $debitAccount->id,
                'project_id' => $projectId,
                'debit' => $amount,
                'credit' => '0.00',
            ]);
            JournalLine::factory()->create([
                'journal_entry_id' => $entry->id,
                'account_head_id' => $creditAccount->id,
                'project_id' => $projectId,
                'debit' => '0.00',
                'credit' => $amount,
            ]);
        });
    }
}
