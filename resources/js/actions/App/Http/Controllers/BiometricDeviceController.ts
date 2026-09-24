import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BiometricDeviceController::index
* @see app/Http/Controllers/BiometricDeviceController.php:18
* @route '/biometric-devices'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/biometric-devices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BiometricDeviceController::index
* @see app/Http/Controllers/BiometricDeviceController.php:18
* @route '/biometric-devices'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiometricDeviceController::index
* @see app/Http/Controllers/BiometricDeviceController.php:18
* @route '/biometric-devices'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BiometricDeviceController::index
* @see app/Http/Controllers/BiometricDeviceController.php:18
* @route '/biometric-devices'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BiometricDeviceController::index
* @see app/Http/Controllers/BiometricDeviceController.php:18
* @route '/biometric-devices'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BiometricDeviceController::index
* @see app/Http/Controllers/BiometricDeviceController.php:18
* @route '/biometric-devices'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BiometricDeviceController::index
* @see app/Http/Controllers/BiometricDeviceController.php:18
* @route '/biometric-devices'
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
* @see \App\Http\Controllers\BiometricDeviceController::store
* @see app/Http/Controllers/BiometricDeviceController.php:41
* @route '/biometric-devices'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/biometric-devices',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BiometricDeviceController::store
* @see app/Http/Controllers/BiometricDeviceController.php:41
* @route '/biometric-devices'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiometricDeviceController::store
* @see app/Http/Controllers/BiometricDeviceController.php:41
* @route '/biometric-devices'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiometricDeviceController::store
* @see app/Http/Controllers/BiometricDeviceController.php:41
* @route '/biometric-devices'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiometricDeviceController::store
* @see app/Http/Controllers/BiometricDeviceController.php:41
* @route '/biometric-devices'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\BiometricDeviceController::update
* @see app/Http/Controllers/BiometricDeviceController.php:50
* @route '/biometric-devices/{biometric_device}'
*/
export const update = (args: { biometric_device: number | { id: number } } | [biometric_device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/biometric-devices/{biometric_device}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\BiometricDeviceController::update
* @see app/Http/Controllers/BiometricDeviceController.php:50
* @route '/biometric-devices/{biometric_device}'
*/
update.url = (args: { biometric_device: number | { id: number } } | [biometric_device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { biometric_device: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { biometric_device: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            biometric_device: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        biometric_device: typeof args.biometric_device === 'object'
        ? args.biometric_device.id
        : args.biometric_device,
    }

    return update.definition.url
            .replace('{biometric_device}', parsedArgs.biometric_device.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiometricDeviceController::update
* @see app/Http/Controllers/BiometricDeviceController.php:50
* @route '/biometric-devices/{biometric_device}'
*/
update.put = (args: { biometric_device: number | { id: number } } | [biometric_device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\BiometricDeviceController::update
* @see app/Http/Controllers/BiometricDeviceController.php:50
* @route '/biometric-devices/{biometric_device}'
*/
update.patch = (args: { biometric_device: number | { id: number } } | [biometric_device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\BiometricDeviceController::update
* @see app/Http/Controllers/BiometricDeviceController.php:50
* @route '/biometric-devices/{biometric_device}'
*/
const updateForm = (args: { biometric_device: number | { id: number } } | [biometric_device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiometricDeviceController::update
* @see app/Http/Controllers/BiometricDeviceController.php:50
* @route '/biometric-devices/{biometric_device}'
*/
updateForm.put = (args: { biometric_device: number | { id: number } } | [biometric_device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiometricDeviceController::update
* @see app/Http/Controllers/BiometricDeviceController.php:50
* @route '/biometric-devices/{biometric_device}'
*/
updateForm.patch = (args: { biometric_device: number | { id: number } } | [biometric_device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\BiometricDeviceController::destroy
* @see app/Http/Controllers/BiometricDeviceController.php:59
* @route '/biometric-devices/{biometric_device}'
*/
export const destroy = (args: { biometric_device: number | { id: number } } | [biometric_device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/biometric-devices/{biometric_device}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BiometricDeviceController::destroy
* @see app/Http/Controllers/BiometricDeviceController.php:59
* @route '/biometric-devices/{biometric_device}'
*/
destroy.url = (args: { biometric_device: number | { id: number } } | [biometric_device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { biometric_device: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { biometric_device: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            biometric_device: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        biometric_device: typeof args.biometric_device === 'object'
        ? args.biometric_device.id
        : args.biometric_device,
    }

    return destroy.definition.url
            .replace('{biometric_device}', parsedArgs.biometric_device.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiometricDeviceController::destroy
* @see app/Http/Controllers/BiometricDeviceController.php:59
* @route '/biometric-devices/{biometric_device}'
*/
destroy.delete = (args: { biometric_device: number | { id: number } } | [biometric_device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\BiometricDeviceController::destroy
* @see app/Http/Controllers/BiometricDeviceController.php:59
* @route '/biometric-devices/{biometric_device}'
*/
const destroyForm = (args: { biometric_device: number | { id: number } } | [biometric_device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiometricDeviceController::destroy
* @see app/Http/Controllers/BiometricDeviceController.php:59
* @route '/biometric-devices/{biometric_device}'
*/
destroyForm.delete = (args: { biometric_device: number | { id: number } } | [biometric_device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const BiometricDeviceController = { index, store, update, destroy }

export default BiometricDeviceController