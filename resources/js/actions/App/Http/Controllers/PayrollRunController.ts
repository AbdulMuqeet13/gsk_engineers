import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PayrollRunController::index
* @see app/Http/Controllers/PayrollRunController.php:33
* @route '/payroll'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payroll',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollRunController::index
* @see app/Http/Controllers/PayrollRunController.php:33
* @route '/payroll'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollRunController::index
* @see app/Http/Controllers/PayrollRunController.php:33
* @route '/payroll'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollRunController::index
* @see app/Http/Controllers/PayrollRunController.php:33
* @route '/payroll'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PayrollRunController::index
* @see app/Http/Controllers/PayrollRunController.php:33
* @route '/payroll'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollRunController::index
* @see app/Http/Controllers/PayrollRunController.php:33
* @route '/payroll'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollRunController::index
* @see app/Http/Controllers/PayrollRunController.php:33
* @route '/payroll'
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
* @see \App\Http\Controllers\PayrollRunController::store
* @see app/Http/Controllers/PayrollRunController.php:88
* @route '/payroll'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payroll',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollRunController::store
* @see app/Http/Controllers/PayrollRunController.php:88
* @route '/payroll'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollRunController::store
* @see app/Http/Controllers/PayrollRunController.php:88
* @route '/payroll'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PayrollRunController::store
* @see app/Http/Controllers/PayrollRunController.php:88
* @route '/payroll'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PayrollRunController::store
* @see app/Http/Controllers/PayrollRunController.php:88
* @route '/payroll'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PayrollRunController::show
* @see app/Http/Controllers/PayrollRunController.php:71
* @route '/payroll/{payroll_run}'
*/
export const show = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/payroll/{payroll_run}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollRunController::show
* @see app/Http/Controllers/PayrollRunController.php:71
* @route '/payroll/{payroll_run}'
*/
show.url = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll_run: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payroll_run: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payroll_run: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payroll_run: typeof args.payroll_run === 'object'
        ? args.payroll_run.id
        : args.payroll_run,
    }

    return show.definition.url
            .replace('{payroll_run}', parsedArgs.payroll_run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollRunController::show
* @see app/Http/Controllers/PayrollRunController.php:71
* @route '/payroll/{payroll_run}'
*/
show.get = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollRunController::show
* @see app/Http/Controllers/PayrollRunController.php:71
* @route '/payroll/{payroll_run}'
*/
show.head = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PayrollRunController::show
* @see app/Http/Controllers/PayrollRunController.php:71
* @route '/payroll/{payroll_run}'
*/
const showForm = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollRunController::show
* @see app/Http/Controllers/PayrollRunController.php:71
* @route '/payroll/{payroll_run}'
*/
showForm.get = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollRunController::show
* @see app/Http/Controllers/PayrollRunController.php:71
* @route '/payroll/{payroll_run}'
*/
showForm.head = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\PayrollRunController::destroy
* @see app/Http/Controllers/PayrollRunController.php:97
* @route '/payroll/{payroll_run}'
*/
export const destroy = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/payroll/{payroll_run}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PayrollRunController::destroy
* @see app/Http/Controllers/PayrollRunController.php:97
* @route '/payroll/{payroll_run}'
*/
destroy.url = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll_run: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payroll_run: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payroll_run: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payroll_run: typeof args.payroll_run === 'object'
        ? args.payroll_run.id
        : args.payroll_run,
    }

    return destroy.definition.url
            .replace('{payroll_run}', parsedArgs.payroll_run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollRunController::destroy
* @see app/Http/Controllers/PayrollRunController.php:97
* @route '/payroll/{payroll_run}'
*/
destroy.delete = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PayrollRunController::destroy
* @see app/Http/Controllers/PayrollRunController.php:97
* @route '/payroll/{payroll_run}'
*/
const destroyForm = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PayrollRunController::destroy
* @see app/Http/Controllers/PayrollRunController.php:97
* @route '/payroll/{payroll_run}'
*/
destroyForm.delete = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PayrollRunController::submit
* @see app/Http/Controllers/PayrollRunController.php:111
* @route '/payroll/{payroll_run}/submit'
*/
export const submit = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/payroll/{payroll_run}/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollRunController::submit
* @see app/Http/Controllers/PayrollRunController.php:111
* @route '/payroll/{payroll_run}/submit'
*/
submit.url = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll_run: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payroll_run: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payroll_run: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payroll_run: typeof args.payroll_run === 'object'
        ? args.payroll_run.id
        : args.payroll_run,
    }

    return submit.definition.url
            .replace('{payroll_run}', parsedArgs.payroll_run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollRunController::submit
* @see app/Http/Controllers/PayrollRunController.php:111
* @route '/payroll/{payroll_run}/submit'
*/
submit.post = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PayrollRunController::submit
* @see app/Http/Controllers/PayrollRunController.php:111
* @route '/payroll/{payroll_run}/submit'
*/
const submitForm = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PayrollRunController::submit
* @see app/Http/Controllers/PayrollRunController.php:111
* @route '/payroll/{payroll_run}/submit'
*/
submitForm.post = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submit.url(args, options),
    method: 'post',
})

submit.form = submitForm

/**
* @see \App\Http\Controllers\PayrollRunController::approve
* @see app/Http/Controllers/PayrollRunController.php:125
* @route '/payroll/{payroll_run}/approve'
*/
export const approve = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/payroll/{payroll_run}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollRunController::approve
* @see app/Http/Controllers/PayrollRunController.php:125
* @route '/payroll/{payroll_run}/approve'
*/
approve.url = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll_run: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payroll_run: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payroll_run: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payroll_run: typeof args.payroll_run === 'object'
        ? args.payroll_run.id
        : args.payroll_run,
    }

    return approve.definition.url
            .replace('{payroll_run}', parsedArgs.payroll_run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollRunController::approve
* @see app/Http/Controllers/PayrollRunController.php:125
* @route '/payroll/{payroll_run}/approve'
*/
approve.post = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PayrollRunController::approve
* @see app/Http/Controllers/PayrollRunController.php:125
* @route '/payroll/{payroll_run}/approve'
*/
const approveForm = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PayrollRunController::approve
* @see app/Http/Controllers/PayrollRunController.php:125
* @route '/payroll/{payroll_run}/approve'
*/
approveForm.post = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\PayrollRunController::reject
* @see app/Http/Controllers/PayrollRunController.php:139
* @route '/payroll/{payroll_run}/reject'
*/
export const reject = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/payroll/{payroll_run}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollRunController::reject
* @see app/Http/Controllers/PayrollRunController.php:139
* @route '/payroll/{payroll_run}/reject'
*/
reject.url = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll_run: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payroll_run: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payroll_run: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payroll_run: typeof args.payroll_run === 'object'
        ? args.payroll_run.id
        : args.payroll_run,
    }

    return reject.definition.url
            .replace('{payroll_run}', parsedArgs.payroll_run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollRunController::reject
* @see app/Http/Controllers/PayrollRunController.php:139
* @route '/payroll/{payroll_run}/reject'
*/
reject.post = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PayrollRunController::reject
* @see app/Http/Controllers/PayrollRunController.php:139
* @route '/payroll/{payroll_run}/reject'
*/
const rejectForm = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PayrollRunController::reject
* @see app/Http/Controllers/PayrollRunController.php:139
* @route '/payroll/{payroll_run}/reject'
*/
rejectForm.post = (args: { payroll_run: number | { id: number } } | [payroll_run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

/**
* @see \App\Http\Controllers\PayrollRunController::updatePayslip
* @see app/Http/Controllers/PayrollRunController.php:153
* @route '/payroll/{payroll_run}/payslips/{payslip}'
*/
export const updatePayslip = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePayslip.url(args, options),
    method: 'put',
})

updatePayslip.definition = {
    methods: ["put"],
    url: '/payroll/{payroll_run}/payslips/{payslip}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PayrollRunController::updatePayslip
* @see app/Http/Controllers/PayrollRunController.php:153
* @route '/payroll/{payroll_run}/payslips/{payslip}'
*/
updatePayslip.url = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            payroll_run: args[0],
            payslip: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payroll_run: typeof args.payroll_run === 'object'
        ? args.payroll_run.id
        : args.payroll_run,
        payslip: typeof args.payslip === 'object'
        ? args.payslip.id
        : args.payslip,
    }

    return updatePayslip.definition.url
            .replace('{payroll_run}', parsedArgs.payroll_run.toString())
            .replace('{payslip}', parsedArgs.payslip.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollRunController::updatePayslip
* @see app/Http/Controllers/PayrollRunController.php:153
* @route '/payroll/{payroll_run}/payslips/{payslip}'
*/
updatePayslip.put = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePayslip.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PayrollRunController::updatePayslip
* @see app/Http/Controllers/PayrollRunController.php:153
* @route '/payroll/{payroll_run}/payslips/{payslip}'
*/
const updatePayslipForm = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePayslip.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PayrollRunController::updatePayslip
* @see app/Http/Controllers/PayrollRunController.php:153
* @route '/payroll/{payroll_run}/payslips/{payslip}'
*/
updatePayslipForm.put = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePayslip.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updatePayslip.form = updatePayslipForm

/**
* @see \App\Http\Controllers\PayrollRunController::downloadPayslip
* @see app/Http/Controllers/PayrollRunController.php:167
* @route '/payroll/{payroll_run}/payslips/{payslip}/download'
*/
export const downloadPayslip = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPayslip.url(args, options),
    method: 'get',
})

downloadPayslip.definition = {
    methods: ["get","head"],
    url: '/payroll/{payroll_run}/payslips/{payslip}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollRunController::downloadPayslip
* @see app/Http/Controllers/PayrollRunController.php:167
* @route '/payroll/{payroll_run}/payslips/{payslip}/download'
*/
downloadPayslip.url = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            payroll_run: args[0],
            payslip: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payroll_run: typeof args.payroll_run === 'object'
        ? args.payroll_run.id
        : args.payroll_run,
        payslip: typeof args.payslip === 'object'
        ? args.payslip.id
        : args.payslip,
    }

    return downloadPayslip.definition.url
            .replace('{payroll_run}', parsedArgs.payroll_run.toString())
            .replace('{payslip}', parsedArgs.payslip.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollRunController::downloadPayslip
* @see app/Http/Controllers/PayrollRunController.php:167
* @route '/payroll/{payroll_run}/payslips/{payslip}/download'
*/
downloadPayslip.get = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollRunController::downloadPayslip
* @see app/Http/Controllers/PayrollRunController.php:167
* @route '/payroll/{payroll_run}/payslips/{payslip}/download'
*/
downloadPayslip.head = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadPayslip.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PayrollRunController::downloadPayslip
* @see app/Http/Controllers/PayrollRunController.php:167
* @route '/payroll/{payroll_run}/payslips/{payslip}/download'
*/
const downloadPayslipForm = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollRunController::downloadPayslip
* @see app/Http/Controllers/PayrollRunController.php:167
* @route '/payroll/{payroll_run}/payslips/{payslip}/download'
*/
downloadPayslipForm.get = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollRunController::downloadPayslip
* @see app/Http/Controllers/PayrollRunController.php:167
* @route '/payroll/{payroll_run}/payslips/{payslip}/download'
*/
downloadPayslipForm.head = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadPayslip.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadPayslip.form = downloadPayslipForm

const PayrollRunController = { index, store, show, destroy, submit, approve, reject, updatePayslip, downloadPayslip }

export default PayrollRunController