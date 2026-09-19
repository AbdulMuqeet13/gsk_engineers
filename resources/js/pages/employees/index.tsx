import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import EmployeeController from '@/actions/App/Http/Controllers/EmployeeController';
import {
    DataTable,
    DataTableFilter,
    DataTableSearch,
    DataTableToolbar,
} from '@/components/data-table';
import { CreateEmployeeDialog } from '@/components/employees/create-employee-dialog';
import { DeleteEmployeeDialog } from '@/components/employees/delete-employee-dialog';
import { EditEmployeeDialog } from '@/components/employees/edit-employee-dialog';
import { getEmployeeColumns } from '@/components/employees/employee-columns';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useDataTable } from '@/hooks/use-data-table';
import type { Employee, PaginatedResponse } from '@/types';

type IndexProps = {
    employees: PaginatedResponse<Employee>;
    employeeTypes: string[];
    projects?: Array<{ id: number; name: string; code: string }>;
};

export default function Index({
    employees,
    employeeTypes,
    projects = [],
}: IndexProps) {
    const { can } = useCan();
    const { search, sort, filters, setSearch, setSort, setFilter, setPage, setPerPage } =
        useDataTable({ only: ['employees'] });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(
        null,
    );
    const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
        null,
    );

    const columns = useMemo(
        () =>
            getEmployeeColumns({
                sort,
                onSort: setSort,
                onEdit: (employee) => setEditingEmployee(employee),
                onDelete: (employee) => setDeletingEmployee(employee),
            }),
        [sort, setSort],
    );

    const typeFilterOptions = employeeTypes.map((type) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type,
    }));

    const projectFilterOptions = projects.map((project) => ({
        label: `${project.code} — ${project.name}`,
        value: String(project.id),
    }));

    const typeFilterValue = filters.type
        ? Array.isArray(filters.type)
            ? filters.type
            : [filters.type]
        : [];

    const projectFilterValue = filters.project_id
        ? Array.isArray(filters.project_id)
            ? filters.project_id
            : [filters.project_id]
        : [];

    return (
        <>
            <Head title="Employees" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Employees"
                        description="Manage your organization's employees."
                    />
                    {can('employees.create') && (
                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="mr-2 size-4" />
                            Add Employee
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={employees.data}
                    meta={employees.meta}
                    sort={sort}
                    onSort={setSort}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    toolbar={
                        <DataTableToolbar>
                            <div className="flex flex-1 items-center gap-2">
                                <DataTableSearch
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search employees..."
                                />
                                <DataTableFilter
                                    title="Type"
                                    options={typeFilterOptions}
                                    value={typeFilterValue}
                                    onChange={(value) =>
                                        setFilter(
                                            'type',
                                            value.length > 0
                                                ? value.join(',')
                                                : undefined,
                                        )
                                    }
                                />
                                {projectFilterOptions.length > 0 && (
                                    <DataTableFilter
                                        title="Project"
                                        options={projectFilterOptions}
                                        value={projectFilterValue}
                                        onChange={(value) =>
                                            setFilter(
                                                'project_id',
                                                value.length > 0
                                                    ? value.join(',')
                                                    : undefined,
                                            )
                                        }
                                    />
                                )}
                            </div>
                        </DataTableToolbar>
                    }
                    emptyMessage="No employees found."
                    emptyDescription="Try adjusting your search or filters, or add a new employee."
                />
            </div>

            <CreateEmployeeDialog
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                employeeTypes={employeeTypes}
                projects={projects}
            />

            {editingEmployee && (
                <EditEmployeeDialog
                    open={true}
                    onClose={() => setEditingEmployee(null)}
                    employee={editingEmployee}
                    employeeTypes={employeeTypes}
                    projects={projects}
                />
            )}

            {deletingEmployee && (
                <DeleteEmployeeDialog
                    open={true}
                    onClose={() => setDeletingEmployee(null)}
                    employee={deletingEmployee}
                />
            )}
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Employees', href: EmployeeController.index().url },
    ],
};
