import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ProjectAssignmentController::index
* @see app/Http/Controllers/ProjectAssignmentController.php:23
* @route '/projects/assignments'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/assignments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectAssignmentController::index
* @see app/Http/Controllers/ProjectAssignmentController.php:23
* @route '/projects/assignments'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectAssignmentController::index
* @see app/Http/Controllers/ProjectAssignmentController.php:23
* @route '/projects/assignments'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectAssignmentController::index
* @see app/Http/Controllers/ProjectAssignmentController.php:23
* @route '/projects/assignments'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProjectAssignmentController::index
* @see app/Http/Controllers/ProjectAssignmentController.php:23
* @route '/projects/assignments'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectAssignmentController::index
* @see app/Http/Controllers/ProjectAssignmentController.php:23
* @route '/projects/assignments'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectAssignmentController::index
* @see app/Http/Controllers/ProjectAssignmentController.php:23
* @route '/projects/assignments'
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
* @see \App\Http\Controllers\ProjectAssignmentController::store
* @see app/Http/Controllers/ProjectAssignmentController.php:49
* @route '/projects/assignments'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/assignments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProjectAssignmentController::store
* @see app/Http/Controllers/ProjectAssignmentController.php:49
* @route '/projects/assignments'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectAssignmentController::store
* @see app/Http/Controllers/ProjectAssignmentController.php:49
* @route '/projects/assignments'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectAssignmentController::store
* @see app/Http/Controllers/ProjectAssignmentController.php:49
* @route '/projects/assignments'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectAssignmentController::store
* @see app/Http/Controllers/ProjectAssignmentController.php:49
* @route '/projects/assignments'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ProjectAssignmentController::update
* @see app/Http/Controllers/ProjectAssignmentController.php:58
* @route '/projects/assignments/{assignment}'
*/
export const update = (args: { assignment: number | { id: number } } | [assignment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/projects/assignments/{assignment}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ProjectAssignmentController::update
* @see app/Http/Controllers/ProjectAssignmentController.php:58
* @route '/projects/assignments/{assignment}'
*/
update.url = (args: { assignment: number | { id: number } } | [assignment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assignment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { assignment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            assignment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        assignment: typeof args.assignment === 'object'
        ? args.assignment.id
        : args.assignment,
    }

    return update.definition.url
            .replace('{assignment}', parsedArgs.assignment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectAssignmentController::update
* @see app/Http/Controllers/ProjectAssignmentController.php:58
* @route '/projects/assignments/{assignment}'
*/
update.put = (args: { assignment: number | { id: number } } | [assignment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ProjectAssignmentController::update
* @see app/Http/Controllers/ProjectAssignmentController.php:58
* @route '/projects/assignments/{assignment}'
*/
update.patch = (args: { assignment: number | { id: number } } | [assignment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ProjectAssignmentController::update
* @see app/Http/Controllers/ProjectAssignmentController.php:58
* @route '/projects/assignments/{assignment}'
*/
const updateForm = (args: { assignment: number | { id: number } } | [assignment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectAssignmentController::update
* @see app/Http/Controllers/ProjectAssignmentController.php:58
* @route '/projects/assignments/{assignment}'
*/
updateForm.put = (args: { assignment: number | { id: number } } | [assignment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectAssignmentController::update
* @see app/Http/Controllers/ProjectAssignmentController.php:58
* @route '/projects/assignments/{assignment}'
*/
updateForm.patch = (args: { assignment: number | { id: number } } | [assignment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ProjectAssignmentController::destroy
* @see app/Http/Controllers/ProjectAssignmentController.php:67
* @route '/projects/assignments/{assignment}'
*/
export const destroy = (args: { assignment: number | { id: number } } | [assignment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/assignments/{assignment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProjectAssignmentController::destroy
* @see app/Http/Controllers/ProjectAssignmentController.php:67
* @route '/projects/assignments/{assignment}'
*/
destroy.url = (args: { assignment: number | { id: number } } | [assignment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assignment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { assignment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            assignment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        assignment: typeof args.assignment === 'object'
        ? args.assignment.id
        : args.assignment,
    }

    return destroy.definition.url
            .replace('{assignment}', parsedArgs.assignment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectAssignmentController::destroy
* @see app/Http/Controllers/ProjectAssignmentController.php:67
* @route '/projects/assignments/{assignment}'
*/
destroy.delete = (args: { assignment: number | { id: number } } | [assignment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ProjectAssignmentController::destroy
* @see app/Http/Controllers/ProjectAssignmentController.php:67
* @route '/projects/assignments/{assignment}'
*/
const destroyForm = (args: { assignment: number | { id: number } } | [assignment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectAssignmentController::destroy
* @see app/Http/Controllers/ProjectAssignmentController.php:67
* @route '/projects/assignments/{assignment}'
*/
destroyForm.delete = (args: { assignment: number | { id: number } } | [assignment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const projectAssignments = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default projectAssignments