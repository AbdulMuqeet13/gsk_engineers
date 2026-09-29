import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SalaryComponentController::index
* @see app/Http/Controllers/SalaryComponentController.php:22
* @route '/payroll/salary-components'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payroll/salary-components',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SalaryComponentController::index
* @see app/Http/Controllers/SalaryComponentController.php:22
* @route '/payroll/salary-components'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalaryComponentController::index
* @see app/Http/Controllers/SalaryComponentController.php:22
* @route '/payroll/salary-components'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalaryComponentController::index
* @see app/Http/Controllers/SalaryComponentController.php:22
* @route '/payroll/salary-components'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SalaryComponentController::index
* @see app/Http/Controllers/SalaryComponentController.php:22
* @route '/payroll/salary-components'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalaryComponentController::index
* @see app/Http/Controllers/SalaryComponentController.php:22
* @route '/payroll/salary-components'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalaryComponentController::index
* @see app/Http/Controllers/SalaryComponentController.php:22
* @route '/payroll/salary-components'
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
* @see \App\Http\Controllers\SalaryComponentController::store
* @see app/Http/Controllers/SalaryComponentController.php:31
* @route '/payroll/salary-components'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payroll/salary-components',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SalaryComponentController::store
* @see app/Http/Controllers/SalaryComponentController.php:31
* @route '/payroll/salary-components'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalaryComponentController::store
* @see app/Http/Controllers/SalaryComponentController.php:31
* @route '/payroll/salary-components'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SalaryComponentController::store
* @see app/Http/Controllers/SalaryComponentController.php:31
* @route '/payroll/salary-components'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SalaryComponentController::store
* @see app/Http/Controllers/SalaryComponentController.php:31
* @route '/payroll/salary-components'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\SalaryComponentController::update
* @see app/Http/Controllers/SalaryComponentController.php:40
* @route '/payroll/salary-components/{salary_component}'
*/
export const update = (args: { salary_component: number | { id: number } } | [salary_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/payroll/salary-components/{salary_component}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\SalaryComponentController::update
* @see app/Http/Controllers/SalaryComponentController.php:40
* @route '/payroll/salary-components/{salary_component}'
*/
update.url = (args: { salary_component: number | { id: number } } | [salary_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { salary_component: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { salary_component: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            salary_component: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        salary_component: typeof args.salary_component === 'object'
        ? args.salary_component.id
        : args.salary_component,
    }

    return update.definition.url
            .replace('{salary_component}', parsedArgs.salary_component.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalaryComponentController::update
* @see app/Http/Controllers/SalaryComponentController.php:40
* @route '/payroll/salary-components/{salary_component}'
*/
update.put = (args: { salary_component: number | { id: number } } | [salary_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\SalaryComponentController::update
* @see app/Http/Controllers/SalaryComponentController.php:40
* @route '/payroll/salary-components/{salary_component}'
*/
update.patch = (args: { salary_component: number | { id: number } } | [salary_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\SalaryComponentController::update
* @see app/Http/Controllers/SalaryComponentController.php:40
* @route '/payroll/salary-components/{salary_component}'
*/
const updateForm = (args: { salary_component: number | { id: number } } | [salary_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SalaryComponentController::update
* @see app/Http/Controllers/SalaryComponentController.php:40
* @route '/payroll/salary-components/{salary_component}'
*/
updateForm.put = (args: { salary_component: number | { id: number } } | [salary_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SalaryComponentController::update
* @see app/Http/Controllers/SalaryComponentController.php:40
* @route '/payroll/salary-components/{salary_component}'
*/
updateForm.patch = (args: { salary_component: number | { id: number } } | [salary_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\SalaryComponentController::destroy
* @see app/Http/Controllers/SalaryComponentController.php:49
* @route '/payroll/salary-components/{salary_component}'
*/
export const destroy = (args: { salary_component: number | { id: number } } | [salary_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/payroll/salary-components/{salary_component}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SalaryComponentController::destroy
* @see app/Http/Controllers/SalaryComponentController.php:49
* @route '/payroll/salary-components/{salary_component}'
*/
destroy.url = (args: { salary_component: number | { id: number } } | [salary_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { salary_component: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { salary_component: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            salary_component: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        salary_component: typeof args.salary_component === 'object'
        ? args.salary_component.id
        : args.salary_component,
    }

    return destroy.definition.url
            .replace('{salary_component}', parsedArgs.salary_component.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalaryComponentController::destroy
* @see app/Http/Controllers/SalaryComponentController.php:49
* @route '/payroll/salary-components/{salary_component}'
*/
destroy.delete = (args: { salary_component: number | { id: number } } | [salary_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\SalaryComponentController::destroy
* @see app/Http/Controllers/SalaryComponentController.php:49
* @route '/payroll/salary-components/{salary_component}'
*/
const destroyForm = (args: { salary_component: number | { id: number } } | [salary_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SalaryComponentController::destroy
* @see app/Http/Controllers/SalaryComponentController.php:49
* @route '/payroll/salary-components/{salary_component}'
*/
destroyForm.delete = (args: { salary_component: number | { id: number } } | [salary_component: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const SalaryComponentController = { index, store, update, destroy }

export default SalaryComponentController