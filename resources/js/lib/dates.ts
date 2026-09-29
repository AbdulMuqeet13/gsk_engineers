/**
 * Dates travel to and from the server as ISO `YYYY-MM-DD` strings and are
 * displayed to users as `DD-MM-YYYY`.
 */

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

/**
 * Parse a `YYYY-MM-DD` string into a local Date (no timezone shift).
 */
export function parseIsoDate(value: string | null | undefined): Date | undefined {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? '');

    if (!match) {
        return undefined;
    }

    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

/**
 * Convert a Date to a `YYYY-MM-DD` string using its local calendar day.
 */
export function toIsoDate(date: Date): string {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Format a `YYYY-MM-DD` string or Date as `DD-MM-YYYY`.
 */
export function formatDate(value: string | Date | null | undefined): string {
    const date = value instanceof Date ? value : parseIsoDate(value);

    if (!date) {
        return '';
    }

    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}
