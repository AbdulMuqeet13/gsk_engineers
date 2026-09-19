import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import { ExportButtons } from '@/components/reports/export-buttons';
import { getPositionColumns } from '@/components/reports/position-columns';
import { DataTable, DataTableToolbar } from '@/components/data-table';
import Heading from '@/components/heading';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDataTable } from '@/hooks/use-data-table';
import type { InterProjectPosition, Project } from '@/types';
import { index } from '@/actions/App/Http/Controllers/InterProjectPositionController';
import { dashboard } from '@/routes';

type PositionPageProps = {
    positions: InterProjectPosition[];
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
};

export default function InterProjectPositionReport({
    positions,
    projects = [],
}: PositionPageProps) {
    const { filters, setFilter } = useDataTable({ only: ['positions'] });

    const columns = useMemo(() => getPositionColumns(), []);

    return (
        <>
            <Head title="Inter-Project Position" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Inter-Project Position"
                        description="Net fund balances between project pairs."
                    />
                    <ExportButtons
                        exportUrl="/reports/inter-project-position/export"
                        params={{
                            project_id: (filters.project_id as string) ?? '',
                        }}
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={positions}
                    emptyMessage="No inter-project transfers found."
                    emptyDescription="Transfers between projects will appear here."
                    toolbar={
                        <DataTableToolbar>
                            <div className="flex flex-1 flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Label
                                        htmlFor="filter-project"
                                        className="text-muted-foreground text-xs"
                                    >
                                        Project
                                    </Label>
                                    <Select
                                        value={
                                            (filters.project_id as string) ?? ''
                                        }
                                        onValueChange={(value) =>
                                            setFilter(
                                                'project_id',
                                                value || undefined,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="filter-project"
                                            className="h-8 w-[200px]"
                                        >
                                            <SelectValue placeholder="All projects" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All</SelectItem>
                                            {projects.map((project) => (
                                                <SelectItem
                                                    key={project.id}
                                                    value={String(project.id)}
                                                >
                                                    {project.code} -{' '}
                                                    {project.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </DataTableToolbar>
                    }
                />
            </div>
        </>
    );
}

InterProjectPositionReport.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Inter-Project Position', href: index().url },
    ],
};
