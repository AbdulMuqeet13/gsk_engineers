import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ProjectLedgerController::exportMethod
* @see app/Http/Controllers/ProjectLedgerController.php:48
* @route '/reports/project-ledger/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/reports/project-ledger/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectLedgerController::exportMethod
* @see app/Http/Controllers/ProjectLedgerController.php:48
* @route '/reports/project-ledger/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectLedgerController::exportMethod
* @see app/Http/Controllers/ProjectLedgerController.php:48
* @route '/reports/project-ledger/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectLedgerController::exportMethod
* @see app/Http/Controllers/ProjectLedgerController.php:48
* @route '/reports/project-ledger/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProjectLedgerController::exportMethod
* @see app/Http/Controllers/ProjectLedgerController.php:48
* @route '/reports/project-ledger/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectLedgerController::exportMethod
* @see app/Http/Controllers/ProjectLedgerController.php:48
* @route '/reports/project-ledger/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectLedgerController::exportMethod
* @see app/Http/Controllers/ProjectLedgerController.php:48
* @route '/reports/project-ledger/export'
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

const projectLedger = {
    export: Object.assign(exportMethod, exportMethod),
}

export default projectLedger