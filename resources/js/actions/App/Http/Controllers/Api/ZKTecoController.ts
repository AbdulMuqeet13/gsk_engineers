import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ZKTecoController::init
* @see app/Http/Controllers/Api/ZKTecoController.php:35
* @route '/api/iclock/cdata'
*/
export const init = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: init.url(options),
    method: 'get',
})

init.definition = {
    methods: ["get","head"],
    url: '/api/iclock/cdata',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ZKTecoController::init
* @see app/Http/Controllers/Api/ZKTecoController.php:35
* @route '/api/iclock/cdata'
*/
init.url = (options?: RouteQueryOptions) => {
    return init.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ZKTecoController::init
* @see app/Http/Controllers/Api/ZKTecoController.php:35
* @route '/api/iclock/cdata'
*/
init.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: init.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ZKTecoController::init
* @see app/Http/Controllers/Api/ZKTecoController.php:35
* @route '/api/iclock/cdata'
*/
init.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: init.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ZKTecoController::init
* @see app/Http/Controllers/Api/ZKTecoController.php:35
* @route '/api/iclock/cdata'
*/
const initForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: init.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ZKTecoController::init
* @see app/Http/Controllers/Api/ZKTecoController.php:35
* @route '/api/iclock/cdata'
*/
initForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: init.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ZKTecoController::init
* @see app/Http/Controllers/Api/ZKTecoController.php:35
* @route '/api/iclock/cdata'
*/
initForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: init.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

init.form = initForm

/**
* @see \App\Http\Controllers\Api\ZKTecoController::push
* @see app/Http/Controllers/Api/ZKTecoController.php:77
* @route '/api/iclock/cdata'
*/
export const push = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: push.url(options),
    method: 'post',
})

push.definition = {
    methods: ["post"],
    url: '/api/iclock/cdata',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ZKTecoController::push
* @see app/Http/Controllers/Api/ZKTecoController.php:77
* @route '/api/iclock/cdata'
*/
push.url = (options?: RouteQueryOptions) => {
    return push.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ZKTecoController::push
* @see app/Http/Controllers/Api/ZKTecoController.php:77
* @route '/api/iclock/cdata'
*/
push.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: push.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ZKTecoController::push
* @see app/Http/Controllers/Api/ZKTecoController.php:77
* @route '/api/iclock/cdata'
*/
const pushForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: push.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ZKTecoController::push
* @see app/Http/Controllers/Api/ZKTecoController.php:77
* @route '/api/iclock/cdata'
*/
pushForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: push.url(options),
    method: 'post',
})

push.form = pushForm

/**
* @see \App\Http\Controllers\Api\ZKTecoController::getRequest
* @see app/Http/Controllers/Api/ZKTecoController.php:141
* @route '/api/iclock/getrequest'
*/
export const getRequest = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRequest.url(options),
    method: 'get',
})

getRequest.definition = {
    methods: ["get","head"],
    url: '/api/iclock/getrequest',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ZKTecoController::getRequest
* @see app/Http/Controllers/Api/ZKTecoController.php:141
* @route '/api/iclock/getrequest'
*/
getRequest.url = (options?: RouteQueryOptions) => {
    return getRequest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ZKTecoController::getRequest
* @see app/Http/Controllers/Api/ZKTecoController.php:141
* @route '/api/iclock/getrequest'
*/
getRequest.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRequest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ZKTecoController::getRequest
* @see app/Http/Controllers/Api/ZKTecoController.php:141
* @route '/api/iclock/getrequest'
*/
getRequest.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRequest.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ZKTecoController::getRequest
* @see app/Http/Controllers/Api/ZKTecoController.php:141
* @route '/api/iclock/getrequest'
*/
const getRequestForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getRequest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ZKTecoController::getRequest
* @see app/Http/Controllers/Api/ZKTecoController.php:141
* @route '/api/iclock/getrequest'
*/
getRequestForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getRequest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ZKTecoController::getRequest
* @see app/Http/Controllers/Api/ZKTecoController.php:141
* @route '/api/iclock/getrequest'
*/
getRequestForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getRequest.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getRequest.form = getRequestForm

/**
* @see \App\Http\Controllers\Api\ZKTecoController::deviceCmd
* @see app/Http/Controllers/Api/ZKTecoController.php:184
* @route '/api/iclock/devicecmd'
*/
export const deviceCmd = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deviceCmd.url(options),
    method: 'post',
})

deviceCmd.definition = {
    methods: ["post"],
    url: '/api/iclock/devicecmd',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ZKTecoController::deviceCmd
* @see app/Http/Controllers/Api/ZKTecoController.php:184
* @route '/api/iclock/devicecmd'
*/
deviceCmd.url = (options?: RouteQueryOptions) => {
    return deviceCmd.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ZKTecoController::deviceCmd
* @see app/Http/Controllers/Api/ZKTecoController.php:184
* @route '/api/iclock/devicecmd'
*/
deviceCmd.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deviceCmd.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ZKTecoController::deviceCmd
* @see app/Http/Controllers/Api/ZKTecoController.php:184
* @route '/api/iclock/devicecmd'
*/
const deviceCmdForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deviceCmd.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ZKTecoController::deviceCmd
* @see app/Http/Controllers/Api/ZKTecoController.php:184
* @route '/api/iclock/devicecmd'
*/
deviceCmdForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deviceCmd.url(options),
    method: 'post',
})

deviceCmd.form = deviceCmdForm

const ZKTecoController = { init, push, getRequest, deviceCmd }

export default ZKTecoController