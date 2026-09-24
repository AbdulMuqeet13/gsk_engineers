import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BiometricEnrollmentController::store
* @see app/Http/Controllers/BiometricEnrollmentController.php:16
* @route '/employees/{employee}/enroll'
*/
export const store = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employees/{employee}/enroll',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BiometricEnrollmentController::store
* @see app/Http/Controllers/BiometricEnrollmentController.php:16
* @route '/employees/{employee}/enroll'
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
* @see \App\Http\Controllers\BiometricEnrollmentController::store
* @see app/Http/Controllers/BiometricEnrollmentController.php:16
* @route '/employees/{employee}/enroll'
*/
store.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiometricEnrollmentController::store
* @see app/Http/Controllers/BiometricEnrollmentController.php:16
* @route '/employees/{employee}/enroll'
*/
const storeForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiometricEnrollmentController::store
* @see app/Http/Controllers/BiometricEnrollmentController.php:16
* @route '/employees/{employee}/enroll'
*/
storeForm.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\BiometricEnrollmentController::destroy
* @see app/Http/Controllers/BiometricEnrollmentController.php:45
* @route '/employee-fingerprints/{fingerprint}'
*/
export const destroy = (args: { fingerprint: number | { id: number } } | [fingerprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employee-fingerprints/{fingerprint}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BiometricEnrollmentController::destroy
* @see app/Http/Controllers/BiometricEnrollmentController.php:45
* @route '/employee-fingerprints/{fingerprint}'
*/
destroy.url = (args: { fingerprint: number | { id: number } } | [fingerprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fingerprint: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { fingerprint: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            fingerprint: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fingerprint: typeof args.fingerprint === 'object'
        ? args.fingerprint.id
        : args.fingerprint,
    }

    return destroy.definition.url
            .replace('{fingerprint}', parsedArgs.fingerprint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiometricEnrollmentController::destroy
* @see app/Http/Controllers/BiometricEnrollmentController.php:45
* @route '/employee-fingerprints/{fingerprint}'
*/
destroy.delete = (args: { fingerprint: number | { id: number } } | [fingerprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\BiometricEnrollmentController::destroy
* @see app/Http/Controllers/BiometricEnrollmentController.php:45
* @route '/employee-fingerprints/{fingerprint}'
*/
const destroyForm = (args: { fingerprint: number | { id: number } } | [fingerprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiometricEnrollmentController::destroy
* @see app/Http/Controllers/BiometricEnrollmentController.php:45
* @route '/employee-fingerprints/{fingerprint}'
*/
destroyForm.delete = (args: { fingerprint: number | { id: number } } | [fingerprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const BiometricEnrollmentController = { store, destroy }

export default BiometricEnrollmentController