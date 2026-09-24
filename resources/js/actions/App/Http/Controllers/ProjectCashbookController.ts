import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProjectCashbookController::index
* @see app/Http/Controllers/ProjectCashbookController.php:20
* @route '/reports/project-cashbook'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reports/project-cashbook',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectCashbookController::index
* @see app/Http/Controllers/ProjectCashbookController.php:20
* @route '/reports/project-cashbook'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectCashbookController::index
* @see app/Http/Controllers/ProjectCashbookController.php:20
* @route '/reports/project-cashbook'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectCashbookController::index
* @see app/Http/Controllers/ProjectCashbookController.php:20
* @route '/reports/project-cashbook'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProjectCashbookController::index
* @see app/Http/Controllers/ProjectCashbookController.php:20
* @route '/reports/project-cashbook'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectCashbookController::index
* @see app/Http/Controllers/ProjectCashbookController.php:20
* @route '/reports/project-cashbook'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectCashbookController::index
* @see app/Http/Controllers/ProjectCashbookController.php:20
* @route '/reports/project-cashbook'
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
* @see \App\Http\Controllers\ProjectCashbookController::exportMethod
* @see app/Http/Controllers/ProjectCashbookController.php:60
* @route '/reports/project-cashbook/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/reports/project-cashbook/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectCashbookController::exportMethod
* @see app/Http/Controllers/ProjectCashbookController.php:60
* @route '/reports/project-cashbook/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectCashbookController::exportMethod
* @see app/Http/Controllers/ProjectCashbookController.php:60
* @route '/reports/project-cashbook/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectCashbookController::exportMethod
* @see app/Http/Controllers/ProjectCashbookController.php:60
* @route '/reports/project-cashbook/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProjectCashbookController::exportMethod
* @see app/Http/Controllers/ProjectCashbookController.php:60
* @route '/reports/project-cashbook/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectCashbookController::exportMethod
* @see app/Http/Controllers/ProjectCashbookController.php:60
* @route '/reports/project-cashbook/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectCashbookController::exportMethod
* @see app/Http/Controllers/ProjectCashbookController.php:60
* @route '/reports/project-cashbook/export'
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

const ProjectCashbookController = { index, exportMethod, export: exportMethod }

export default ProjectCashbookController