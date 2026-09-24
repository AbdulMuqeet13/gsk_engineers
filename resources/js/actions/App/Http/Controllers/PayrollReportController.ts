import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PayrollReportController::index
* @see app/Http/Controllers/PayrollReportController.php:15
* @route '/reports/payroll'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reports/payroll',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollReportController::index
* @see app/Http/Controllers/PayrollReportController.php:15
* @route '/reports/payroll'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollReportController::index
* @see app/Http/Controllers/PayrollReportController.php:15
* @route '/reports/payroll'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollReportController::index
* @see app/Http/Controllers/PayrollReportController.php:15
* @route '/reports/payroll'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PayrollReportController::index
* @see app/Http/Controllers/PayrollReportController.php:15
* @route '/reports/payroll'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollReportController::index
* @see app/Http/Controllers/PayrollReportController.php:15
* @route '/reports/payroll'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollReportController::index
* @see app/Http/Controllers/PayrollReportController.php:15
* @route '/reports/payroll'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\PayrollReportController::exportMethod
* @see app/Http/Controllers/PayrollReportController.php:24
* @route '/reports/payroll/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/reports/payroll/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollReportController::exportMethod
* @see app/Http/Controllers/PayrollReportController.php:24
* @route '/reports/payroll/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollReportController::exportMethod
* @see app/Http/Controllers/PayrollReportController.php:24
* @route '/reports/payroll/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollReportController::exportMethod
* @see app/Http/Controllers/PayrollReportController.php:24
* @route '/reports/payroll/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PayrollReportController::exportMethod
* @see app/Http/Controllers/PayrollReportController.php:24
* @route '/reports/payroll/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollReportController::exportMethod
* @see app/Http/Controllers/PayrollReportController.php:24
* @route '/reports/payroll/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollReportController::exportMethod
* @see app/Http/Controllers/PayrollReportController.php:24
* @route '/reports/payroll/export'
*/
exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

const PayrollReportController = { index, exportMethod, export: exportMethod }

export default PayrollReportController