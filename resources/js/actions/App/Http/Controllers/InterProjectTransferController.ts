import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InterProjectTransferController::index
* @see app/Http/Controllers/InterProjectTransferController.php:23
* @route '/transfers'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/transfers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InterProjectTransferController::index
* @see app/Http/Controllers/InterProjectTransferController.php:23
* @route '/transfers'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InterProjectTransferController::index
* @see app/Http/Controllers/InterProjectTransferController.php:23
* @route '/transfers'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InterProjectTransferController::index
* @see app/Http/Controllers/InterProjectTransferController.php:23
* @route '/transfers'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InterProjectTransferController::index
* @see app/Http/Controllers/InterProjectTransferController.php:23
* @route '/transfers'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InterProjectTransferController::index
* @see app/Http/Controllers/InterProjectTransferController.php:23
* @route '/transfers'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InterProjectTransferController::index
* @see app/Http/Controllers/InterProjectTransferController.php:23
* @route '/transfers'
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
* @see \App\Http\Controllers\InterProjectTransferController::store
* @see app/Http/Controllers/InterProjectTransferController.php:66
* @route '/transfers'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/transfers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InterProjectTransferController::store
* @see app/Http/Controllers/InterProjectTransferController.php:66
* @route '/transfers'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InterProjectTransferController::store
* @see app/Http/Controllers/InterProjectTransferController.php:66
* @route '/transfers'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InterProjectTransferController::store
* @see app/Http/Controllers/InterProjectTransferController.php:66
* @route '/transfers'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InterProjectTransferController::store
* @see app/Http/Controllers/InterProjectTransferController.php:66
* @route '/transfers'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\InterProjectTransferController::reverse
* @see app/Http/Controllers/InterProjectTransferController.php:75
* @route '/transfers/{transfer}/reverse'
*/
export const reverse = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

reverse.definition = {
    methods: ["post"],
    url: '/transfers/{transfer}/reverse',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InterProjectTransferController::reverse
* @see app/Http/Controllers/InterProjectTransferController.php:75
* @route '/transfers/{transfer}/reverse'
*/
reverse.url = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transfer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transfer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transfer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transfer: typeof args.transfer === 'object'
        ? args.transfer.id
        : args.transfer,
    }

    return reverse.definition.url
            .replace('{transfer}', parsedArgs.transfer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InterProjectTransferController::reverse
* @see app/Http/Controllers/InterProjectTransferController.php:75
* @route '/transfers/{transfer}/reverse'
*/
reverse.post = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InterProjectTransferController::reverse
* @see app/Http/Controllers/InterProjectTransferController.php:75
* @route '/transfers/{transfer}/reverse'
*/
const reverseForm = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InterProjectTransferController::reverse
* @see app/Http/Controllers/InterProjectTransferController.php:75
* @route '/transfers/{transfer}/reverse'
*/
reverseForm.post = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

reverse.form = reverseForm

const InterProjectTransferController = { index, store, reverse }

export default InterProjectTransferController