import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeSalaryController::store
* @see app/Http/Controllers/EmployeeSalaryController.php:18
* @route '/employees/{employee}/salaries'
*/
export const store = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employees/{employee}/salaries',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeSalaryController::store
* @see app/Http/Controllers/EmployeeSalaryController.php:18
* @route '/employees/{employee}/salaries'
*/
store.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { employee: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            employee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.id
        : args.employee,
    }

    return store.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeSalaryController::store
* @see app/Http/Controllers/EmployeeSalaryController.php:18
* @route '/employees/{employee}/salaries'
*/
store.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeSalaryController::store
* @see app/Http/Controllers/EmployeeSalaryController.php:18
* @route '/employees/{employee}/salaries'
*/
const storeForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeSalaryController::store
* @see app/Http/Controllers/EmployeeSalaryController.php:18
* @route '/employees/{employee}/salaries'
*/
storeForm.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\EmployeeSalaryController::destroy
* @see app/Http/Controllers/EmployeeSalaryController.php:27
* @route '/employees/{employee}/salaries/{salary}'
*/
export const destroy = (args: { employee: number | { id: number }, salary: number | { id: number } } | [employee: number | { id: number }, salary: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employees/{employee}/salaries/{salary}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeSalaryController::destroy
* @see app/Http/Controllers/EmployeeSalaryController.php:27
* @route '/employees/{employee}/salaries/{salary}'
*/
destroy.url = (args: { employee: number | { id: number }, salary: number | { id: number } } | [employee: number | { id: number }, salary: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            employee: args[0],
            salary: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.id
        : args.employee,
        salary: typeof args.salary === 'object'
        ? args.salary.id
        : args.salary,
    }

    return destroy.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{salary}', parsedArgs.salary.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeSalaryController::destroy
* @see app/Http/Controllers/EmployeeSalaryController.php:27
* @route '/employees/{employee}/salaries/{salary}'
*/
destroy.delete = (args: { employee: number | { id: number }, salary: number | { id: number } } | [employee: number | { id: number }, salary: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\EmployeeSalaryController::destroy
* @see app/Http/Controllers/EmployeeSalaryController.php:27
* @route '/employees/{employee}/salaries/{salary}'
*/
const destroyForm = (args: { employee: number | { id: number }, salary: number | { id: number } } | [employee: number | { id: number }, salary: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeSalaryController::destroy
* @see app/Http/Controllers/EmployeeSalaryController.php:27
* @route '/employees/{employee}/salaries/{salary}'
*/
destroyForm.delete = (args: { employee: number | { id: number }, salary: number | { id: number } } | [employee: number | { id: number }, salary: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const EmployeeSalaryController = { store, destroy }

export default EmployeeSalaryController