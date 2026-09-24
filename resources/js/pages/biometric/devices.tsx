import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getDeviceColumns } from '@/components/biometric/device-columns';
import { CreateDeviceDialog } from '@/components/biometric/create-device-dialog';
import { EditDeviceDialog } from '@/components/biometric/edit-device-dialog';
import { DeleteDeviceDialog } from '@/components/biometric/delete-device-dialog';
import {
    DataTable,
    DataTableSearch,
    DataTableToolbar,
} from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/hooks/use-data-table';
import type { BiometricDevice, PaginatedResponse } from '@/types';
import { index } from '@/actions/App/Http/Controllers/BiometricDeviceController';
import { dashboard } from '@/routes';

type BiometricDevicesPageProps = {
    devices: PaginatedResponse<BiometricDevice>;
};

export default function BiometricDevices({
    devices,
}: BiometricDevicesPageProps) {
    const { search, sort, setSearch, setSort, setPage, setPerPage } =
        useDataTable({ only: ['devices'] });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingDevice, setEditingDevice] =
        useState<BiometricDevice | null>(null);
    const [deletingDevice, setDeletingDevice] =
        useState<BiometricDevice | null>(null);

    const columns = useMemo(
        () =>
            getDeviceColumns({
                sort,
                onSort: setSort,
                onEdit: setEditingDevice,
                onDelete: setDeletingDevice,
            }),
        [sort, setSort],
    );

    return (
        <>
            <Head title="Biometric Devices" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Biometric Devices"
                    description="Manage ZKTeco biometric attendance devices."
                />

                <DataTable
                    columns={columns}
                    data={devices.data}
                    meta={devices.meta}
                    sort={sort}
                    onSort={setSort}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    emptyMessage="No biometric devices found."
                    emptyDescription="Add a device or let it auto-register by configuring its server URL."
                    toolbar={
                        <DataTableToolbar>
                            <div className="flex flex-1 flex-wrap items-center gap-2">
                                <DataTableSearch
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search devices..."
                                />
                            </div>

                            <Button
                                size="sm"
                                onClick={() => setIsCreateOpen(true)}
                            >
                                <Plus className="mr-2 size-4" />
                                Add Device
                            </Button>
                        </DataTableToolbar>
                    }
                />
            </div>

            <CreateDeviceDialog
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            {editingDevice && (
                <EditDeviceDialog
                    open={!!editingDevice}
                    onClose={() => setEditingDevice(null)}
                    device={editingDevice}
                />
            )}

            {deletingDevice && (
                <DeleteDeviceDialog
                    open={!!deletingDevice}
                    onClose={() => setDeletingDevice(null)}
                    device={deletingDevice}
                />
            )}
        </>
    );
}

BiometricDevices.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Biometric Devices', href: index().url },
    ],
};
