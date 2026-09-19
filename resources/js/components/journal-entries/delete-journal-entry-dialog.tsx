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
import type { JournalEntry } from '@/types';
import { destroy } from '@/actions/App/Http/Controllers/JournalEntryController';

type DeleteJournalEntryDialogProps = {
    open: boolean;
    onClose: () => void;
    journalEntry: JournalEntry;
};

export function DeleteJournalEntryDialog({
    open,
    onClose,
    journalEntry,
}: DeleteJournalEntryDialogProps) {
    const { delete: deleteRequest, processing } = useForm({});

    function handleDelete() {
        deleteRequest(destroy(journalEntry).url, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Journal Entry</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the journal entry{' '}
                        <strong>{journalEntry.reference}</strong>? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        {processing ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
