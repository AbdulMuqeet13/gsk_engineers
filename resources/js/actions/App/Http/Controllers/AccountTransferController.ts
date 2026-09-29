import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AccountTransferController::index
* @see app/Http/Controllers/AccountTransferController.php:24
* @route '/account-transfers'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/account-transfers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AccountTransferController::index
* @see app/Http/Controllers/AccountTransferController.php:24
* @route '/account-transfers'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountTransferController::index
* @see app/Http/Controllers/AccountTransferController.php:24
* @route '/account-transfers'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccountTransferController::index
* @see app/Http/Controllers/AccountTransferController.php:24
* @route '/account-transfers'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AccountTransferController::index
* @see app/Http/Controllers/AccountTransferController.php:24
* @route '/account-transfers'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccountTransferController::index
* @see app/Http/Controllers/AccountTransferController.php:24
* @route '/account-transfers'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AccountTransferController::index
* @see app/Http/Controllers/AccountTransferController.php:24
* @route '/account-transfers'
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
* @see \App\Http\Controllers\AccountTransferController::store
* @see app/Http/Controllers/AccountTransferController.php:69
* @route '/account-transfers'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/account-transfers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AccountTransferController::store
* @see app/Http/Controllers/AccountTransferController.php:69
* @route '/account-transfers'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountTransferController::store
* @see app/Http/Controllers/AccountTransferController.php:69
* @route '/account-transfers'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccountTransferController::store
* @see app/Http/Controllers/AccountTransferController.php:69
* @route '/account-transfers'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccountTransferController::store
* @see app/Http/Controllers/AccountTransferController.php:69
* @route '/account-transfers'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AccountTransferController::reverse
* @see app/Http/Controllers/AccountTransferController.php:78
* @route '/account-transfers/{account_transfer}/reverse'
*/
export const reverse = (args: { account_transfer: number | { id: number } } | [account_transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

reverse.definition = {
    methods: ["post"],
    url: '/account-transfers/{account_transfer}/reverse',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AccountTransferController::reverse
* @see app/Http/Controllers/AccountTransferController.php:78
* @route '/account-transfers/{account_transfer}/reverse'
*/
reverse.url = (args: { account_transfer: number | { id: number } } | [account_transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { account_transfer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { account_transfer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            account_transfer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        account_transfer: typeof args.account_transfer === 'object'
        ? args.account_transfer.id
        : args.account_transfer,
    }

    return reverse.definition.url
            .replace('{account_transfer}', parsedArgs.account_transfer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountTransferController::reverse
* @see app/Http/Controllers/AccountTransferController.php:78
* @route '/account-transfers/{account_transfer}/reverse'
*/
reverse.post = (args: { account_transfer: number | { id: number } } | [account_transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccountTransferController::reverse
* @see app/Http/Controllers/AccountTransferController.php:78
* @route '/account-transfers/{account_transfer}/reverse'
*/
const reverseForm = (args: { account_transfer: number | { id: number } } | [account_transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AccountTransferController::reverse
* @see app/Http/Controllers/AccountTransferController.php:78
* @route '/account-transfers/{account_transfer}/reverse'
*/
reverseForm.post = (args: { account_transfer: number | { id: number } } | [account_transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

reverse.form = reverseForm

const AccountTransferController = { index, store, reverse }

export default AccountTransferController