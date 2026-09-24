import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InterProjectPositionController::index
* @see app/Http/Controllers/InterProjectPositionController.php:16
* @route '/reports/inter-project-position'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reports/inter-project-position',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InterProjectPositionController::index
* @see app/Http/Controllers/InterProjectPositionController.php:16
* @route '/reports/inter-project-position'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InterProjectPositionController::index
* @see app/Http/Controllers/InterProjectPositionController.php:16
* @route '/reports/inter-project-position'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InterProjectPositionController::index
* @see app/Http/Controllers/InterProjectPositionController.php:16
* @route '/reports/inter-project-position'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InterProjectPositionController::index
* @see app/Http/Controllers/InterProjectPositionController.php:16
* @route '/reports/inter-project-position'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InterProjectPositionController::index
* @see app/Http/Controllers/InterProjectPositionController.php:16
* @route '/reports/inter-project-position'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InterProjectPositionController::index
* @see app/Http/Controllers/InterProjectPositionController.php:16
* @route '/reports/inter-project-position'
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
* @see \App\Http\Controllers\InterProjectPositionController::exportMethod
* @see app/Http/Controllers/InterProjectPositionController.php:29
* @route '/reports/inter-project-position/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/reports/inter-project-position/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InterProjectPositionController::exportMethod
* @see app/Http/Controllers/InterProjectPositionController.php:29
* @route '/reports/inter-project-position/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InterProjectPositionController::exportMethod
* @see app/Http/Controllers/InterProjectPositionController.php:29
* @route '/reports/inter-project-position/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InterProjectPositionController::exportMethod
* @see app/Http/Controllers/InterProjectPositionController.php:29
* @route '/reports/inter-project-position/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InterProjectPositionController::exportMethod
* @see app/Http/Controllers/InterProjectPositionController.php:29
* @route '/reports/inter-project-position/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InterProjectPositionController::exportMethod
* @see app/Http/Controllers/InterProjectPositionController.php:29
* @route '/reports/inter-project-position/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InterProjectPositionController::exportMethod
* @see app/Http/Controllers/InterProjectPositionController.php:29
* @route '/reports/inter-project-position/export'
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

const InterProjectPositionController = { index, exportMethod, export: exportMethod }

export default InterProjectPositionController