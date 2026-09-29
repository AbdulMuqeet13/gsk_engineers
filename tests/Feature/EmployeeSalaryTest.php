<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Enums\SalaryChangeType;
use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\Payslip;
use App\Models\SalaryComponent;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeSalaryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();
    }

    private function admin(): User
    {
        $user = User::factory()->create();
        $user->assignRole(RoleEnum::SuperAdmin);

        return $user;
    }

    private function componentId(string $name): int
    {
        return SalaryComponent::where('name', $name)->value('id');
    }

    public function test_creating_employee_records_initial_salary_from_components(): void
    {
        $this->actingAs($this->admin())->post(route('employees.store'), [
            'name' => 'Ali Raza',
            'type' => 'internal',
            'designation' => 'Engineer',
            'department' => 'Engineering',
            'date_of_joining' => '2026-01-15',
            'cnic' => '12345-6789012-3',
            'address' => 'Lahore',
            'components' => [
                ['salary_component_id' => $this->componentId('Basic Salary'), 'amount' => '50000.00'],
                ['salary_component_id' => $this->componentId('House Rent'), 'amount' => '20000.00'],
                ['salary_component_id' => $this->componentId('Medical'), 'amount' => '0'],
                ['salary_component_id' => $this->componentId('Conveyance'), 'amount' => null],
            ],
            'tax_amount' => '3000.00',
            'security_amount' => '2000.00',
        ])->assertRedirect(route('employees.index'));

        $salary = EmployeeSalary::sole();
        $this->assertSame(SalaryChangeType::Initial, $salary->change_type);
        $this->assertSame('15-01-2026', $salary->effective_date->format('d-m-Y'));
        $this->assertSame('70000.00', $salary->gross_salary);
        $this->assertSame('3000.00', $salary->tax_amount);
        $this->assertSame('2000.00', $salary->security_amount);
        $this->assertSame(2, $salary->components()->count());
    }

    public function test_creating_employee_requires_a_positive_component_total(): void
    {
        $response = $this->actingAs($this->admin())->post(route('employees.store'), [
            'name' => 'Ali Raza',
            'type' => 'internal',
            'designation' => 'Engineer',
            'department' => 'Engineering',
            'date_of_joining' => '2026-01-15',
            'cnic' => '12345-6789012-3',
            'address' => 'Lahore',
            'components' => [['salary_component_id' => $this->componentId('Basic Salary'), 'amount' => '0']],
        ]);

        $response->assertSessionHasErrors(['components' => 'Enter an amount for at least one salary component.']);
        $this->assertDatabaseEmpty('employees');
    }

    public function test_increment_adds_a_new_salary_record(): void
    {
        $this->travelTo('2026-09-29');
        $admin = $this->admin();
        $employee = Employee::factory()->withSalary('50000.00')->create();

        $this->actingAs($admin)->post(route('employees.salaries.store', $employee), [
            'effective_date' => '2026-07-01',
            'change_type' => SalaryChangeType::Increment->value,
            'components' => [['salary_component_id' => $this->componentId('Basic Salary'), 'amount' => '60000.00']],
            'tax_amount' => '2500.00',
            'security_amount' => '1000.00',
            'remarks' => 'Annual increment',
        ])->assertRedirect(route('employees.show', $employee));

        $this->assertSame(2, $employee->salaries()->count());
        $current = $employee->fresh()->currentSalary;
        $this->assertSame(SalaryChangeType::Increment, $current->change_type);
        $this->assertSame('60000.00', $current->gross_salary);
        $this->assertSame($admin->id, $current->created_by);
    }

    public function test_future_dated_increment_is_not_the_current_salary(): void
    {
        $this->travelTo('2026-09-29');
        $employee = Employee::factory()->withSalary('50000.00', effectiveDate: '2026-01-01')->create();
        $increment = EmployeeSalary::factory()->for($employee)->create([
            'effective_date' => '2026-10-01',
            'change_type' => SalaryChangeType::Increment,
            'gross_salary' => '60000.00',
        ]);

        $this->assertSame('50000.00', $employee->currentSalary->gross_salary);

        $this->actingAs($this->admin())->get(route('employees.show', $employee))
            ->assertInertia(fn ($page) => $page
                ->where('employee.salaries.0.id', $increment->id)
                ->where('currentSalaryId', $employee->salaries()->where('change_type', SalaryChangeType::Initial)->value('id'))
            );
    }

    public function test_salary_record_cannot_use_initial_change_type(): void
    {
        $employee = Employee::factory()->withSalary()->create();

        $this->actingAs($this->admin())->post(route('employees.salaries.store', $employee), [
            'effective_date' => '2026-07-01',
            'change_type' => SalaryChangeType::Initial->value,
            'components' => [['salary_component_id' => $this->componentId('Basic Salary'), 'amount' => '60000.00']],
        ])->assertSessionHasErrors('change_type');
    }

    public function test_viewer_cannot_add_salary_record(): void
    {
        $viewer = User::factory()->create();
        $viewer->assignRole(RoleEnum::Viewer);
        $employee = Employee::factory()->withSalary()->create();

        $this->actingAs($viewer)->post(route('employees.salaries.store', $employee), [
            'effective_date' => '2026-07-01',
            'change_type' => SalaryChangeType::Increment->value,
            'components' => [['salary_component_id' => $this->componentId('Basic Salary'), 'amount' => '60000.00']],
        ])->assertForbidden();

        $this->assertSame(1, $employee->salaries()->count());
    }

    public function test_unused_salary_record_can_be_deleted(): void
    {
        $employee = Employee::factory()->withSalary()->create();
        $increment = EmployeeSalary::factory()->for($employee)->create(['change_type' => SalaryChangeType::Increment]);

        $this->actingAs($this->admin())
            ->delete(route('employees.salaries.destroy', [$employee, $increment]))
            ->assertRedirect(route('employees.show', $employee));

        $this->assertModelMissing($increment);
    }

    public function test_salary_record_used_in_payroll_cannot_be_deleted(): void
    {
        $employee = Employee::factory()->withSalary()->create();
        $increment = EmployeeSalary::factory()->for($employee)->create(['change_type' => SalaryChangeType::Increment]);
        Payslip::factory()->for($employee)->create(['employee_salary_id' => $increment->id]);

        $response = $this->actingAs($this->admin())
            ->delete(route('employees.salaries.destroy', [$employee, $increment]));

        $response->assertInertiaFlash('toast', ['type' => 'error', 'message' => 'This salary record has been used in payroll and cannot be deleted.']);
        $this->assertModelExists($increment);
    }

    public function test_only_salary_record_cannot_be_deleted(): void
    {
        $employee = Employee::factory()->withSalary()->create();
        $salary = $employee->salaries()->sole();

        $response = $this->actingAs($this->admin())
            ->delete(route('employees.salaries.destroy', [$employee, $salary]));

        $response->assertInertiaFlash('toast', ['type' => 'error', 'message' => "An employee's only salary record cannot be deleted."]);
        $this->assertModelExists($salary);
    }

    public function test_salary_record_of_another_employee_is_not_found(): void
    {
        $employee = Employee::factory()->withSalary()->create();
        $otherSalary = EmployeeSalary::factory()->create();

        $this->actingAs($this->admin())
            ->delete(route('employees.salaries.destroy', [$employee, $otherSalary]))
            ->assertNotFound();
    }

    public function test_show_page_lists_salary_history(): void
    {
        $employee = Employee::factory()->withSalary('50000.00')->create();
        EmployeeSalary::factory()->for($employee)->create([
            'effective_date' => '2030-01-01',
            'change_type' => SalaryChangeType::Increment,
            'gross_salary' => '60000.00',
        ]);

        $response = $this->actingAs($this->admin())->get(route('employees.show', $employee));

        $response->assertInertia(fn ($page) => $page
            ->component('employees/show')
            ->has('employee.salaries', 2)
            ->where('employee.salaries.0.gross_salary', '60000.00')
            ->where('securityBalance', '0.00')
        );
    }
}
