<?php

namespace Tests\Feature;

use App\Enums\ProjectStatus;
use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\Expense;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpenseTest extends TestCase
{
    use RefreshDatabase;

    private AccountHead $expenseAccount;

    private AccountHead $cashAccount;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();

        $this->expenseAccount = AccountHead::factory()->expense()->create(['code' => '5001', 'name' => 'Fuel']);
        $this->cashAccount = AccountHead::factory()->asset()->create(['code' => '1001', 'name' => 'Cash']);
        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);
    }

    public function test_index_requires_authentication(): void
    {
        $this->get(route('expenses.index'))
            ->assertRedirect(route('login'));
    }

    public function test_index_requires_view_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('expenses.index'))
            ->assertForbidden();
    }

    public function test_index_displays_expenses(): void
    {
        Expense::factory()->count(3)->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $response = $this->actingAs($this->user)->get(route('expenses.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('expenses/index')
            ->has('expenses.data', 3)
        );
    }

    public function test_index_filters_by_status(): void
    {
        Expense::factory()->draft()->count(2)->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);
        Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('expenses.index', ['status' => 'draft']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('expenses.data', 2)
        );
    }

    public function test_index_filters_by_project(): void
    {
        $project = Project::factory()->active()->create();

        Expense::factory()->forProject($project)->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);
        Expense::factory()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('expenses.index', ['project_id' => $project->id]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('expenses.data', 1)
        );
    }

    public function test_index_filters_by_date_range(): void
    {
        Expense::factory()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'date' => '2026-01-10',
        ]);
        Expense::factory()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'date' => '2026-03-15',
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('expenses.index', [
                'date_from' => '2026-03-01',
                'date_to' => '2026-03-31',
            ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('expenses.data', 1)
        );
    }

    public function test_store_creates_draft_expense(): void
    {
        $data = [
            'date' => '2026-01-15',
            'description' => 'Fuel for site visit',
            'amount' => '5000.00',
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'project_id' => null,
            'notes' => null,
        ];

        $this->actingAs($this->user)
            ->post(route('expenses.store'), $data)
            ->assertRedirect(route('expenses.index'));

        $this->assertDatabaseHas('expenses', [
            'description' => 'Fuel for site visit',
            'status' => 'draft',
        ]);
    }

    public function test_store_requires_create_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $data = [
            'date' => '2026-01-15',
            'description' => 'Test',
            'amount' => '100.00',
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'project_id' => null,
            'notes' => null,
        ];

        $this->actingAs($user)
            ->post(route('expenses.store'), $data)
            ->assertForbidden();
    }

    public function test_store_validates_required_fields(): void
    {
        $this->actingAs($this->user)
            ->post(route('expenses.store'), [])
            ->assertSessionHasErrors(['date', 'description', 'amount', 'account_head_id', 'payment_account_id']);
    }

    public function test_store_validates_expense_account_type(): void
    {
        $liabilityAccount = AccountHead::factory()->create([
            'type' => 'liability',
            'normal_balance' => 'credit',
        ]);

        $data = [
            'date' => '2026-01-15',
            'description' => 'Test',
            'amount' => '100.00',
            'account_head_id' => $liabilityAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'project_id' => null,
            'notes' => null,
        ];

        $this->actingAs($this->user)
            ->post(route('expenses.store'), $data)
            ->assertSessionHasErrors('account_head_id');
    }

    public function test_store_validates_positive_amount(): void
    {
        $data = [
            'date' => '2026-01-15',
            'description' => 'Test',
            'amount' => '0.00',
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'project_id' => null,
            'notes' => null,
        ];

        $this->actingAs($this->user)
            ->post(route('expenses.store'), $data)
            ->assertSessionHasErrors('amount');
    }

    public function test_update_modifies_draft_expense(): void
    {
        $expense = Expense::factory()->draft()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $data = [
            'date' => '2026-02-01',
            'description' => 'Updated description',
            'amount' => '7500.00',
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'project_id' => null,
            'notes' => null,
        ];

        $this->actingAs($this->user)
            ->put(route('expenses.update', $expense), $data)
            ->assertRedirect(route('expenses.index'));

        $this->assertDatabaseHas('expenses', [
            'id' => $expense->id,
            'description' => 'Updated description',
        ]);
    }

    public function test_update_rejects_non_draft(): void
    {
        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $data = [
            'date' => '2026-02-01',
            'description' => 'Should not update',
            'amount' => '100.00',
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'project_id' => null,
            'notes' => null,
        ];

        $this->actingAs($this->user)
            ->put(route('expenses.update', $expense), $data)
            ->assertForbidden();
    }

    public function test_destroy_deletes_draft(): void
    {
        $expense = Expense::factory()->draft()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->actingAs($this->user)
            ->delete(route('expenses.destroy', $expense))
            ->assertRedirect(route('expenses.index'));

        $this->assertDatabaseMissing('expenses', ['id' => $expense->id]);
    }

    public function test_destroy_rejects_non_draft(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Accountant);

        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $user->id,
        ]);

        $this->actingAs($user)
            ->delete(route('expenses.destroy', $expense))
            ->assertForbidden();
    }

    public function test_submit_transitions_to_submitted(): void
    {
        $expense = Expense::factory()->draft()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'created_by' => $this->user->id,
        ]);

        $this->actingAs($this->user)
            ->post(route('expenses.submit', $expense))
            ->assertRedirect(route('expenses.index'));

        $expense->refresh();
        $this->assertTrue($expense->isSubmitted());
    }

    public function test_approve_creates_posted_journal_entry(): void
    {
        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'amount' => '5000.00',
        ]);

        $this->actingAs($this->user)
            ->post(route('expenses.approve', $expense))
            ->assertRedirect(route('expenses.index'));

        $expense->refresh();
        $this->assertTrue($expense->isApproved());
        $this->assertNotNull($expense->journal_entry_id);
        $this->assertTrue($expense->journalEntry->isPosted());
    }

    public function test_approve_requires_approve_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $this->actingAs($user)
            ->post(route('expenses.approve', $expense))
            ->assertForbidden();
    }

    public function test_reject_requires_reason(): void
    {
        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $this->actingAs($this->user)
            ->post(route('expenses.reject', $expense), [])
            ->assertSessionHasErrors('reason');
    }

    public function test_reject_requires_approve_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Viewer);

        $expense = Expense::factory()->submitted()->create([
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
        ]);

        $this->actingAs($user)
            ->post(route('expenses.reject', $expense), ['reason' => 'Invalid'])
            ->assertForbidden();
    }

    public function test_store_rejects_completed_project(): void
    {
        $project = Project::factory()->create(['status' => ProjectStatus::Completed]);

        $data = [
            'date' => '2026-01-15',
            'description' => 'Should not work',
            'amount' => '1000.00',
            'account_head_id' => $this->expenseAccount->id,
            'payment_account_id' => $this->cashAccount->id,
            'project_id' => $project->id,
            'notes' => null,
        ];

        $this->actingAs($this->user)
            ->post(route('expenses.store'), $data)
            ->assertSessionHasErrors('project_id');
    }
}
