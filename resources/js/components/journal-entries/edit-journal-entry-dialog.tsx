import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
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
import { AttachmentList } from '@/components/attachments/attachment-list';
import { toInputDate } from '@/lib/utils';
import type {
    AccountHead,
    JournalEntry,
    JournalEntryType,
    Project,
} from '@/types';
import { update } from '@/actions/App/Http/Controllers/JournalEntryController';

type EditJournalEntryDialogProps = {
    open: boolean;
    onClose: () => void;
    journalEntry: JournalEntry;
    entryTypes: JournalEntryType[];
    accountHeads: Pick<AccountHead, 'id' | 'code' | 'name'>[];
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
};

function mapLinesToFormData(entry: JournalEntry): JournalLineFormData[] {
    if (!entry.lines || entry.lines.length === 0) {
        return [
            { account_head_id: '', project_id: '', debit: '', credit: '', memo: '' },
            { account_head_id: '', project_id: '', debit: '', credit: '', memo: '' },
        ];
    }

    return entry.lines.map((line) => ({
        account_head_id: String(line.account_head_id),
        project_id: line.project_id ? String(line.project_id) : '',
        debit: line.debit !== '0.00' ? line.debit : '',
        credit: line.credit !== '0.00' ? line.credit : '',
        memo: line.memo ?? '',
    }));
}

export function EditJournalEntryDialog({
    open,
    onClose,
    journalEntry,
    entryTypes,
    accountHeads,
    projects,
}: EditJournalEntryDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        date: toInputDate(journalEntry.date),
        description: journalEntry.description,
        type: journalEntry.type as JournalEntryType,
        lines: mapLinesToFormData(journalEntry),
    });

    useEffect(() => {
        setData({
            date: toInputDate(journalEntry.date),
            description: journalEntry.description,
            type: journalEntry.type,
            lines: mapLinesToFormData(journalEntry),
        });
    }, [journalEntry]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        put(update(journalEntry).url, {
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
                    <DialogTitle>Edit Journal Entry</DialogTitle>
                    <DialogDescription>
                        Update the details for{' '}
                        <strong>{journalEntry.reference}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="edit-date">Date</Label>
                                <Input
                                    id="edit-date"
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
                                <Label htmlFor="edit-type">Type</Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(value) =>
                                        setData(
                                            'type',
                                            value as JournalEntryType,
                                        )
                                    }
                                >
                                    <SelectTrigger id="edit-type">
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
                                <Label htmlFor="edit-description">
                                    Description
                                </Label>
                                <Input
                                    id="edit-description"
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

                    <div className="px-6">
                        <AttachmentList
                            attachments={journalEntry.attachments ?? []}
                            attachableType="journal_entry"
                            attachableId={journalEntry.id}
                            canUpload
                            canDelete
                        />
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
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
