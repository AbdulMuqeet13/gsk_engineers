import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LeaveRequestController::index
* @see app/Http/Controllers/LeaveRequestController.php:27
* @route '/leave'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/leave',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaveRequestController::index
* @see app/Http/Controllers/LeaveRequestController.php:27
* @route '/leave'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveRequestController::index
* @see app/Http/Controllers/LeaveRequestController.php:27
* @route '/leave'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveRequestController::index
* @see app/Http/Controllers/LeaveRequestController.php:27
* @route '/leave'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaveRequestController::index
* @see app/Http/Controllers/LeaveRequestController.php:27
* @route '/leave'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveRequestController::index
* @see app/Http/Controllers/LeaveRequestController.php:27
* @route '/leave'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveRequestController::index
* @see app/Http/Controllers/LeaveRequestController.php:27
* @route '/leave'
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
* @see \App\Http\Controllers\LeaveRequestController::store
* @see app/Http/Controllers/LeaveRequestController.php:64
* @route '/leave'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/leave',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaveRequestController::store
* @see app/Http/Controllers/LeaveRequestController.php:64
* @route '/leave'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveRequestController::store
* @see app/Http/Controllers/LeaveRequestController.php:64
* @route '/leave'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveRequestController::store
* @see app/Http/Controllers/LeaveRequestController.php:64
* @route '/leave'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveRequestController::store
* @see app/Http/Controllers/LeaveRequestController.php:64
* @route '/leave'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\LeaveRequestController::destroy
* @see app/Http/Controllers/LeaveRequestController.php:73
* @route '/leave/{leave_request}'
*/
export const destroy = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/leave/{leave_request}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LeaveRequestController::destroy
* @see app/Http/Controllers/LeaveRequestController.php:73
* @route '/leave/{leave_request}'
*/
destroy.url = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave_request: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { leave_request: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            leave_request: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leave_request: typeof args.leave_request === 'object'
        ? args.leave_request.id
        : args.leave_request,
    }

    return destroy.definition.url
            .replace('{leave_request}', parsedArgs.leave_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveRequestController::destroy
* @see app/Http/Controllers/LeaveRequestController.php:73
* @route '/leave/{leave_request}'
*/
destroy.delete = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\LeaveRequestController::destroy
* @see app/Http/Controllers/LeaveRequestController.php:73
* @route '/leave/{leave_request}'
*/
const destroyForm = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveRequestController::destroy
* @see app/Http/Controllers/LeaveRequestController.php:73
* @route '/leave/{leave_request}'
*/
destroyForm.delete = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\LeaveRequestController::approve
* @see app/Http/Controllers/LeaveRequestController.php:87
* @route '/leave/{leave_request}/approve'
*/
export const approve = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/leave/{leave_request}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaveRequestController::approve
* @see app/Http/Controllers/LeaveRequestController.php:87
* @route '/leave/{leave_request}/approve'
*/
approve.url = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave_request: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { leave_request: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            leave_request: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leave_request: typeof args.leave_request === 'object'
        ? args.leave_request.id
        : args.leave_request,
    }

    return approve.definition.url
            .replace('{leave_request}', parsedArgs.leave_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveRequestController::approve
* @see app/Http/Controllers/LeaveRequestController.php:87
* @route '/leave/{leave_request}/approve'
*/
approve.post = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveRequestController::approve
* @see app/Http/Controllers/LeaveRequestController.php:87
* @route '/leave/{leave_request}/approve'
*/
const approveForm = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveRequestController::approve
* @see app/Http/Controllers/LeaveRequestController.php:87
* @route '/leave/{leave_request}/approve'
*/
approveForm.post = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\LeaveRequestController::reject
* @see app/Http/Controllers/LeaveRequestController.php:101
* @route '/leave/{leave_request}/reject'
*/
export const reject = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/leave/{leave_request}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaveRequestController::reject
* @see app/Http/Controllers/LeaveRequestController.php:101
* @route '/leave/{leave_request}/reject'
*/
reject.url = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave_request: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { leave_request: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            leave_request: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leave_request: typeof args.leave_request === 'object'
        ? args.leave_request.id
        : args.leave_request,
    }

    return reject.definition.url
            .replace('{leave_request}', parsedArgs.leave_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveRequestController::reject
* @see app/Http/Controllers/LeaveRequestController.php:101
* @route '/leave/{leave_request}/reject'
*/
reject.post = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveRequestController::reject
* @see app/Http/Controllers/LeaveRequestController.php:101
* @route '/leave/{leave_request}/reject'
*/
const rejectForm = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveRequestController::reject
* @see app/Http/Controllers/LeaveRequestController.php:101
* @route '/leave/{leave_request}/reject'
*/
rejectForm.post = (args: { leave_request: number | { id: number } } | [leave_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

const LeaveRequestController = { index, store, destroy, approve, reject }

export default LeaveRequestController