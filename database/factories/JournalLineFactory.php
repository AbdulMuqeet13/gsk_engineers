<?php

namespace Database\Factories;

use App\Models\AccountHead;
use App\Models\JournalEntry;
use App\Models\JournalLine;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JournalLine>
 */
class JournalLineFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $isDebit = fake()->boolean();
        $amount = fake()->randomFloat(2, 100, 100000);

        return [
            'journal_entry_id' => JournalEntry::factory(),
            'account_head_id' => AccountHead::factory(),
            'project_id' => null,
            'debit' => $isDebit ? number_format($amount, 2, '.', '') : '0.00',
            'credit' => $isDebit ? '0.00' : number_format($amount, 2, '.', ''),
            'memo' => fake()->optional()->sentence(),
        ];
    }

    public function debit(string $amount): static
    {
        return $this->state([
            'debit' => $amount,
            'credit' => '0.00',
        ]);
    }

    public function credit(string $amount): static
    {
        return $this->state([
            'debit' => '0.00',
            'credit' => $amount,
        ]);
    }

    public function forProject(Project $project): static
    {
        return $this->state(['project_id' => $project->id]);
    }
}
