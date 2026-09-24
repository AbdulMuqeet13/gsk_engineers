import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProfitAndLossController::index
* @see app/Http/Controllers/ProfitAndLossController.php:17
* @route '/reports/profit-and-loss'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reports/profit-and-loss',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfitAndLossController::index
* @see app/Http/Controllers/ProfitAndLossController.php:17
* @route '/reports/profit-and-loss'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfitAndLossController::index
* @see app/Http/Controllers/ProfitAndLossController.php:17
* @route '/reports/profit-and-loss'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitAndLossController::index
* @see app/Http/Controllers/ProfitAndLossController.php:17
* @route '/reports/profit-and-loss'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProfitAndLossController::index
* @see app/Http/Controllers/ProfitAndLossController.php:17
* @route '/reports/profit-and-loss'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitAndLossController::index
* @see app/Http/Controllers/ProfitAndLossController.php:17
* @route '/reports/profit-and-loss'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitAndLossController::index
* @see app/Http/Controllers/ProfitAndLossController.php:17
* @route '/reports/profit-and-loss'
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
* @see \App\Http\Controllers\ProfitAndLossController::exportMethod
* @see app/Http/Controllers/ProfitAndLossController.php:30
* @route '/reports/profit-and-loss/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/reports/profit-and-loss/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfitAndLossController::exportMethod
* @see app/Http/Controllers/ProfitAndLossController.php:30
* @route '/reports/profit-and-loss/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfitAndLossController::exportMethod
* @see app/Http/Controllers/ProfitAndLossController.php:30
* @route '/reports/profit-and-loss/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitAndLossController::exportMethod
* @see app/Http/Controllers/ProfitAndLossController.php:30
* @route '/reports/profit-and-loss/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProfitAndLossController::exportMethod
* @see app/Http/Controllers/ProfitAndLossController.php:30
* @route '/reports/profit-and-loss/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitAndLossController::exportMethod
* @see app/Http/Controllers/ProfitAndLossController.php:30
* @route '/reports/profit-and-loss/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProfitAndLossController::exportMethod
* @see app/Http/Controllers/ProfitAndLossController.php:30
* @route '/reports/profit-and-loss/export'
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

const ProfitAndLossController = { index, exportMethod, export: exportMethod }

export default ProfitAndLossController