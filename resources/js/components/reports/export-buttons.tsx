import { FileDown, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ExportButtonsProps = {
    exportUrl: string;
    params?: Record<string, string>;
};

function buildUrl(baseUrl: string, params: Record<string, string>): string {
    const filtered = Object.entries(params).filter(([, v]) => v !== '');
    if (filtered.length === 0) {
        return baseUrl;
    }
    const query = new URLSearchParams(filtered).toString();
    return `${baseUrl}?${query}`;
}

export function ExportButtons({ exportUrl, params = {} }: ExportButtonsProps) {
    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
                <a
                    href={buildUrl(exportUrl, { ...params, format: 'pdf' })}
                >
                    <FileDown className="mr-1 size-4" />
                    PDF
                </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
                <a
                    href={buildUrl(exportUrl, { ...params, format: 'excel' })}
                >
                    <FileSpreadsheet className="mr-1 size-4" />
                    Excel
                </a>
            </Button>
        </div>
    );
}
