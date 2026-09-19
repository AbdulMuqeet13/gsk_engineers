import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    DataTable,
    DataTableFilter,
    DataTableSearch,
    DataTableToolbar,
} from '@/components/data-table';
import { CreateProjectDialog } from '@/components/projects/create-project-dialog';
import { DeleteProjectDialog } from '@/components/projects/delete-project-dialog';
import { EditProjectDialog } from '@/components/projects/edit-project-dialog';
import { getProjectColumns } from '@/components/projects/project-columns';
import { useCan } from '@/hooks/use-can';
import { useDataTable } from '@/hooks/use-data-table';
import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
import type { PaginatedResponse, Project } from '@/types';

type IndexProps = {
    projects: PaginatedResponse<Project>;
    statuses: string[];
};

export default function Index({ projects, statuses }: IndexProps) {
    const { can } = useCan();
    const { search, sort, filters, setSearch, setSort, setFilter, setPage, setPerPage } =
        useDataTable({ only: ['projects'] });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);

    const columns = useMemo(
        () =>
            getProjectColumns({
                sort,
                onSort: setSort,
                onEdit: can('projects.update')
                    ? (project) => setEditingProject(project)
                    : undefined,
                onDelete: can('projects.delete')
                    ? (project) => setDeletingProject(project)
                    : undefined,
            }),
        [sort, setSort, can],
    );

    const statusFilterOptions = useMemo(
        () =>
            statuses.map((status) => ({
                label: status
                    .replace('_', ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase()),
                value: status,
            })),
        [statuses],
    );

    const activeStatusFilter = useMemo(() => {
        const value = filters.status;

        if (!value) {
            return [];
        }

        return Array.isArray(value) ? value : value.split(',');
    }, [filters.status]);

    return (
        <>
            <Head title="Projects" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Projects"
                    description="Manage your organization's projects."
                />
                <DataTable
                columns={columns}
                data={projects.data}
                meta={projects.meta}
                sort={sort}
                onSort={setSort}
                onPageChange={setPage}
                onPerPageChange={setPerPage}
                emptyMessage="No projects found."
                emptyDescription="Try adjusting your search or filters, or create a new project."
                toolbar={
                    <DataTableToolbar>
                        <div className="flex flex-1 items-center gap-2">
                            <DataTableSearch
                                value={search}
                                onChange={setSearch}
                                placeholder="Search projects..."
                            />
                            <DataTableFilter
                                title="Status"
                                options={statusFilterOptions}
                                value={activeStatusFilter}
                                onChange={(value) =>
                                    setFilter('status', value.length > 0 ? value.join(',') : undefined)
                                }
                            />
                        </div>
                        {can('projects.create') && (
                            <Button
                                size="sm"
                                onClick={() => setIsCreateOpen(true)}
                            >
                                <Plus className="mr-1 size-4" />
                                Add Project
                            </Button>
                        )}
                    </DataTableToolbar>
                }
                />

                <CreateProjectDialog
                    open={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    statuses={statuses}
                />

                {editingProject && (
                    <EditProjectDialog
                        open={!!editingProject}
                        onClose={() => setEditingProject(null)}
                        project={editingProject}
                        statuses={statuses}
                    />
                )}

                {deletingProject && (
                    <DeleteProjectDialog
                        open={!!deletingProject}
                        onClose={() => setDeletingProject(null)}
                        project={deletingProject}
                    />
                )}
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Projects', href: ProjectController.index().url }],
};
