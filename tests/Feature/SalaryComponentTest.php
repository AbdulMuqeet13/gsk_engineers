<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Enums\SalaryComponentType;
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
            ->post(route('salary-components.store'), ['name' => 'Mess Charges', 'type' => 'deduction', 'sort_order' => 5, 'is_active' => true])
            ->assertRedirect(route('salary-components.index'));

        $this->assertDatabaseHas('salary_components', ['name' => 'Mess Charges', 'type' => 'deduction', 'sort_order' => 5]);
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
            ->put(route('salary-components.update', $component), ['name' => $component->name, 'type' => 'earning', 'sort_order' => 3, 'is_active' => false])
            ->assertRedirect(route('salary-components.index'));

        $this->assertFalse($component->fresh()->is_active);
    }

    public function test_update_rejects_type_change_for_component_used_by_salary_records(): void
    {
        $line = EmployeeSalaryComponent::factory()->create();
        $component = $line->salaryComponent;

        $response = $this->actingAs($this->hrUser())
            ->put(route('salary-components.update', $component), ['name' => $component->name, 'type' => 'deduction', 'sort_order' => 3]);

        $response->assertSessionHasErrors(['type' => 'The type cannot be changed because salary records already use this component.']);
        $this->assertSame(SalaryComponentType::Earning, $component->fresh()->type);
    }

    public function test_store_rejects_missing_or_unknown_type(): void
    {
        $this->actingAs($this->hrUser())
            ->post(route('salary-components.store'), ['name' => 'Bonus', 'sort_order' => 5])
            ->assertSessionHasErrors('type');

        $this->actingAs($this->hrUser())
            ->post(route('salary-components.store'), ['name' => 'Bonus', 'type' => 'loan', 'sort_order' => 5])
            ->assertSessionHasErrors('type');

        $this->assertDatabaseMissing('salary_components', ['name' => 'Bonus']);
    }

    public function test_update_can_change_type_of_unused_component(): void
    {
        $component = SalaryComponent::factory()->create();

        $this->actingAs($this->hrUser())
            ->put(route('salary-components.update', $component), ['name' => $component->name, 'type' => 'deduction', 'sort_order' => 3, 'is_active' => true])
            ->assertSessionHasNoErrors();

        $this->assertSame(SalaryComponentType::Deduction, $component->fresh()->type);
    }

    public function test_used_component_can_still_be_renamed_when_type_is_unchanged(): void
    {
        $line = EmployeeSalaryComponent::factory()->create();
        $component = $line->salaryComponent;

        $this->actingAs($this->hrUser())
            ->put(route('salary-components.update', $component), ['name' => 'Renamed', 'type' => $component->type->value, 'sort_order' => 3, 'is_active' => true])
            ->assertSessionHasNoErrors();

        $this->assertSame('Renamed', $component->fresh()->name);
    }

    public function test_existing_default_components_are_earnings(): void
    {
        $this->assertSame(4, SalaryComponent::where('type', SalaryComponentType::Earning)->count());
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
