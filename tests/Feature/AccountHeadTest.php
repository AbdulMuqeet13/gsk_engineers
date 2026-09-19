<?php

namespace Tests\Feature;

use App\Enums\AccountType;
use App\Enums\NormalBalance;
use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountHeadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();
    }

    public function test_index_requires_authentication(): void
    {
        $this->get(route('account-heads.index'))
            ->assertRedirect(route('login'));
    }

    public function test_index_requires_view_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('account-heads.index'))
            ->assertForbidden();
    }

    public function test_index_displays_account_heads(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        AccountHead::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('account-heads.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('accounting/chart-of-accounts/index')
            ->has('accountHeads.data', 3)
        );
    }

    public function test_store_creates_account_head(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $data = [
            'code' => '6000',
            'name' => 'Test Account',
            'type' => AccountType::Asset->value,
            'normal_balance' => NormalBalance::Debit->value,
            'is_active' => true,
        ];

        $this->actingAs($user)
            ->post(route('account-heads.store'), $data)
            ->assertRedirect(route('account-heads.index'));

        $this->assertDatabaseHas('account_heads', [
            'code' => '6000',
            'name' => 'Test Account',
            'type' => 'asset',
            'normal_balance' => 'debit',
        ]);
    }

    public function test_store_requires_manage_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $data = [
            'code' => '6000',
            'name' => 'Test Account',
            'type' => AccountType::Asset->value,
            'normal_balance' => NormalBalance::Debit->value,
        ];

        $this->actingAs($user)
            ->post(route('account-heads.store'), $data)
            ->assertForbidden();
    }

    public function test_store_validates_unique_code(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        AccountHead::factory()->create(['code' => '1000']);

        $this->actingAs($user)
            ->post(route('account-heads.store'), [
                'code' => '1000',
                'name' => 'Duplicate',
                'type' => AccountType::Asset->value,
                'normal_balance' => NormalBalance::Debit->value,
            ])
            ->assertSessionHasErrors('code');
    }

    public function test_update_modifies_account_head(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $account = AccountHead::factory()->create();

        $this->actingAs($user)
            ->put(route('account-heads.update', $account), [
                'code' => $account->code,
                'name' => 'Updated Name',
                'type' => $account->type->value,
                'normal_balance' => $account->normal_balance->value,
            ])
            ->assertRedirect(route('account-heads.index'));

        $this->assertDatabaseHas('account_heads', [
            'id' => $account->id,
            'name' => 'Updated Name',
        ]);
    }

    public function test_destroy_soft_deletes_account_head(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $account = AccountHead::factory()->create();

        $this->actingAs($user)
            ->delete(route('account-heads.destroy', $account))
            ->assertRedirect(route('account-heads.index'));

        $this->assertSoftDeleted('account_heads', ['id' => $account->id]);
    }

    public function test_store_with_parent_account(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        $parent = AccountHead::factory()->asset()->create(['code' => '1000']);

        $this->actingAs($user)
            ->post(route('account-heads.store'), [
                'code' => '1001',
                'name' => 'Child Account',
                'type' => AccountType::Asset->value,
                'normal_balance' => NormalBalance::Debit->value,
                'parent_id' => $parent->id,
            ])
            ->assertRedirect(route('account-heads.index'));

        $this->assertDatabaseHas('account_heads', [
            'code' => '1001',
            'parent_id' => $parent->id,
        ]);
    }
}
