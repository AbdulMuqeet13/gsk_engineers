import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProjectAssignmentController from '@/actions/App/Http/Controllers/ProjectAssignmentController';
import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableFilter } from '@/components/data-table/data-table-filter';
import { DataTableSearch } from '@/components/data-table/data-table-search';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { getAssignmentColumns } from '@/components/project-assignments/assignment-columns';
import { CreateAssignmentDialog } from '@/components/project-assignments/create-assignment-dialog';
import { DeleteAssignmentDialog } from '@/components/project-assignments/delete-assignment-dialog';
import { EditAssignmentDialog } from '@/components/project-assignments/edit-assignment-dialog';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useDataTable } from '@/hooks/use-data-table';
import type { PaginatedResponse, ProjectAssignment } from '@/types';

type AssignmentsPageProps = {
    assignments: PaginatedResponse<ProjectAssignment>;
    employees?: Array<{ id: number; name: string }>;
    projects?: Array<{ id: number; name: string; code: string }>;
};

export default function Index({
    assignments,
    employees = [],
    projects = [],
}: AssignmentsPageProps) {
    const { can } = useCan();
    const {
        search,
        sort,
        filters,
        setSearch,
        setSort,
        setFilter,
        setPage,
        setPerPage,
    } = useDataTable({ only: ['assignments'] });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] =
        useState<ProjectAssignment | null>(null);
    const [deletingAssignment, setDeletingAssignment] =
        useState<ProjectAssignment | null>(null);

    const projectFilterOptions = useMemo(
        () =>
            projects.map((project) => ({
                label: `${project.name} (${project.code})`,
                value: String(project.id),
            })),
        [projects],
    );

    const employeeFilterOptions = useMemo(
        () =>
            employees.map((employee) => ({
                label: employee.name,
                value: String(employee.id),
            })),
        [employees],
    );

    const columns = useMemo(
        () =>
            getAssignmentColumns({
                sort,
                onSort: setSort,
                onEdit: setEditingAssignment,
                onDelete: setDeletingAssignment,
            }),
        [sort, setSort],
    );

    const projectFilterValue = filters.project_id
        ? Array.isArray(filters.project_id)
            ? filters.project_id
            : [filters.project_id]
        : [];

    const employeeFilterValue = filters.employee_id
        ? Array.isArray(filters.employee_id)
            ? filters.employee_id
            : [filters.employee_id]
        : [];

    return (
        <>
            <Head title="Project Assignments" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Project Assignments"
                        description="Manage employee assignments to projects."
                    />
                    {can('projects.assign') && (
                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="mr-2 size-4" />
                            Assign Employee
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={assignments.data}
                    meta={assignments.meta}
                    sort={sort}
                    onSort={setSort}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    emptyMessage="No assignments found."
                    emptyDescription="Assign employees to projects to get started."
                    toolbar={
                        <DataTableToolbar>
                            <div className="flex flex-1 items-center gap-2">
                                <DataTableSearch
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search assignments..."
                                />
                                <DataTableFilter
                                    title="Project"
                                    options={projectFilterOptions}
                                    value={projectFilterValue}
                                    onChange={(value) =>
                                        setFilter(
                                            'project_id',
                                            value.length > 0
                                                ? value
                                                : undefined,
                                        )
                                    }
                                />
                                <DataTableFilter
                                    title="Employee"
                                    options={employeeFilterOptions}
                                    value={employeeFilterValue}
                                    onChange={(value) =>
                                        setFilter(
                                            'employee_id',
                                            value.length > 0
                                                ? value
                                                : undefined,
                                        )
                                    }
                                />
                            </div>
                        </DataTableToolbar>
                    }
                />
            </div>

            {can('projects.assign') && (
                <CreateAssignmentDialog
                    open={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    employees={employees}
                    projects={projects}
                />
            )}

            {editingAssignment && (
                <EditAssignmentDialog
                    open={!!editingAssignment}
                    onClose={() => setEditingAssignment(null)}
                    assignment={editingAssignment}
                    employees={employees}
                    projects={projects}
                />
            )}

            {deletingAssignment && (
                <DeleteAssignmentDialog
                    open={!!deletingAssignment}
                    onClose={() => setDeletingAssignment(null)}
                    assignment={deletingAssignment}
                />
            )}
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Projects', href: ProjectController.index().url },
        {
            title: 'Assignments',
            href: ProjectAssignmentController.index().url,
        },
    ],
};
