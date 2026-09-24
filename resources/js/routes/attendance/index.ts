import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AttendanceController::index
* @see app/Http/Controllers/AttendanceController.php:24
* @route '/attendance'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::index
* @see app/Http/Controllers/AttendanceController.php:24
* @route '/attendance'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::index
* @see app/Http/Controllers/AttendanceController.php:24
* @route '/attendance'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttendanceController::index
* @see app/Http/Controllers/AttendanceController.php:24
* @route '/attendance'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AttendanceController::index
* @see app/Http/Controllers/AttendanceController.php:24
* @route '/attendance'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttendanceController::index
* @see app/Http/Controllers/AttendanceController.php:24
* @route '/attendance'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttendanceController::index
* @see app/Http/Controllers/AttendanceController.php:24
* @route '/attendance'
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
* @see \App\Http\Controllers\AttendanceController::store
* @see app/Http/Controllers/AttendanceController.php:61
* @route '/attendance'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/attendance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::store
* @see app/Http/Controllers/AttendanceController.php:61
* @route '/attendance'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::store
* @see app/Http/Controllers/AttendanceController.php:61
* @route '/attendance'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AttendanceController::store
* @see app/Http/Controllers/AttendanceController.php:61
* @route '/attendance'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AttendanceController::store
* @see app/Http/Controllers/AttendanceController.php:61
* @route '/attendance'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AttendanceController::update
* @see app/Http/Controllers/AttendanceController.php:72
* @route '/attendance/{attendance}'
*/
export const update = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/attendance/{attendance}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\AttendanceController::update
* @see app/Http/Controllers/AttendanceController.php:72
* @route '/attendance/{attendance}'
*/
update.url = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attendance: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { attendance: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            attendance: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        attendance: typeof args.attendance === 'object'
        ? args.attendance.id
        : args.attendance,
    }

    return update.definition.url
            .replace('{attendance}', parsedArgs.attendance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::update
* @see app/Http/Controllers/AttendanceController.php:72
* @route '/attendance/{attendance}'
*/
update.put = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AttendanceController::update
* @see app/Http/Controllers/AttendanceController.php:72
* @route '/attendance/{attendance}'
*/
update.patch = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AttendanceController::update
* @see app/Http/Controllers/AttendanceController.php:72
* @route '/attendance/{attendance}'
*/
const updateForm = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AttendanceController::update
* @see app/Http/Controllers/AttendanceController.php:72
* @route '/attendance/{attendance}'
*/
updateForm.put = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AttendanceController::update
* @see app/Http/Controllers/AttendanceController.php:72
* @route '/attendance/{attendance}'
*/
updateForm.patch = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AttendanceController::destroy
* @see app/Http/Controllers/AttendanceController.php:83
* @route '/attendance/{attendance}'
*/
export const destroy = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/attendance/{attendance}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AttendanceController::destroy
* @see app/Http/Controllers/AttendanceController.php:83
* @route '/attendance/{attendance}'
*/
destroy.url = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attendance: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { attendance: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            attendance: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        attendance: typeof args.attendance === 'object'
        ? args.attendance.id
        : args.attendance,
    }

    return destroy.definition.url
            .replace('{attendance}', parsedArgs.attendance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::destroy
* @see app/Http/Controllers/AttendanceController.php:83
* @route '/attendance/{attendance}'
*/
destroy.delete = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AttendanceController::destroy
* @see app/Http/Controllers/AttendanceController.php:83
* @route '/attendance/{attendance}'
*/
const destroyForm = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AttendanceController::destroy
* @see app/Http/Controllers/AttendanceController.php:83
* @route '/attendance/{attendance}'
*/
destroyForm.delete = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const attendance = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default attendance