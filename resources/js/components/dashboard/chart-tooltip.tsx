import type { TooltipProps } from 'recharts';

function formatAmount(value: number): string {
    return value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

export function ChartTooltip({
    active,
    payload,
    label,
}: TooltipProps<number, string>) {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="bg-popover text-popover-foreground min-w-[140px] rounded-lg border px-3 py-2 shadow-md">
            {label && (
                <p className="text-muted-foreground mb-1.5 text-xs font-medium">
                    {label}
                </p>
            )}
            <div className="space-y-1">
                {payload.map((entry, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-1.5">
                            <span
                                className="size-2.5 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-muted-foreground text-xs">
                                {entry.name}
                            </span>
                        </div>
                        <span className="text-xs font-semibold">
                            {formatAmount(entry.value ?? 0)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function PieTooltip({
    active,
    payload,
}: TooltipProps<number, string>) {
    if (!active || !payload?.length) {
        return null;
    }

    const entry = payload[0];

    return (
        <div className="bg-popover text-popover-foreground rounded-lg border px-3 py-2 shadow-md">
            <div className="flex items-center gap-2">
                <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: entry.payload?.fill }}
                />
                <span className="text-xs font-medium">{entry.name}</span>
            </div>
            <p className="mt-1 text-sm font-semibold">
                {formatAmount(entry.value ?? 0)}
            </p>
        </div>
    );
}
