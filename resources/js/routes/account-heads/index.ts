import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AccountHeadController::index
* @see app/Http/Controllers/AccountHeadController.php:24
* @route '/accounting/chart-of-accounts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/accounting/chart-of-accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AccountHeadController::index
* @see app/Http/Controllers/AccountHeadController.php:24
* @route '/accounting/chart-of-accounts'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountHeadController::index
* @see app/Http/Controllers/AccountHeadController.php:24
* @route '/accounting/chart-of-accounts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccountHeadController::index
* @see app/Http/Controllers/AccountHeadController.php:24
* @route '/accounting/chart-of-accounts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AccountHeadController::index
* @see app/Http/Controllers/AccountHeadController.php:24
* @route '/accounting/chart-of-accounts'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccountHeadController::index
* @see app/Http/Controllers/AccountHeadController.php:24
* @route '/accounting/chart-of-accounts'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccountHeadController::index
* @see app/Http/Controllers/AccountHeadController.php:24
* @route '/accounting/chart-of-accounts'
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
* @see \App\Http\Controllers\AccountHeadController::store
* @see app/Http/Controllers/AccountHeadController.php:55
* @route '/accounting/chart-of-accounts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/accounting/chart-of-accounts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AccountHeadController::store
* @see app/Http/Controllers/AccountHeadController.php:55
* @route '/accounting/chart-of-accounts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountHeadController::store
* @see app/Http/Controllers/AccountHeadController.php:55
* @route '/accounting/chart-of-accounts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccountHeadController::store
* @see app/Http/Controllers/AccountHeadController.php:55
* @route '/accounting/chart-of-accounts'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccountHeadController::store
* @see app/Http/Controllers/AccountHeadController.php:55
* @route '/accounting/chart-of-accounts'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AccountHeadController::update
* @see app/Http/Controllers/AccountHeadController.php:64
* @route '/accounting/chart-of-accounts/{account_head}'
*/
export const update = (args: { account_head: number | { id: number } } | [account_head: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/accounting/chart-of-accounts/{account_head}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\AccountHeadController::update
* @see app/Http/Controllers/AccountHeadController.php:64
* @route '/accounting/chart-of-accounts/{account_head}'
*/
update.url = (args: { account_head: number | { id: number } } | [account_head: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { account_head: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { account_head: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            account_head: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        account_head: typeof args.account_head === 'object'
        ? args.account_head.id
        : args.account_head,
    }

    return update.definition.url
            .replace('{account_head}', parsedArgs.account_head.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountHeadController::update
* @see app/Http/Controllers/AccountHeadController.php:64
* @route '/accounting/chart-of-accounts/{account_head}'
*/
update.put = (args: { account_head: number | { id: number } } | [account_head: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AccountHeadController::update
* @see app/Http/Controllers/AccountHeadController.php:64
* @route '/accounting/chart-of-accounts/{account_head}'
*/
update.patch = (args: { account_head: number | { id: number } } | [account_head: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AccountHeadController::update
* @see app/Http/Controllers/AccountHeadController.php:64
* @route '/accounting/chart-of-accounts/{account_head}'
*/
const updateForm = (args: { account_head: number | { id: number } } | [account_head: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccountHeadController::update
* @see app/Http/Controllers/AccountHeadController.php:64
* @route '/accounting/chart-of-accounts/{account_head}'
*/
updateForm.put = (args: { account_head: number | { id: number } } | [account_head: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccountHeadController::update
* @see app/Http/Controllers/AccountHeadController.php:64
* @route '/accounting/chart-of-accounts/{account_head}'
*/
updateForm.patch = (args: { account_head: number | { id: number } } | [account_head: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\AccountHeadController::destroy
* @see app/Http/Controllers/AccountHeadController.php:73
* @route '/accounting/chart-of-accounts/{account_head}'
*/
export const destroy = (args: { account_head: number | { id: number } } | [account_head: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/accounting/chart-of-accounts/{account_head}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AccountHeadController::destroy
* @see app/Http/Controllers/AccountHeadController.php:73
* @route '/accounting/chart-of-accounts/{account_head}'
*/
destroy.url = (args: { account_head: number | { id: number } } | [account_head: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { account_head: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { account_head: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            account_head: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        account_head: typeof args.account_head === 'object'
        ? args.account_head.id
        : args.account_head,
    }

    return destroy.definition.url
            .replace('{account_head}', parsedArgs.account_head.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountHeadController::destroy
* @see app/Http/Controllers/AccountHeadController.php:73
* @route '/accounting/chart-of-accounts/{account_head}'
*/
destroy.delete = (args: { account_head: number | { id: number } } | [account_head: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AccountHeadController::destroy
* @see app/Http/Controllers/AccountHeadController.php:73
* @route '/accounting/chart-of-accounts/{account_head}'
*/
const destroyForm = (args: { account_head: number | { id: number } } | [account_head: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccountHeadController::destroy
* @see app/Http/Controllers/AccountHeadController.php:73
* @route '/accounting/chart-of-accounts/{account_head}'
*/
destroyForm.delete = (args: { account_head: number | { id: number } } | [account_head: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const accountHeads = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default accountHeads