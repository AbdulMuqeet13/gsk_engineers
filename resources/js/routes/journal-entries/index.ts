import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\JournalEntryController::index
* @see app/Http/Controllers/JournalEntryController.php:29
* @route '/accounting/journal-entries'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/accounting/journal-entries',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JournalEntryController::index
* @see app/Http/Controllers/JournalEntryController.php:29
* @route '/accounting/journal-entries'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalEntryController::index
* @see app/Http/Controllers/JournalEntryController.php:29
* @route '/accounting/journal-entries'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalEntryController::index
* @see app/Http/Controllers/JournalEntryController.php:29
* @route '/accounting/journal-entries'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JournalEntryController::index
* @see app/Http/Controllers/JournalEntryController.php:29
* @route '/accounting/journal-entries'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalEntryController::index
* @see app/Http/Controllers/JournalEntryController.php:29
* @route '/accounting/journal-entries'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalEntryController::index
* @see app/Http/Controllers/JournalEntryController.php:29
* @route '/accounting/journal-entries'
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
* @see \App\Http\Controllers\JournalEntryController::store
* @see app/Http/Controllers/JournalEntryController.php:67
* @route '/accounting/journal-entries'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/accounting/journal-entries',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\JournalEntryController::store
* @see app/Http/Controllers/JournalEntryController.php:67
* @route '/accounting/journal-entries'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalEntryController::store
* @see app/Http/Controllers/JournalEntryController.php:67
* @route '/accounting/journal-entries'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalEntryController::store
* @see app/Http/Controllers/JournalEntryController.php:67
* @route '/accounting/journal-entries'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalEntryController::store
* @see app/Http/Controllers/JournalEntryController.php:67
* @route '/accounting/journal-entries'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\JournalEntryController::update
* @see app/Http/Controllers/JournalEntryController.php:76
* @route '/accounting/journal-entries/{journal_entry}'
*/
export const update = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/accounting/journal-entries/{journal_entry}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\JournalEntryController::update
* @see app/Http/Controllers/JournalEntryController.php:76
* @route '/accounting/journal-entries/{journal_entry}'
*/
update.url = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { journal_entry: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { journal_entry: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            journal_entry: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        journal_entry: typeof args.journal_entry === 'object'
        ? args.journal_entry.id
        : args.journal_entry,
    }

    return update.definition.url
            .replace('{journal_entry}', parsedArgs.journal_entry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalEntryController::update
* @see app/Http/Controllers/JournalEntryController.php:76
* @route '/accounting/journal-entries/{journal_entry}'
*/
update.put = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\JournalEntryController::update
* @see app/Http/Controllers/JournalEntryController.php:76
* @route '/accounting/journal-entries/{journal_entry}'
*/
update.patch = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\JournalEntryController::update
* @see app/Http/Controllers/JournalEntryController.php:76
* @route '/accounting/journal-entries/{journal_entry}'
*/
const updateForm = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalEntryController::update
* @see app/Http/Controllers/JournalEntryController.php:76
* @route '/accounting/journal-entries/{journal_entry}'
*/
updateForm.put = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalEntryController::update
* @see app/Http/Controllers/JournalEntryController.php:76
* @route '/accounting/journal-entries/{journal_entry}'
*/
updateForm.patch = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\JournalEntryController::destroy
* @see app/Http/Controllers/JournalEntryController.php:85
* @route '/accounting/journal-entries/{journal_entry}'
*/
export const destroy = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/accounting/journal-entries/{journal_entry}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\JournalEntryController::destroy
* @see app/Http/Controllers/JournalEntryController.php:85
* @route '/accounting/journal-entries/{journal_entry}'
*/
destroy.url = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { journal_entry: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { journal_entry: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            journal_entry: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        journal_entry: typeof args.journal_entry === 'object'
        ? args.journal_entry.id
        : args.journal_entry,
    }

    return destroy.definition.url
            .replace('{journal_entry}', parsedArgs.journal_entry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalEntryController::destroy
* @see app/Http/Controllers/JournalEntryController.php:85
* @route '/accounting/journal-entries/{journal_entry}'
*/
destroy.delete = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\JournalEntryController::destroy
* @see app/Http/Controllers/JournalEntryController.php:85
* @route '/accounting/journal-entries/{journal_entry}'
*/
const destroyForm = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalEntryController::destroy
* @see app/Http/Controllers/JournalEntryController.php:85
* @route '/accounting/journal-entries/{journal_entry}'
*/
destroyForm.delete = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\JournalEntryController::post
* @see app/Http/Controllers/JournalEntryController.php:102
* @route '/accounting/journal-entries/{journal_entry}/post'
*/
export const post = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: post.url(args, options),
    method: 'post',
})

post.definition = {
    methods: ["post"],
    url: '/accounting/journal-entries/{journal_entry}/post',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\JournalEntryController::post
* @see app/Http/Controllers/JournalEntryController.php:102
* @route '/accounting/journal-entries/{journal_entry}/post'
*/
post.url = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { journal_entry: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { journal_entry: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            journal_entry: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        journal_entry: typeof args.journal_entry === 'object'
        ? args.journal_entry.id
        : args.journal_entry,
    }

    return post.definition.url
            .replace('{journal_entry}', parsedArgs.journal_entry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalEntryController::post
* @see app/Http/Controllers/JournalEntryController.php:102
* @route '/accounting/journal-entries/{journal_entry}/post'
*/
post.post = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: post.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalEntryController::post
* @see app/Http/Controllers/JournalEntryController.php:102
* @route '/accounting/journal-entries/{journal_entry}/post'
*/
const postForm = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: post.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalEntryController::post
* @see app/Http/Controllers/JournalEntryController.php:102
* @route '/accounting/journal-entries/{journal_entry}/post'
*/
postForm.post = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: post.url(args, options),
    method: 'post',
})

post.form = postForm

/**
* @see \App\Http\Controllers\JournalEntryController::reverse
* @see app/Http/Controllers/JournalEntryController.php:114
* @route '/accounting/journal-entries/{journal_entry}/reverse'
*/
export const reverse = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

reverse.definition = {
    methods: ["post"],
    url: '/accounting/journal-entries/{journal_entry}/reverse',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\JournalEntryController::reverse
* @see app/Http/Controllers/JournalEntryController.php:114
* @route '/accounting/journal-entries/{journal_entry}/reverse'
*/
reverse.url = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { journal_entry: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { journal_entry: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            journal_entry: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        journal_entry: typeof args.journal_entry === 'object'
        ? args.journal_entry.id
        : args.journal_entry,
    }

    return reverse.definition.url
            .replace('{journal_entry}', parsedArgs.journal_entry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalEntryController::reverse
* @see app/Http/Controllers/JournalEntryController.php:114
* @route '/accounting/journal-entries/{journal_entry}/reverse'
*/
reverse.post = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalEntryController::reverse
* @see app/Http/Controllers/JournalEntryController.php:114
* @route '/accounting/journal-entries/{journal_entry}/reverse'
*/
const reverseForm = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalEntryController::reverse
* @see app/Http/Controllers/JournalEntryController.php:114
* @route '/accounting/journal-entries/{journal_entry}/reverse'
*/
reverseForm.post = (args: { journal_entry: number | { id: number } } | [journal_entry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

reverse.form = reverseForm

const journalEntries = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    post: Object.assign(post, post),
    reverse: Object.assign(reverse, reverse),
}

export default journalEntries