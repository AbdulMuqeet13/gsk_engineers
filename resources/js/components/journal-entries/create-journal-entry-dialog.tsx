import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    JournalLineFormRows,
    type JournalLineFormData,
} from '@/components/journal-entries/journal-line-form-rows';
import type {
    AccountHead,
    JournalEntryType,
    Project,
} from '@/types';
import { store } from '@/actions/App/Http/Controllers/JournalEntryController';

type CreateJournalEntryDialogProps = {
    open: boolean;
    onClose: () => void;
    entryTypes: JournalEntryType[];
    accountHeads: Pick<AccountHead, 'id' | 'code' | 'name'>[];
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
};

const emptyLine: JournalLineFormData = {
    account_head_id: '',
    project_id: '',
    debit: '',
    credit: '',
    memo: '',
};

export function CreateJournalEntryDialog({
    open,
    onClose,
    entryTypes,
    accountHeads,
    projects,
}: CreateJournalEntryDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        date: '',
        description: '',
        type: '' as JournalEntryType | '',
        lines: [{ ...emptyLine }, { ...emptyLine }] as JournalLineFormData[],
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(store().url, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    }

    function handleOpenChange(isOpen: boolean) {
        if (!isOpen) {
            reset();
            onClose();
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="flex max-h-[95dvh] w-[95vw] flex-col gap-0 p-0 sm:max-h-[85dvh] lg:max-w-5xl">
                <DialogHeader className="shrink-0 border-b px-6 py-4">
                    <DialogTitle>Create Journal Entry</DialogTitle>
                    <DialogDescription>
                        Create a new journal entry with balanced debit and
                        credit lines.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="create-date">Date</Label>
                                <Input
                                    id="create-date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) =>
                                        setData('date', e.target.value)
                                    }
                                />
                                {errors.date && (
                                    <p className="text-destructive text-sm">
                                        {errors.date}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-type">Type</Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(value) =>
                                        setData(
                                            'type',
                                            value as JournalEntryType,
                                        )
                                    }
                                >
                                    <SelectTrigger id="create-type">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {entryTypes.map((type) => (
                                            <SelectItem
                                                key={type}
                                                value={type}
                                            >
                                                {type.charAt(0).toUpperCase() +
                                                    type.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-destructive text-sm">
                                        {errors.type}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-description">
                                    Description
                                </Label>
                                <Input
                                    id="create-description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Entry description"
                                />
                                {errors.description && (
                                    <p className="text-destructive text-sm">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Lines</Label>
                            <JournalLineFormRows
                                lines={data.lines}
                                onChange={(lines) => setData('lines', lines)}
                                accountHeads={accountHeads}
                                projects={projects}
                                errors={errors}
                            />
                        </div>
                    </div>

                    <DialogFooter className="shrink-0 border-t px-6 py-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
