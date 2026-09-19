<?php

namespace Database\Seeders;

use App\Enums\AttendanceStatus;
use App\Enums\EmployeeType;
use App\Enums\JournalEntryType;
use App\Enums\LeaveType;
use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\Employee;
use App\Models\Project;
use App\Models\Attendance;
use App\Models\ProjectAssignment;
use App\Models\User;
use App\Services\ExpenseService;
use App\Services\JournalService;
use App\Services\LeaveService;
use App\Services\PayrollService;
use App\Services\TransferService;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    public function __construct(
        private JournalService $journalService,
        private ExpenseService $expenseService,
        private PayrollService $payrollService,
        private TransferService $transferService,
        private LeaveService $leaveService,
    ) {}

    public function run(): void
    {
        $admin = User::where('email', 'test@example.com')->first();

        $users = $this->seedUsers();
        $projects = $this->seedProjects();
        $employees = $this->seedEmployees($projects);

        $this->seedProjectAssignments($employees, $projects);
        $this->seedAttendance($employees, $admin);
        $this->seedLeaveRequests($employees, $admin);
        $this->seedOpeningBalances($admin, $projects);
        $this->seedProjectIncome($admin, $projects);
        $this->seedExpenses($admin, $projects);
        $this->seedPayroll($admin);
        $this->seedTransfers($admin, $projects);
    }

    /**
     * @return array<string, User>
     */
    private function seedUsers(): array
    {
        $users = [];

        $users['accountant'] = User::factory()->create([
            'name' => 'Ahmad Khan',
            'email' => 'accountant@example.com',
        ]);
        $users['accountant']->assignRole(RoleEnum::Accountant);

        $users['pm'] = User::factory()->create([
            'name' => 'Sara Ali',
            'email' => 'pm@example.com',
        ]);
        $users['pm']->assignRole(RoleEnum::ProjectManager);

        $users['hr'] = User::factory()->create([
            'name' => 'Fatima Noor',
            'email' => 'hr@example.com',
        ]);
        $users['hr']->assignRole(RoleEnum::Hr);

        $users['viewer'] = User::factory()->create([
            'name' => 'Usman Raza',
            'email' => 'viewer@example.com',
        ]);
        $users['viewer']->assignRole(RoleEnum::Viewer);

        return $users;
    }

    /**
     * @return array<string, Project>
     */
    private function seedProjects(): array
    {
        return [
            'highway' => Project::factory()->active()->create([
                'name' => 'Lahore–Islamabad Motorway Extension',
                'code' => 'PRJ-001',
                'client' => 'National Highway Authority',
                'budget' => 25000000.00,
                'start_date' => '2026-01-15',
                'end_date' => '2027-06-30',
            ]),
            'bridge' => Project::factory()->active()->create([
                'name' => 'Ravi River Bridge Construction',
                'code' => 'PRJ-002',
                'client' => 'Punjab Irrigation Department',
                'budget' => 8500000.00,
                'start_date' => '2026-03-01',
                'end_date' => '2026-12-31',
            ]),
            'tower' => Project::factory()->planning()->create([
                'name' => 'Blue Tower Commercial Complex',
                'code' => 'PRJ-003',
                'client' => 'Blue Group Developers',
                'budget' => 15000000.00,
                'start_date' => '2026-10-01',
                'end_date' => '2027-12-31',
            ]),
            'dam' => Project::factory()->onHold()->create([
                'name' => 'Tarbela Dam Spillway Repair',
                'code' => 'PRJ-004',
                'client' => 'WAPDA',
                'budget' => 5000000.00,
                'start_date' => '2026-02-01',
                'end_date' => '2026-08-31',
            ]),
            'housing' => Project::factory()->completed()->create([
                'name' => 'Bahria Enclave Phase-II Survey',
                'code' => 'PRJ-005',
                'client' => 'Bahria Town Pvt Ltd',
                'budget' => 2000000.00,
                'start_date' => '2025-06-01',
                'end_date' => '2026-05-31',
            ]),
        ];
    }

    /**
     * @param  array<string, Project>  $projects
     * @return Employee[]
     */
    private function seedEmployees(array $projects): array
    {
        $employees = [];

        // Internal staff
        $internalData = [
            ['name' => 'Bilal Ahmed', 'designation' => 'Chief Engineer', 'department' => 'Engineering', 'salary' => 180000],
            ['name' => 'Hina Shahid', 'designation' => 'Senior Accountant', 'department' => 'Finance', 'salary' => 120000],
            ['name' => 'Kamran Yousuf', 'designation' => 'HR Manager', 'department' => 'HR', 'salary' => 110000],
            ['name' => 'Nadia Farooq', 'designation' => 'Office Administrator', 'department' => 'Admin', 'salary' => 60000],
            ['name' => 'Zain Malik', 'designation' => 'IT Support', 'department' => 'Admin', 'salary' => 55000],
        ];

        foreach ($internalData as $data) {
            $employees[] = Employee::factory()->internal()->create([
                'name' => $data['name'],
                'designation' => $data['designation'],
                'department' => $data['department'],
                'salary' => $data['salary'],
                'date_of_joining' => fake()->dateTimeBetween('2024-01-01', '2025-12-31')->format('Y-m-d'),
            ]);
        }

        // Project-based employees — highway
        $highwayStaff = [
            ['name' => 'Tariq Mehmood', 'designation' => 'Site Engineer', 'salary' => 95000],
            ['name' => 'Asad Iqbal', 'designation' => 'Civil Foreman', 'salary' => 65000],
            ['name' => 'Waseem Akram', 'designation' => 'Surveyor', 'salary' => 55000],
            ['name' => 'Rizwan Shah', 'designation' => 'Machine Operator', 'salary' => 45000],
        ];

        foreach ($highwayStaff as $data) {
            $employees[] = Employee::factory()->projectBased($projects['highway'])->create([
                'name' => $data['name'],
                'designation' => $data['designation'],
                'department' => 'Engineering',
                'salary' => $data['salary'],
                'date_of_joining' => '2026-01-20',
            ]);
        }

        // Project-based employees — bridge
        $bridgeStaff = [
            ['name' => 'Faisal Rehman', 'designation' => 'Structural Engineer', 'salary' => 105000],
            ['name' => 'Danish Nawaz', 'designation' => 'Lab Technician', 'salary' => 50000],
            ['name' => 'Imran Javed', 'designation' => 'Safety Officer', 'salary' => 55000],
        ];

        foreach ($bridgeStaff as $data) {
            $employees[] = Employee::factory()->projectBased($projects['bridge'])->create([
                'name' => $data['name'],
                'designation' => $data['designation'],
                'department' => 'Engineering',
                'salary' => $data['salary'],
                'date_of_joining' => '2026-03-05',
            ]);
        }

        // One inactive employee
        $employees[] = Employee::factory()->inactive()->create([
            'name' => 'Shahid Mehmood',
            'designation' => 'Junior Engineer',
            'department' => 'Engineering',
            'salary' => 45000,
            'type' => EmployeeType::Internal,
            'date_of_joining' => '2024-06-01',
        ]);

        return $employees;
    }

    /**
     * @param  Employee[]  $employees
     * @param  array<string, Project>  $projects
     */
    private function seedProjectAssignments(array $employees, array $projects): void
    {
        // Assign chief engineer to both active projects
        ProjectAssignment::create([
            'employee_id' => $employees[0]->id,
            'project_id' => $projects['highway']->id,
            'role' => 'Lead Engineer',
            'allocation_percent' => 60.00,
        ]);

        ProjectAssignment::create([
            'employee_id' => $employees[0]->id,
            'project_id' => $projects['bridge']->id,
            'role' => 'Technical Advisor',
            'allocation_percent' => 40.00,
        ]);

        // Assign accountant to highway
        ProjectAssignment::create([
            'employee_id' => $employees[1]->id,
            'project_id' => $projects['highway']->id,
            'role' => 'Finance Lead',
            'allocation_percent' => 50.00,
        ]);
    }

    /**
     * @param  Employee[]  $employees
     */
    private function seedAttendance(array $employees, User $admin): void
    {
        $activeEmployees = array_filter($employees, fn (Employee $e) => $e->is_active);
        $startDate = now()->subDays(20);

        foreach ($activeEmployees as $employee) {
            for ($i = 0; $i < 20; $i++) {
                $date = $startDate->copy()->addDays($i);

                if ($date->isWeekend()) {
                    continue;
                }

                $status = fake()->randomElement([
                    AttendanceStatus::Present,
                    AttendanceStatus::Present,
                    AttendanceStatus::Present,
                    AttendanceStatus::Present,
                    AttendanceStatus::Present,
                    AttendanceStatus::HalfDay,
                    AttendanceStatus::Absent,
                ]);

                $checkIn = $status !== AttendanceStatus::Absent ? '08:'.fake()->numberBetween(0, 30).':00' : null;
                $checkOut = match ($status) {
                    AttendanceStatus::Present => '17:'.fake()->numberBetween(0, 30).':00',
                    AttendanceStatus::HalfDay => '13:'.fake()->numberBetween(0, 30).':00',
                    default => null,
                };

                Attendance::create([
                    'employee_id' => $employee->id,
                    'date' => $date->format('Y-m-d'),
                    'status' => $status,
                    'check_in' => $checkIn,
                    'check_out' => $checkOut,
                    'marked_by' => $admin->id,
                ]);
            }
        }
    }

    /**
     * @param  Employee[]  $employees
     */
    private function seedLeaveRequests(array $employees, User $admin): void
    {
        // Approved annual leave
        $leave1 = $this->leaveService->create([
            'employee_id' => $employees[2]->id,
            'leave_type' => LeaveType::Annual->value,
            'start_date' => now()->addDays(10)->format('Y-m-d'),
            'end_date' => now()->addDays(14)->format('Y-m-d'),
            'reason' => 'Family vacation',
        ], $admin);
        $this->leaveService->approve($leave1, $admin);

        // Pending sick leave
        $this->leaveService->create([
            'employee_id' => $employees[5]->id,
            'leave_type' => LeaveType::Sick->value,
            'start_date' => now()->addDays(2)->format('Y-m-d'),
            'end_date' => now()->addDays(3)->format('Y-m-d'),
            'reason' => 'Medical appointment',
        ], $admin);

        // Rejected casual leave
        $leave3 = $this->leaveService->create([
            'employee_id' => $employees[8]->id,
            'leave_type' => LeaveType::Casual->value,
            'start_date' => now()->subDays(5)->format('Y-m-d'),
            'end_date' => now()->subDays(4)->format('Y-m-d'),
            'reason' => 'Personal errand',
        ], $admin);
        $this->leaveService->reject($leave3, $admin, 'Critical phase of project, cannot approve leave at this time.');

        // Another approved leave
        $leave4 = $this->leaveService->create([
            'employee_id' => $employees[0]->id,
            'leave_type' => LeaveType::Annual->value,
            'start_date' => now()->subDays(15)->format('Y-m-d'),
            'end_date' => now()->subDays(12)->format('Y-m-d'),
            'reason' => 'Eid holidays',
        ], $admin);
        $this->leaveService->approve($leave4, $admin);

        // Pending unpaid leave
        $this->leaveService->create([
            'employee_id' => $employees[3]->id,
            'leave_type' => LeaveType::Unpaid->value,
            'start_date' => now()->addDays(20)->format('Y-m-d'),
            'end_date' => now()->addDays(25)->format('Y-m-d'),
            'reason' => 'Extended family event',
        ], $admin);
    }

    /**
     * @param  array<string, Project>  $projects
     */
    private function seedOpeningBalances(User $admin, array $projects): void
    {
        $cash = AccountHead::where('code', '1001')->first();
        $bank = AccountHead::where('code', '1002')->first();
        $equity = AccountHead::where('code', '3001')->first();

        // Opening balance — cash & bank funded by owner equity
        $entry = $this->journalService->create([
            'date' => '2026-01-01',
            'description' => 'Opening balances — owner capital injection',
            'type' => JournalEntryType::Opening->value,
            'lines' => [
                ['account_head_id' => $cash->id, 'project_id' => null, 'debit' => '500000', 'credit' => '0', 'memo' => 'Cash on hand'],
                ['account_head_id' => $bank->id, 'project_id' => null, 'debit' => '4500000', 'credit' => '0', 'memo' => 'HBL current account'],
                ['account_head_id' => $equity->id, 'project_id' => null, 'debit' => '0', 'credit' => '5000000', 'memo' => 'Owner capital'],
            ],
        ], $admin);
        $this->journalService->post($entry);

        // Fund projects from bank
        $projectFund = AccountHead::where('code', '1003')->first();

        $entry2 = $this->journalService->create([
            'date' => '2026-01-15',
            'description' => 'Initial fund allocation to Highway project',
            'type' => JournalEntryType::Standard->value,
            'lines' => [
                ['account_head_id' => $projectFund->id, 'project_id' => $projects['highway']->id, 'debit' => '2000000', 'credit' => '0', 'memo' => null],
                ['account_head_id' => $bank->id, 'project_id' => null, 'debit' => '0', 'credit' => '2000000', 'memo' => null],
            ],
        ], $admin);
        $this->journalService->post($entry2);

        $entry3 = $this->journalService->create([
            'date' => '2026-03-01',
            'description' => 'Initial fund allocation to Bridge project',
            'type' => JournalEntryType::Standard->value,
            'lines' => [
                ['account_head_id' => $projectFund->id, 'project_id' => $projects['bridge']->id, 'debit' => '1000000', 'credit' => '0', 'memo' => null],
                ['account_head_id' => $bank->id, 'project_id' => null, 'debit' => '0', 'credit' => '1000000', 'memo' => null],
            ],
        ], $admin);
        $this->journalService->post($entry3);
    }

    /**
     * @param  array<string, Project>  $projects
     */
    private function seedProjectIncome(User $admin, array $projects): void
    {
        $income = AccountHead::where('code', '4001')->first();
        $bank = AccountHead::where('code', '1002')->first();

        $invoices = [
            ['date' => '2026-04-15', 'desc' => 'Highway project — milestone 1 payment', 'amount' => '3500000', 'project' => 'highway'],
            ['date' => '2026-06-01', 'desc' => 'Bridge project — advance payment', 'amount' => '1200000', 'project' => 'bridge'],
            ['date' => '2026-07-15', 'desc' => 'Highway project — milestone 2 payment', 'amount' => '2800000', 'project' => 'highway'],
            ['date' => '2026-08-01', 'desc' => 'Bridge project — progress billing', 'amount' => '900000', 'project' => 'bridge'],
            ['date' => '2026-09-01', 'desc' => 'Highway project — material supply advance', 'amount' => '1500000', 'project' => 'highway'],
        ];

        foreach ($invoices as $invoice) {
            $entry = $this->journalService->create([
                'date' => $invoice['date'],
                'description' => $invoice['desc'],
                'type' => JournalEntryType::Standard->value,
                'lines' => [
                    ['account_head_id' => $bank->id, 'project_id' => $projects[$invoice['project']]->id, 'debit' => $invoice['amount'], 'credit' => '0', 'memo' => null],
                    ['account_head_id' => $income->id, 'project_id' => $projects[$invoice['project']]->id, 'debit' => '0', 'credit' => $invoice['amount'], 'memo' => null],
                ],
            ], $admin);
            $this->journalService->post($entry);
        }
    }

    /**
     * @param  array<string, Project>  $projects
     */
    private function seedExpenses(User $admin, array $projects): void
    {
        $fuel = AccountHead::where('code', '5003')->first();
        $food = AccountHead::where('code', '5004')->first();
        $rent = AccountHead::where('code', '5002')->first();
        $general = AccountHead::where('code', '5005')->first();
        $bank = AccountHead::where('code', '1002')->first();
        $cash = AccountHead::where('code', '1001')->first();

        $expenses = [
            // Approved expenses (will create journal entries)
            ['date' => '2026-05-10', 'desc' => 'Diesel for excavators — highway site', 'amount' => '85000', 'account' => $fuel, 'payment' => $bank, 'project' => $projects['highway'], 'approve' => true],
            ['date' => '2026-05-15', 'desc' => 'Site worker meals — May', 'amount' => '32000', 'account' => $food, 'payment' => $cash, 'project' => $projects['highway'], 'approve' => true],
            ['date' => '2026-06-01', 'desc' => 'Office rent — June', 'amount' => '120000', 'account' => $rent, 'payment' => $bank, 'project' => null, 'approve' => true],
            ['date' => '2026-06-10', 'desc' => 'Fuel for bridge site equipment', 'amount' => '45000', 'account' => $fuel, 'payment' => $bank, 'project' => $projects['bridge'], 'approve' => true],
            ['date' => '2026-07-01', 'desc' => 'Office rent — July', 'amount' => '120000', 'account' => $rent, 'payment' => $bank, 'project' => null, 'approve' => true],
            ['date' => '2026-07-05', 'desc' => 'Stationery and office supplies', 'amount' => '15000', 'account' => $general, 'payment' => $cash, 'project' => null, 'approve' => true],
            ['date' => '2026-08-01', 'desc' => 'Office rent — August', 'amount' => '120000', 'account' => $rent, 'payment' => $bank, 'project' => null, 'approve' => true],
            ['date' => '2026-08-12', 'desc' => 'Diesel for generators — bridge site', 'amount' => '38000', 'account' => $fuel, 'payment' => $bank, 'project' => $projects['bridge'], 'approve' => true],
            ['date' => '2026-09-01', 'desc' => 'Office rent — September', 'amount' => '120000', 'account' => $rent, 'payment' => $bank, 'project' => null, 'approve' => true],
            ['date' => '2026-09-05', 'desc' => 'Worker meals — September highway', 'amount' => '28000', 'account' => $food, 'payment' => $cash, 'project' => $projects['highway'], 'approve' => true],

            // Submitted (pending approval)
            ['date' => '2026-09-12', 'desc' => 'Equipment maintenance — highway', 'amount' => '75000', 'account' => $general, 'payment' => $bank, 'project' => $projects['highway'], 'approve' => false, 'submit' => true],
            ['date' => '2026-09-14', 'desc' => 'Safety gear purchase', 'amount' => '42000', 'account' => $general, 'payment' => $bank, 'project' => $projects['bridge'], 'approve' => false, 'submit' => true],

            // Draft
            ['date' => '2026-09-16', 'desc' => 'Fuel for site vehicles', 'amount' => '25000', 'account' => $fuel, 'payment' => $cash, 'project' => $projects['highway'], 'approve' => false],
        ];

        foreach ($expenses as $data) {
            $expense = $this->expenseService->create([
                'date' => $data['date'],
                'description' => $data['desc'],
                'amount' => $data['amount'],
                'account_head_id' => $data['account']->id,
                'payment_account_id' => $data['payment']->id,
                'project_id' => $data['project']?->id,
                'notes' => null,
            ], $admin);

            if ($data['approve'] ?? false) {
                $this->expenseService->submit($expense);
                $this->expenseService->approve($expense, $admin);
            } elseif ($data['submit'] ?? false) {
                $this->expenseService->submit($expense);
            }
        }
    }

    private function seedPayroll(User $admin): void
    {
        $bank = AccountHead::where('code', '1002')->first();

        // Approved payroll — July
        $julyRun = $this->payrollService->create([
            'period_start' => '2026-07-01',
            'period_end' => '2026-07-31',
            'payment_account_id' => $bank->id,
            'description' => 'July 2026 salary disbursement',
        ], $admin);
        $this->payrollService->submit($julyRun);
        $this->payrollService->approve($julyRun, $admin);

        // Approved payroll — August
        $augRun = $this->payrollService->create([
            'period_start' => '2026-08-01',
            'period_end' => '2026-08-31',
            'payment_account_id' => $bank->id,
            'description' => 'August 2026 salary disbursement',
        ], $admin);
        $this->payrollService->submit($augRun);
        $this->payrollService->approve($augRun, $admin);

        // Submitted payroll — September (pending approval)
        $sepRun = $this->payrollService->create([
            'period_start' => '2026-09-01',
            'period_end' => '2026-09-30',
            'payment_account_id' => $bank->id,
            'description' => 'September 2026 salary disbursement',
        ], $admin);
        $this->payrollService->submit($sepRun);
    }

    /**
     * @param  array<string, Project>  $projects
     */
    private function seedTransfers(User $admin, array $projects): void
    {
        $projectFund = AccountHead::where('code', '1003')->first();

        // Transfer funds from highway to bridge
        $this->transferService->execute([
            'from_project_id' => $projects['highway']->id,
            'to_project_id' => $projects['bridge']->id,
            'from_account_id' => $projectFund->id,
            'to_account_id' => $projectFund->id,
            'amount' => '250000',
            'date' => '2026-06-15',
            'purpose' => 'Emergency bridge reinforcement materials',
        ], $admin);

        // Transfer funds from bridge to highway
        $this->transferService->execute([
            'from_project_id' => $projects['bridge']->id,
            'to_project_id' => $projects['highway']->id,
            'from_account_id' => $projectFund->id,
            'to_account_id' => $projectFund->id,
            'amount' => '100000',
            'date' => '2026-08-20',
            'purpose' => 'Return of surplus material budget',
        ], $admin);
    }
}
