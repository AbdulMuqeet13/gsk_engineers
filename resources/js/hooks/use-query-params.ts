import { usePage } from '@inertiajs/react';

/**
 * Query string of the current Inertia page. Use it to seed filter state so
 * filters survive a browser refresh (partial reloads write them to the URL).
 */
export function useQueryParams(): URLSearchParams {
    const url = usePage().url;

    if (typeof window === 'undefined') {
        return new URLSearchParams(url.split('?')[1] ?? '');
    }

    try {
        return new URL(url, window.location.origin).searchParams;
    } catch {
        return new URLSearchParams();
    }
}
