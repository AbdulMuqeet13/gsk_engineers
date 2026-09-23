<?php

use App\Http\Controllers\AccountHeadController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\BalanceSheetController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\GeneralLedgerController;
use App\Http\Controllers\IncomeExpenseSummaryController;
use App\Http\Controllers\InterProjectPositionController;
use App\Http\Controllers\InterProjectTransferController;
use App\Http\Controllers\JournalEntryController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\PayrollReportController;
use App\Http\Controllers\PayrollRunController;
use App\Http\Controllers\ProfitAndLossController;
use App\Http\Controllers\ProjectAssignmentController;
use App\Http\Controllers\ProjectCashbookController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectLedgerController;
use App\Http\Controllers\TrialBalanceController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('accounting/chart-of-accounts', AccountHeadController::class)
        ->except(['create', 'edit', 'show'])
        ->names('account-heads')
        ->parameter('chart-of-accounts', 'account_head');

    Route::resource('projects', ProjectController::class)
        ->except(['create', 'edit', 'show']);

    Route::resource('employees', EmployeeController::class)
        ->except(['create', 'edit', 'show']);

    Route::resource('projects/assignments', ProjectAssignmentController::class)
        ->except(['create', 'edit', 'show'])
        ->names('project-assignments');

    Route::resource('accounting/journal-entries', JournalEntryController::class)
        ->except(['create', 'edit', 'show'])
        ->names('journal-entries')
        ->parameter('journal-entries', 'journal_entry');

    Route::post('accounting/journal-entries/{journal_entry}/post', [JournalEntryController::class, 'post'])
        ->name('journal-entries.post');

    Route::post('accounting/journal-entries/{journal_entry}/reverse', [JournalEntryController::class, 'reverse'])
        ->name('journal-entries.reverse');

    Route::get('accounting/general-ledger', [GeneralLedgerController::class, 'index'])
        ->name('general-ledger.index');

    Route::get('accounting/trial-balance', [TrialBalanceController::class, 'index'])
        ->name('trial-balance.index');

    Route::resource('expenses', ExpenseController::class)
        ->except(['create', 'edit', 'show']);

    Route::post('expenses/{expense}/submit', [ExpenseController::class, 'submit'])
        ->name('expenses.submit');

    Route::post('expenses/{expense}/approve', [ExpenseController::class, 'approve'])
        ->name('expenses.approve');

    Route::post('expenses/{expense}/reject', [ExpenseController::class, 'reject'])
        ->name('expenses.reject');

    Route::resource('attendance', AttendanceController::class)
        ->except(['create', 'edit', 'show']);

    Route::resource('leave', LeaveRequestController::class)
        ->except(['create', 'edit', 'show', 'update'])
        ->parameter('leave', 'leave_request');

    Route::post('leave/{leave_request}/approve', [LeaveRequestController::class, 'approve'])
        ->name('leave.approve');

    Route::post('leave/{leave_request}/reject', [LeaveRequestController::class, 'reject'])
        ->name('leave.reject');

    Route::resource('payroll', PayrollRunController::class)
        ->except(['create', 'edit', 'update'])
        ->parameter('payroll', 'payroll_run');

    Route::post('payroll/{payroll_run}/submit', [PayrollRunController::class, 'submit'])
        ->name('payroll.submit');

    Route::post('payroll/{payroll_run}/approve', [PayrollRunController::class, 'approve'])
        ->name('payroll.approve');

    Route::post('payroll/{payroll_run}/reject', [PayrollRunController::class, 'reject'])
        ->name('payroll.reject');

    Route::put('payroll/{payroll_run}/payslips/{payslip}', [PayrollRunController::class, 'updatePayslip'])
        ->name('payroll.payslips.update');

    Route::resource('transfers', InterProjectTransferController::class)
        ->only(['index', 'store'])
        ->parameter('transfers', 'transfer');

    Route::post('transfers/{transfer}/reverse', [InterProjectTransferController::class, 'reverse'])
        ->name('transfers.reverse');

    Route::get('reports/inter-project-position', [InterProjectPositionController::class, 'index'])
        ->name('reports.inter-project-position');

    Route::get('reports/income-expense-summary', [IncomeExpenseSummaryController::class, 'index'])
        ->name('reports.income-expense-summary');

    Route::get('reports/payroll', [PayrollReportController::class, 'index'])
        ->name('reports.payroll');

    Route::get('reports/profit-and-loss', [ProfitAndLossController::class, 'index'])
        ->name('reports.profit-and-loss');

    Route::get('reports/balance-sheet', [BalanceSheetController::class, 'index'])
        ->name('reports.balance-sheet');

    Route::get('reports/profit-and-loss/export', [ProfitAndLossController::class, 'export'])
        ->name('reports.profit-and-loss.export');

    Route::get('reports/balance-sheet/export', [BalanceSheetController::class, 'export'])
        ->name('reports.balance-sheet.export');

    Route::get('accounting/trial-balance/export', [TrialBalanceController::class, 'export'])
        ->name('trial-balance.export');

    Route::get('reports/inter-project-position/export', [InterProjectPositionController::class, 'export'])
        ->name('reports.inter-project-position.export');

    Route::get('reports/income-expense-summary/export', [IncomeExpenseSummaryController::class, 'export'])
        ->name('reports.income-expense-summary.export');

    Route::get('reports/payroll/export', [PayrollReportController::class, 'export'])
        ->name('reports.payroll.export');

    Route::get('reports/project-cashbook', [ProjectCashbookController::class, 'index'])
        ->name('reports.project-cashbook');

    Route::get('reports/project-cashbook/export', [ProjectCashbookController::class, 'export'])
        ->name('reports.project-cashbook.export');

    Route::get('reports/project-ledger', [ProjectLedgerController::class, 'index'])
        ->name('reports.project-ledger');

    Route::get('reports/project-ledger/export', [ProjectLedgerController::class, 'export'])
        ->name('reports.project-ledger.export');

    Route::post('attachments', [AttachmentController::class, 'store'])
        ->name('attachments.store');

    Route::get('attachments/{attachment}/download', [AttachmentController::class, 'download'])
        ->name('attachments.download');

    Route::delete('attachments/{attachment}', [AttachmentController::class, 'destroy'])
        ->name('attachments.destroy');

    Route::get('payroll/{payroll_run}/payslips/{payslip}/download', [PayrollRunController::class, 'downloadPayslip'])
        ->name('payroll.payslips.download');
});

require __DIR__.'/settings.php';
