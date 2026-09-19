<?php

namespace Tests\Feature;

use App\Enums\AccountType;
use App\Enums\NormalBalance;
use App\Models\AccountHead;
use Database\Seeders\ChartOfAccountsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChartOfAccountsSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_creates_all_accounts(): void
    {
        $this->seed(ChartOfAccountsSeeder::class);

        $this->assertDatabaseCount('account_heads', 20);
    }

    public function test_seeder_is_idempotent(): void
    {
        $this->seed(ChartOfAccountsSeeder::class);
        $this->seed(ChartOfAccountsSeeder::class);

        $this->assertDatabaseCount('account_heads', 20);
    }

    public function test_seeder_creates_correct_hierarchy(): void
    {
        $this->seed(ChartOfAccountsSeeder::class);

        $assets = AccountHead::where('code', '1000')->first();
        $cash = AccountHead::where('code', '1001')->first();

        $this->assertNull($assets->parent_id);
        $this->assertEquals($assets->id, $cash->parent_id);
    }

    public function test_seeder_sets_correct_normal_balances(): void
    {
        $this->seed(ChartOfAccountsSeeder::class);

        $asset = AccountHead::where('code', '1000')->first();
        $this->assertEquals(NormalBalance::Debit, $asset->normal_balance);

        $expense = AccountHead::where('code', '5000')->first();
        $this->assertEquals(NormalBalance::Debit, $expense->normal_balance);

        $liability = AccountHead::where('code', '2000')->first();
        $this->assertEquals(NormalBalance::Credit, $liability->normal_balance);

        $equity = AccountHead::where('code', '3000')->first();
        $this->assertEquals(NormalBalance::Credit, $equity->normal_balance);

        $income = AccountHead::where('code', '4000')->first();
        $this->assertEquals(NormalBalance::Credit, $income->normal_balance);
    }

    public function test_seeder_creates_correct_account_types(): void
    {
        $this->seed(ChartOfAccountsSeeder::class);

        $this->assertEquals(6, AccountHead::where('type', AccountType::Asset)->count());
        $this->assertEquals(3, AccountHead::where('type', AccountType::Liability)->count());
        $this->assertEquals(3, AccountHead::where('type', AccountType::Equity)->count());
        $this->assertEquals(2, AccountHead::where('type', AccountType::Income)->count());
        $this->assertEquals(6, AccountHead::where('type', AccountType::Expense)->count());
    }

    public function test_all_seeded_accounts_are_active(): void
    {
        $this->seed(ChartOfAccountsSeeder::class);

        $this->assertEquals(20, AccountHead::where('is_active', true)->count());
    }
}
