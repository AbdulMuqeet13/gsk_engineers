<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\EmployeeSalaryComponent;
use App\Models\SalaryComponent;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SalaryComponentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();
    }

    private function hrUser(): User
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::Hr);

        return $user;
    }

    public function test_index_lists_default_components(): void
    {
        $this->actingAs($this->hrUser())
            ->get(route('salary-components.index'))
            ->assertInertia(fn ($page) => $page
                ->component('payroll/salary-components/index')
                ->has('salaryComponents', 4)
                ->where('salaryComponents.0.name', 'Basic Salary')
            );
    }

    public function test_store_creates_component(): void
    {
        $this->actingAs($this->hrUser())
            ->post(route('salary-components.store'), ['name' => 'Utility Allowance', 'sort_order' => 5, 'is_active' => true])
            ->assertRedirect(route('salary-components.index'));

        $this->assertDatabaseHas('salary_components', ['name' => 'Utility Allowance', 'sort_order' => 5]);
    }

    public function test_store_rejects_duplicate_name(): void
    {
        $this->actingAs($this->hrUser())
            ->post(route('salary-components.store'), ['name' => 'House Rent', 'sort_order' => 5])
            ->assertSessionHasErrors('name');
    }

    public function test_update_can_deactivate_component(): void
    {
        $component = SalaryComponent::factory()->create();

        $this->actingAs($this->hrUser())
            ->put(route('salary-components.update', $component), ['name' => $component->name, 'sort_order' => 3, 'is_active' => false])
            ->assertRedirect(route('salary-components.index'));

        $this->assertFalse($component->fresh()->is_active);
    }

    public function test_deleting_used_component_keeps_existing_salary_amounts(): void
    {
        $line = EmployeeSalaryComponent::factory()->create(['amount' => '12000.00']);
        $component = $line->salaryComponent;

        $this->actingAs($this->hrUser())
            ->delete(route('salary-components.destroy', $component))
            ->assertRedirect(route('salary-components.index'));

        $this->assertSoftDeleted($component);
        $this->assertSame($component->name, $line->fresh()->salaryComponent->name);
    }

    public function test_viewer_cannot_create_component(): void
    {
        $viewer = User::factory()->create();
        $viewer->assignRole(RoleEnum::Viewer);

        $this->actingAs($viewer)
            ->post(route('salary-components.store'), ['name' => 'Bonus', 'sort_order' => 5])
            ->assertForbidden();
    }
}
