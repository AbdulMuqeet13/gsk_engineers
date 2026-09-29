import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTable, DataTableToolbar } from '@/components/data-table';
import Heading from '@/components/heading';
import { DeleteSalaryComponentDialog } from '@/components/salary-components/delete-salary-component-dialog';
import { getSalaryComponentColumns } from '@/components/salary-components/salary-component-columns';
import { SalaryComponentFormDialog } from '@/components/salary-components/salary-component-form-dialog';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import type { SalaryComponent } from '@/types';
import { index as payrollIndex } from '@/actions/App/Http/Controllers/PayrollRunController';
import { index } from '@/actions/App/Http/Controllers/SalaryComponentController';
import { dashboard } from '@/routes';

type SalaryComponentsPageProps = {
    salaryComponents: SalaryComponent[];
};

export default function SalaryComponents({
    salaryComponents,
}: SalaryComponentsPageProps) {
    const { can } = useCan();
    const canManage = can('payroll.run');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingComponent, setEditingComponent] =
        useState<SalaryComponent | null>(null);
    const [deletingComponent, setDeletingComponent] =
        useState<SalaryComponent | null>(null);

    const columns = useMemo(
        () =>
            getSalaryComponentColumns({
                onEdit: setEditingComponent,
                onDelete: setDeletingComponent,
                canManage,
            }),
        [canManage],
    );

    const nextSortOrder =
        Math.max(
            0,
            ...salaryComponents.map((component) => component.sort_order),
        ) + 1;

    return (
        <>
            <Head title="Salary Components" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Salary Components"
                    description="The parts that make up an employee's salary breakdown."
                />

                <DataTable
                    columns={columns}
                    data={salaryComponents}
                    emptyMessage="No salary components found."
                    toolbar={
                        <DataTableToolbar>
                            <div className="flex-1" />
                            {canManage && (
                                <Button
                                    size="sm"
                                    onClick={() => setIsCreateOpen(true)}
                                >
                                    <Plus className="mr-2 size-4" />
                                    Add Component
                                </Button>
                            )}
                        </DataTableToolbar>
                    }
                />
            </div>

            {isCreateOpen && (
                <SalaryComponentFormDialog
                    open={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    nextSortOrder={nextSortOrder}
                />
            )}

            {editingComponent && (
                <SalaryComponentFormDialog
                    open={!!editingComponent}
                    onClose={() => setEditingComponent(null)}
                    salaryComponent={editingComponent}
                    nextSortOrder={nextSortOrder}
                />
            )}

            {deletingComponent && (
                <DeleteSalaryComponentDialog
                    open={!!deletingComponent}
                    onClose={() => setDeletingComponent(null)}
                    salaryComponent={deletingComponent}
                />
            )}
        </>
    );
}

SalaryComponents.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Payroll', href: payrollIndex().url },
        { title: 'Salary Components', href: index().url },
    ],
};
