import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ProjectIncomeController::index
* @see app/Http/Controllers/ProjectIncomeController.php:24
* @route '/incomes'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/incomes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectIncomeController::index
* @see app/Http/Controllers/ProjectIncomeController.php:24
* @route '/incomes'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectIncomeController::index
* @see app/Http/Controllers/ProjectIncomeController.php:24
* @route '/incomes'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectIncomeController::index
* @see app/Http/Controllers/ProjectIncomeController.php:24
* @route '/incomes'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProjectIncomeController::index
* @see app/Http/Controllers/ProjectIncomeController.php:24
* @route '/incomes'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectIncomeController::index
* @see app/Http/Controllers/ProjectIncomeController.php:24
* @route '/incomes'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectIncomeController::index
* @see app/Http/Controllers/ProjectIncomeController.php:24
* @route '/incomes'
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
* @see \App\Http\Controllers\ProjectIncomeController::store
* @see app/Http/Controllers/ProjectIncomeController.php:73
* @route '/incomes'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/incomes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProjectIncomeController::store
* @see app/Http/Controllers/ProjectIncomeController.php:73
* @route '/incomes'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectIncomeController::store
* @see app/Http/Controllers/ProjectIncomeController.php:73
* @route '/incomes'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectIncomeController::store
* @see app/Http/Controllers/ProjectIncomeController.php:73
* @route '/incomes'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectIncomeController::store
* @see app/Http/Controllers/ProjectIncomeController.php:73
* @route '/incomes'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ProjectIncomeController::reverse
* @see app/Http/Controllers/ProjectIncomeController.php:82
* @route '/incomes/{income}/reverse'
*/
export const reverse = (args: { income: number | { id: number } } | [income: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

reverse.definition = {
    methods: ["post"],
    url: '/incomes/{income}/reverse',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProjectIncomeController::reverse
* @see app/Http/Controllers/ProjectIncomeController.php:82
* @route '/incomes/{income}/reverse'
*/
reverse.url = (args: { income: number | { id: number } } | [income: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { income: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { income: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            income: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        income: typeof args.income === 'object'
        ? args.income.id
        : args.income,
    }

    return reverse.definition.url
            .replace('{income}', parsedArgs.income.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectIncomeController::reverse
* @see app/Http/Controllers/ProjectIncomeController.php:82
* @route '/incomes/{income}/reverse'
*/
reverse.post = (args: { income: number | { id: number } } | [income: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectIncomeController::reverse
* @see app/Http/Controllers/ProjectIncomeController.php:82
* @route '/incomes/{income}/reverse'
*/
const reverseForm = (args: { income: number | { id: number } } | [income: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectIncomeController::reverse
* @see app/Http/Controllers/ProjectIncomeController.php:82
* @route '/incomes/{income}/reverse'
*/
reverseForm.post = (args: { income: number | { id: number } } | [income: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

reverse.form = reverseForm

const incomes = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    reverse: Object.assign(reverse, reverse),
}

export default incomes