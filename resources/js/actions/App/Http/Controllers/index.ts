import DashboardController from './DashboardController'
import AccountHeadController from './AccountHeadController'
import ProjectController from './ProjectController'
import EmployeeController from './EmployeeController'
import ProjectAssignmentController from './ProjectAssignmentController'
import JournalEntryController from './JournalEntryController'
import GeneralLedgerController from './GeneralLedgerController'
import TrialBalanceController from './TrialBalanceController'
import ExpenseController from './ExpenseController'
import AttendanceController from './AttendanceController'
import LeaveRequestController from './LeaveRequestController'
import PayrollRunController from './PayrollRunController'
import InterProjectTransferController from './InterProjectTransferController'
import InterProjectPositionController from './InterProjectPositionController'
import IncomeExpenseSummaryController from './IncomeExpenseSummaryController'
import PayrollReportController from './PayrollReportController'
import ProfitAndLossController from './ProfitAndLossController'
import BalanceSheetController from './BalanceSheetController'
import ProjectCashbookController from './ProjectCashbookController'
import ProjectLedgerController from './ProjectLedgerController'
import AttachmentController from './AttachmentController'
import Settings from './Settings'

const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    AccountHeadController: Object.assign(AccountHeadController, AccountHeadController),
    ProjectController: Object.assign(ProjectController, ProjectController),
    EmployeeController: Object.assign(EmployeeController, EmployeeController),
    ProjectAssignmentController: Object.assign(ProjectAssignmentController, ProjectAssignmentController),
    JournalEntryController: Object.assign(JournalEntryController, JournalEntryController),
    GeneralLedgerController: Object.assign(GeneralLedgerController, GeneralLedgerController),
    TrialBalanceController: Object.assign(TrialBalanceController, TrialBalanceController),
    ExpenseController: Object.assign(ExpenseController, ExpenseController),
    AttendanceController: Object.assign(AttendanceController, AttendanceController),
    LeaveRequestController: Object.assign(LeaveRequestController, LeaveRequestController),
    PayrollRunController: Object.assign(PayrollRunController, PayrollRunController),
    InterProjectTransferController: Object.assign(InterProjectTransferController, InterProjectTransferController),
    InterProjectPositionController: Object.assign(InterProjectPositionController, InterProjectPositionController),
    IncomeExpenseSummaryController: Object.assign(IncomeExpenseSummaryController, IncomeExpenseSummaryController),
    PayrollReportController: Object.assign(PayrollReportController, PayrollReportController),
    ProfitAndLossController: Object.assign(ProfitAndLossController, ProfitAndLossController),
    BalanceSheetController: Object.assign(BalanceSheetController, BalanceSheetController),
    ProjectCashbookController: Object.assign(ProjectCashbookController, ProjectCashbookController),
    ProjectLedgerController: Object.assign(ProjectLedgerController, ProjectLedgerController),
    AttachmentController: Object.assign(AttachmentController, AttachmentController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers