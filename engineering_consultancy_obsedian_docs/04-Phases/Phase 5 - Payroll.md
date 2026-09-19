# Phase 5 - Payroll

**Status:** Done (completed 2026-09-16)

## What Was Built

Attendance tracking, leave management, and payroll processing. Three interconnected modules that feed into the accounting engine via PayrollService.

### Attendance

Daily attendance tracking for employees. Statuses: present, absent, half_day, leave.

| Layer | Files |
|-------|-------|
| Enum | `AttendanceStatus.php` |
| Migration | `create_attendance_table` |
| Model | `Attendance.php` |
| Factory | `AttendanceFactory.php` |
| Policy | `AttendancePolicy.php` |
| Requests | `StoreAttendanceRequest`, `UpdateAttendanceRequest` |
| Actions | `CreateAttendance`, `UpdateAttendance`, `DeleteAttendance` |
| Controller | `AttendanceController.php` |
| Frontend | columns, create/edit/delete dialogs, index page |
| Tests | `AttendanceTest.php` (feature) |

### Leave Management

Leave requests with approval workflow (Pending → Approved/Rejected). Types: annual, sick, casual, unpaid.

| Layer | Files |
|-------|-------|
| Enums | `LeaveType.php`, `LeaveStatus.php` |
| Migration | `create_leave_requests_table` |
| Model | `LeaveRequest.php` |
| Factory | `LeaveRequestFactory.php` |
| Service | `LeaveService.php` — create, approve, reject, delete |
| Policy | `LeaveRequestPolicy.php` |
| Requests | `StoreLeaveRequest`, `ApproveLeaveRequest`, `RejectLeaveRequest` |
| Actions | `CreateLeave`, `ApproveLeave`, `RejectLeave`, `DeleteLeave` |
| Controller | `LeaveRequestController.php` |
| Frontend | columns, create/approve/reject/delete dialogs, index page |
| Tests | `LeaveServiceTest.php` (unit), `LeaveRequestTest.php` (feature) |

### Payroll

Payroll runs with payslips per employee, approval workflow (Draft → Submitted → Approved/Rejected). On approval, auto-creates + posts a journal entry via PayrollService.

| Layer | Files |
|-------|-------|
| Enum | `PayrollStatus.php` |
| Enum update | `JournalEntryType.php` — added `Payroll` case |
| Migrations | `create_payroll_runs_table`, `create_payslips_table` |
| Models | `PayrollRun.php`, `Payslip.php` |
| Factories | `PayrollRunFactory.php`, `PayslipFactory.php` |
| Exceptions | `PayrollNotDraftException`, `PayrollNotSubmittedException` |
| Service | `PayrollService.php` — create, updatePayslip, submit, approve, reject, delete |
| Policy | `PayrollRunPolicy.php` |
| Requests | `StorePayrollRequest`, `UpdatePayslipRequest`, `SubmitPayrollRequest`, `ApprovePayrollRequest`, `RejectPayrollRequest` |
| Actions | `CreatePayroll`, `UpdatePayslip`, `SubmitPayroll`, `ApprovePayroll`, `RejectPayroll`, `DeletePayroll` |
| Controller | `PayrollRunController.php` |
| Frontend | columns, create/submit/approve/reject/delete dialogs, payslip editing, index + show pages |
| Tests | `PayrollServiceTest.php` (unit), `PayrollRunTest.php` (feature) |

## PayrollService — Journal Entry on Approval

Constructor-injects `JournalService`.

**Journal entry created on approval:**
- **Debit:** Salaries Expense account (5001) per payslip — one line per employee
- **Credit:** Payment account (e.g. 1001 Cash) — single line for total
- All lines carry the employee's `project_id` for project costing
- Type: `JournalEntryType::Payroll`
- Entry is immediately posted

## Key Design Decisions

1. **Attendance is standalone** — no model-level link to payroll; payroll calculates days from attendance records at creation time
2. **Payslips belong to a payroll run** — no standalone payslips
3. **Individual payslip editing** — adjustments (deductions, notes) happen per payslip before submission
4. **PayrollRun show page** — the only module with a dedicated show page (for payslip management)

## Verification Results

- 220 tests, 856 assertions — all passing
- `npm run build` — clean, no TypeScript errors
