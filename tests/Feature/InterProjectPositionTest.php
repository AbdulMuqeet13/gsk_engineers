<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\Project;
use App\Models\User;
use App\Services\TransferService;
use Database\Seeders\ChartOfAccountsSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InterProjectPositionTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Project $projectA;

    private Project $projectB;

    private AccountHead $cashAccount;

    private TransferService $transferService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->seed(ChartOfAccountsSeeder::class);
        $this->withoutVite();

        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);
        $this->projectA = Project::factory()->create();
        $this->projectB = Project::factory()->create();
        $this->cashAccount = AccountHead::where('code', '1001')->first();
        $this->transferService = app(TransferService::class);
    }

    public function test_position_requires_authentication(): void
    {
        $this->get(route('reports.inter-project-position'))
            ->assertRedirect(route('login'));
    }

    public function test_position_requires_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('reports.inter-project-position'))
            ->assertForbidden();
    }

    public function test_position_shows_net_balances(): void
    {
        $this->transferService->execute([
            'from_project_id' => $this->projectA->id,
            'to_project_id' => $this->projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'amount' => '50000.00',
            'date' => '2026-09-16',
            'purpose' => 'A to B',
        ], $this->user);

        $this->transferService->execute([
            'from_project_id' => $this->projectB->id,
            'to_project_id' => $this->projectA->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'amount' => '20000.00',
            'date' => '2026-09-16',
            'purpose' => 'B to A',
        ], $this->user);

        $response = $this->actingAs($this->user)
            ->get(route('reports.inter-project-position'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('reports/inter-project-position')
            ->has('positions', 1)
        );
    }

    public function test_position_excludes_reversed_transfers(): void
    {
        $transfer = $this->transferService->execute([
            'from_project_id' => $this->projectA->id,
            'to_project_id' => $this->projectB->id,
            'from_account_id' => $this->cashAccount->id,
            'to_account_id' => $this->cashAccount->id,
            'amount' => '50000.00',
            'date' => '2026-09-16',
            'purpose' => 'Will be reversed',
        ], $this->user);

        $this->transferService->reverse($transfer, $this->user, 'Mistake');

        $response = $this->actingAs($this->user)
            ->get(route('reports.inter-project-position'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('positions', 0)
        );
    }
}
