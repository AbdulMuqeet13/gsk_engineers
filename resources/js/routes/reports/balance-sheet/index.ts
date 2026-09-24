import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\BalanceSheetController::exportMethod
* @see app/Http/Controllers/BalanceSheetController.php:30
* @route '/reports/balance-sheet/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/reports/balance-sheet/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BalanceSheetController::exportMethod
* @see app/Http/Controllers/BalanceSheetController.php:30
* @route '/reports/balance-sheet/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BalanceSheetController::exportMethod
* @see app/Http/Controllers/BalanceSheetController.php:30
* @route '/reports/balance-sheet/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BalanceSheetController::exportMethod
* @see app/Http/Controllers/BalanceSheetController.php:30
* @route '/reports/balance-sheet/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BalanceSheetController::exportMethod
* @see app/Http/Controllers/BalanceSheetController.php:30
* @route '/reports/balance-sheet/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BalanceSheetController::exportMethod
* @see app/Http/Controllers/BalanceSheetController.php:30
* @route '/reports/balance-sheet/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BalanceSheetController::exportMethod
* @see app/Http/Controllers/BalanceSheetController.php:30
* @route '/reports/balance-sheet/export'
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

const balanceSheet = {
    export: Object.assign(exportMethod, exportMethod),
}

export default balanceSheet