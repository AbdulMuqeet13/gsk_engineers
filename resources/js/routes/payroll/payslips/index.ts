import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PayrollRunController::update
* @see app/Http/Controllers/PayrollRunController.php:153
* @route '/payroll/{payroll_run}/payslips/{payslip}'
*/
export const update = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/payroll/{payroll_run}/payslips/{payslip}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PayrollRunController::update
* @see app/Http/Controllers/PayrollRunController.php:153
* @route '/payroll/{payroll_run}/payslips/{payslip}'
*/
update.url = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{payroll_run}', parsedArgs.payroll_run.toString())
            .replace('{payslip}', parsedArgs.payslip.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollRunController::update
* @see app/Http/Controllers/PayrollRunController.php:153
* @route '/payroll/{payroll_run}/payslips/{payslip}'
*/
update.put = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PayrollRunController::update
* @see app/Http/Controllers/PayrollRunController.php:153
* @route '/payroll/{payroll_run}/payslips/{payslip}'
*/
const updateForm = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PayrollRunController::update
* @see app/Http/Controllers/PayrollRunController.php:153
* @route '/payroll/{payroll_run}/payslips/{payslip}'
*/
updateForm.put = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\PayrollRunController::download
* @see app/Http/Controllers/PayrollRunController.php:167
* @route '/payroll/{payroll_run}/payslips/{payslip}/download'
*/
export const download = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/payroll/{payroll_run}/payslips/{payslip}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollRunController::download
* @see app/Http/Controllers/PayrollRunController.php:167
* @route '/payroll/{payroll_run}/payslips/{payslip}/download'
*/
download.url = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return download.definition.url
            .replace('{payroll_run}', parsedArgs.payroll_run.toString())
            .replace('{payslip}', parsedArgs.payslip.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollRunController::download
* @see app/Http/Controllers/PayrollRunController.php:167
* @route '/payroll/{payroll_run}/payslips/{payslip}/download'
*/
download.get = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollRunController::download
* @see app/Http/Controllers/PayrollRunController.php:167
* @route '/payroll/{payroll_run}/payslips/{payslip}/download'
*/
download.head = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PayrollRunController::download
* @see app/Http/Controllers/PayrollRunController.php:167
* @route '/payroll/{payroll_run}/payslips/{payslip}/download'
*/
const downloadForm = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollRunController::download
* @see app/Http/Controllers/PayrollRunController.php:167
* @route '/payroll/{payroll_run}/payslips/{payslip}/download'
*/
downloadForm.get = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PayrollRunController::download
* @see app/Http/Controllers/PayrollRunController.php:167
* @route '/payroll/{payroll_run}/payslips/{payslip}/download'
*/
downloadForm.head = (args: { payroll_run: number | { id: number }, payslip: number | { id: number } } | [payroll_run: number | { id: number }, payslip: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

const payslips = {
    update: Object.assign(update, update),
    download: Object.assign(download, download),
}

export default payslips