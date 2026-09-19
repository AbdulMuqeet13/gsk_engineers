import { Inbox } from 'lucide-react';

type DataTableEmptyProps = {
    message?: string;
    description?: string;
};

export function DataTableEmpty({
    message = 'No results found.',
    description = 'Try adjusting your search or filters.',
}: DataTableEmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <Inbox className="text-muted-foreground/50 mb-3 size-10" />
            <p className="text-muted-foreground text-sm font-medium">
                {message}
            </p>
            {description && (
                <p className="text-muted-foreground/70 mt-1 text-xs">
                    {description}
                </p>
            )}
        </div>
    );
}
