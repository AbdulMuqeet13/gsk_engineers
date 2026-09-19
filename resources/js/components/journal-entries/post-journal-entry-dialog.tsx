import { router } from '@inertiajs/react';
import { useState } from 'react';
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
import { post } from '@/actions/App/Http/Controllers/JournalEntryController';

type PostJournalEntryDialogProps = {
    open: boolean;
    onClose: () => void;
    journalEntry: JournalEntry;
};

function computeTotal(entry: JournalEntry): string {
    if (!entry.lines || entry.lines.length === 0) {
        return '0.00';
    }

    let total = 0;

    for (const line of entry.lines) {
        total += parseFloat(line.debit || '0');
    }

    return total.toFixed(2);
}

export function PostJournalEntryDialog({
    open,
    onClose,
    journalEntry,
}: PostJournalEntryDialogProps) {
    const [processing, setProcessing] = useState(false);

    function handlePost() {
        setProcessing(true);

        router.post(post(journalEntry).url, {}, {
            onSuccess: () => onClose(),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Post Journal Entry</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to post this journal entry? Once
                        posted, it cannot be edited or deleted.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted/50 space-y-2 rounded-md border p-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Reference</span>
                        <span className="font-mono font-medium">
                            {journalEntry.reference}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Description
                        </span>
                        <span className="max-w-[200px] truncate font-medium">
                            {journalEntry.description}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Lines</span>
                        <span className="font-medium">
                            {journalEntry.lines_count ??
                                journalEntry.lines?.length ??
                                0}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Total Amount
                        </span>
                        <span className="font-mono font-medium">
                            {computeTotal(journalEntry)}
                        </span>
                    </div>
                </div>

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
                        onClick={handlePost}
                        disabled={processing}
                    >
                        {processing ? 'Posting...' : 'Post Entry'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
