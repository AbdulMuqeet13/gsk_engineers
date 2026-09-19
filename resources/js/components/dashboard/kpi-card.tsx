import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type KpiCardProps = {
    title: string;
    value: string;
    icon: LucideIcon;
    variant?: 'default' | 'success' | 'destructive' | 'info' | 'warning';
};

function formatAmount(value: string): string {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

const iconVariants: Record<string, string> = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    destructive: 'bg-destructive/10 text-destructive',
    info: 'bg-info/10 text-info',
    warning: 'bg-warning/10 text-warning',
};

export function KpiCard({
    title,
    value,
    icon: Icon,
    variant = 'default',
}: KpiCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                    {title}
                </CardTitle>
                <div
                    className={cn(
                        'flex size-8 items-center justify-center rounded-lg',
                        iconVariants[variant],
                    )}
                >
                    <Icon className="size-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatAmount(value)}</div>
            </CardContent>
        </Card>
    );
}
