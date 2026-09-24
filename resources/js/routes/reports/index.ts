import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import interProjectPosition098f55 from './inter-project-position'
import incomeExpenseSummaryE7c31a from './income-expense-summary'
import payrollCe309f from './payroll'
import profitAndLoss112be4 from './profit-and-loss'
import balanceSheetBd94f5 from './balance-sheet'
import projectCashbook81307e from './project-cashbook'
import projectLedger470f25 from './project-ledger'
/**
* @see \App\Http\Controllers\InterProjectPositionController::interProjectPosition
* @see app/Http/Controllers/InterProjectPositionController.php:16
* @route '/reports/inter-project-position'
*/
export const interProjectPosition = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: interProjectPosition.url(options),
    method: 'get',
})

interProjectPosition.definition = {
    methods: ["get","head"],
    url: '/reports/inter-project-position',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InterProjectPositionController::interProjectPosition
* @see app/Http/Controllers/InterProjectPositionController.php:16
* @route '/reports/inter-project-position'
*/
interProjectPosition.url = (options?: RouteQueryOptions) => {
    return interProjectPosition.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InterProjectPositionController::interProjectPosition
* @see app/Http/Controllers/InterProjectPositionController.php:16
* @route '/reports/inter-project-position'
*/
interProjectPosition.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: interProjectPosition.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InterProjectPositionController::interProjectPosition
* @see app/Http/Controllers/InterProjectPositionController.php:16
* @route '/reports/inter-project-position'
*/
interProjectPosition.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: interProjectPosition.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InterProjectPositionController::interProjectPosition
* @see app/Http/Controllers/InterProjectPositionController.php:16
* @route '/reports/inter-project-position'
*/
const interProjectPositionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: interProjectPosition.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InterProjectPositionController::interProjectPosition
* @see app/Http/Controllers/InterProjectPositionController.php:16
* @route '/reports/inter-project-position'
*/
interProjectPositionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: interProjectPosition.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InterProjectPositionController::interProjectPosition
* @see app/Http/Controllers/InterProjectPositionController.php:16
* @route '/reports/inter-project-position'
*/
interProjectPositionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: interProjectPosition.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

interProjectPosition.form = interProjectPositionForm

/**
* @see \App\Http\Controllers\IncomeExpenseSummaryController::incomeExpenseSummary
* @see app/Http/Controllers/IncomeExpenseSummaryController.php:17
* @route '/reports/income-expense-summary'
*/
export const incomeExpenseSummary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: incomeExpenseSummary.url(options),
    method: 'get',
})

incomeExpenseSummary.definition = {
    methods: ["get","head"],
    url: '/reports/income-expense-summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\IncomeExpenseSummaryController::incomeExpenseSummary
* @see app/Http/Controllers/IncomeExpenseSummaryController.php:17
* @route '/reports/income-expense-summary'
*/
incomeExpenseSummary.url = (options?: RouteQueryOptions) => {
    return incomeExpenseSummary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\IncomeExpenseSummaryController::incomeExpenseSummary
* @see app/Http/Controllers/IncomeExpenseSummaryController.php:17
* @route '/reports/income-expense-summary'
*/
incomeExpenseSummary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: incomeExpenseSummary.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\IncomeExpenseSummaryController::incomeExpenseSummary
* @see app/Http/Controllers/IncomeExpenseSummaryController.php:17
* @route '/reports/income-expense-summary'
*/
incomeExpenseSummary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: incomeExpenseSummary.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\IncomeExpenseSummaryController::incomeExpenseSummary
* @see app/Http/Controllers/IncomeExpenseSummaryController.php:17
* @route '/reports/income-expense-summary'
*/
const incomeExpenseSummaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: incomeExpenseSummary.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\IncomeExpenseSummaryController::incomeExpenseSummary
* @see app/Http/Controllers/IncomeExpenseSummaryController.php:17
* @route '/reports/income-expense-summary'
*/
incomeExpenseSummaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: incomeExpenseSummary.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\IncomeExpenseSummaryController::incomeExpenseSummary
* @see app/Http/Controllers/IncomeExpenseSummaryController.php:17
* @route '/reports/income-expense-summary'
*/
incomeExpenseSummaryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: incomeExpenseSummary.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

incomeExpenseSummary.form = incomeExpenseSummaryForm

/**
* @see \App\Http\Controllers\PayrollReportController::payroll
* @see app/Http/Controllers/PayrollReportController.php:15
* @route '/reports/payroll'
*/
export const payroll = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payroll.url(options),
    method: 'get',
})

payroll.definition = {
    methods: ["get","head"],
    url: '/reports/payroll',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollReportController::payroll
* @see app/Http/Controllers/PayrollReportController.php:15
* @route '/reports/payroll'
*/
payroll.url = (options?: RouteQueryOptions) => {
    return payroll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollReportController::payroll
* @see app/Http/Controllers/PayrollReportController.php:15
* @route '/reports/payroll'
*/
payroll.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payroll.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollReportController::payroll
* @see app/Http/Controllers/PayrollReportController.php:15
* @route '/reports/payroll'
*/
payroll.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payroll.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PayrollReportController::payroll
* @see app/Http/Controllers/PayrollReportController.php:15
* @route '/reports/payroll'
*/
const payrollForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payroll.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollReportController::payroll
* @see app/Http/Controllers/PayrollReportController.php:15
* @route '/reports/payroll'
*/
payrollForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payroll.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollReportController::payroll
* @see app/Http/Controllers/PayrollReportController.php:15
* @route '/reports/payroll'
*/
payrollForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payroll.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

payroll.form = payrollForm

/**
* @see \App\Http\Controllers\ProfitAndLossController::profitAndLoss
* @see app/Http/Controllers/ProfitAndLossController.php:17
* @route '/reports/profit-and-loss'
*/
export const profitAndLoss = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profitAndLoss.url(options),
    method: 'get',
})

profitAndLoss.definition = {
    methods: ["get","head"],
    url: '/reports/profit-and-loss',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfitAndLossController::profitAndLoss
* @see app/Http/Controllers/ProfitAndLossController.php:17
* @route '/reports/profit-and-loss'
*/
profitAndLoss.url = (options?: RouteQueryOptions) => {
    return profitAndLoss.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfitAndLossController::profitAndLoss
* @see app/Http/Controllers/ProfitAndLossController.php:17
* @route '/reports/profit-and-loss'
*/
profitAndLoss.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profitAndLoss.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitAndLossController::profitAndLoss
* @see app/Http/Controllers/ProfitAndLossController.php:17
* @route '/reports/profit-and-loss'
*/
profitAndLoss.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profitAndLoss.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProfitAndLossController::profitAndLoss
* @see app/Http/Controllers/ProfitAndLossController.php:17
* @route '/reports/profit-and-loss'
*/
const profitAndLossForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: profitAndLoss.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitAndLossController::profitAndLoss
* @see app/Http/Controllers/ProfitAndLossController.php:17
* @route '/reports/profit-and-loss'
*/
profitAndLossForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: profitAndLoss.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitAndLossController::profitAndLoss
* @see app/Http/Controllers/ProfitAndLossController.php:17
* @route '/reports/profit-and-loss'
*/
profitAndLossForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: profitAndLoss.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

profitAndLoss.form = profitAndLossForm

/**
* @see \App\Http\Controllers\BalanceSheetController::balanceSheet
* @see app/Http/Controllers/BalanceSheetController.php:17
* @route '/reports/balance-sheet'
*/
export const balanceSheet = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: balanceSheet.url(options),
    method: 'get',
})

balanceSheet.definition = {
    methods: ["get","head"],
    url: '/reports/balance-sheet',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BalanceSheetController::balanceSheet
* @see app/Http/Controllers/BalanceSheetController.php:17
* @route '/reports/balance-sheet'
*/
balanceSheet.url = (options?: RouteQueryOptions) => {
    return balanceSheet.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BalanceSheetController::balanceSheet
* @see app/Http/Controllers/BalanceSheetController.php:17
* @route '/reports/balance-sheet'
*/
balanceSheet.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: balanceSheet.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BalanceSheetController::balanceSheet
* @see app/Http/Controllers/BalanceSheetController.php:17
* @route '/reports/balance-sheet'
*/
balanceSheet.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: balanceSheet.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BalanceSheetController::balanceSheet
* @see app/Http/Controllers/BalanceSheetController.php:17
* @route '/reports/balance-sheet'
*/
const balanceSheetForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: balanceSheet.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BalanceSheetController::balanceSheet
* @see app/Http/Controllers/BalanceSheetController.php:17
* @route '/reports/balance-sheet'
*/
balanceSheetForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: balanceSheet.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BalanceSheetController::balanceSheet
* @see app/Http/Controllers/BalanceSheetController.php:17
* @route '/reports/balance-sheet'
*/
balanceSheetForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: balanceSheet.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

balanceSheet.form = balanceSheetForm

/**
* @see \App\Http\Controllers\ProjectCashbookController::projectCashbook
* @see app/Http/Controllers/ProjectCashbookController.php:20
* @route '/reports/project-cashbook'
*/
export const projectCashbook = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: projectCashbook.url(options),
    method: 'get',
})

projectCashbook.definition = {
    methods: ["get","head"],
    url: '/reports/project-cashbook',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectCashbookController::projectCashbook
* @see app/Http/Controllers/ProjectCashbookController.php:20
* @route '/reports/project-cashbook'
*/
projectCashbook.url = (options?: RouteQueryOptions) => {
    return projectCashbook.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectCashbookController::projectCashbook
* @see app/Http/Controllers/ProjectCashbookController.php:20
* @route '/reports/project-cashbook'
*/
projectCashbook.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: projectCashbook.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectCashbookController::projectCashbook
* @see app/Http/Controllers/ProjectCashbookController.php:20
* @route '/reports/project-cashbook'
*/
projectCashbook.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: projectCashbook.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProjectCashbookController::projectCashbook
* @see app/Http/Controllers/ProjectCashbookController.php:20
* @route '/reports/project-cashbook'
*/
const projectCashbookForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: projectCashbook.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectCashbookController::projectCashbook
* @see app/Http/Controllers/ProjectCashbookController.php:20
* @route '/reports/project-cashbook'
*/
projectCashbookForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: projectCashbook.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectCashbookController::projectCashbook
* @see app/Http/Controllers/ProjectCashbookController.php:20
* @route '/reports/project-cashbook'
*/
projectCashbookForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: projectCashbook.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

projectCashbook.form = projectCashbookForm

/**
* @see \App\Http\Controllers\ProjectLedgerController::projectLedger
* @see app/Http/Controllers/ProjectLedgerController.php:17
* @route '/reports/project-ledger'
*/
export const projectLedger = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: projectLedger.url(options),
    method: 'get',
})

projectLedger.definition = {
    methods: ["get","head"],
    url: '/reports/project-ledger',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectLedgerController::projectLedger
* @see app/Http/Controllers/ProjectLedgerController.php:17
* @route '/reports/project-ledger'
*/
projectLedger.url = (options?: RouteQueryOptions) => {
    return projectLedger.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectLedgerController::projectLedger
* @see app/Http/Controllers/ProjectLedgerController.php:17
* @route '/reports/project-ledger'
*/
projectLedger.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: projectLedger.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectLedgerController::projectLedger
* @see app/Http/Controllers/ProjectLedgerController.php:17
* @route '/reports/project-ledger'
*/
projectLedger.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: projectLedger.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProjectLedgerController::projectLedger
* @see app/Http/Controllers/ProjectLedgerController.php:17
* @route '/reports/project-ledger'
*/
const projectLedgerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: projectLedger.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectLedgerController::projectLedger
* @see app/Http/Controllers/ProjectLedgerController.php:17
* @route '/reports/project-ledger'
*/
projectLedgerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: projectLedger.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectLedgerController::projectLedger
* @see app/Http/Controllers/ProjectLedgerController.php:17
* @route '/reports/project-ledger'
*/
projectLedgerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: projectLedger.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

projectLedger.form = projectLedgerForm

const reports = {
    interProjectPosition: Object.assign(interProjectPosition, interProjectPosition098f55),
    incomeExpenseSummary: Object.assign(incomeExpenseSummary, incomeExpenseSummaryE7c31a),
    payroll: Object.assign(payroll, payrollCe309f),
    profitAndLoss: Object.assign(profitAndLoss, profitAndLoss112be4),
    balanceSheet: Object.assign(balanceSheet, balanceSheetBd94f5),
    projectCashbook: Object.assign(projectCashbook, projectCashbook81307e),
    projectLedger: Object.assign(projectLedger, projectLedger470f25),
}

export default reports