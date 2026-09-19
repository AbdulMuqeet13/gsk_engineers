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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { JournalEntry } from '@/types';
import { reverse } from '@/actions/App/Http/Controllers/JournalEntryController';

type ReverseJournalEntryDialogProps = {
    open: boolean;
    onClose: () => void;
    journalEntry: JournalEntry;
};

export function ReverseJournalEntryDialog({
    open,
    onClose,
    journalEntry,
}: ReverseJournalEntryDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        reason: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(reverse(journalEntry).url, {
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reverse Journal Entry</DialogTitle>
                    <DialogDescription>
                        This will create a new reversing entry for{' '}
                        <strong>{journalEntry.reference}</strong> with all
                        debits and credits swapped.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reverse-reason">
                            Reason (optional)
                        </Label>
                        <Textarea
                            id="reverse-reason"
                            value={data.reason}
                            onChange={(e) =>
                                setData('reason', e.target.value)
                            }
                            placeholder="Why is this entry being reversed?"
                            rows={3}
                        />
                        {errors.reason && (
                            <p className="text-destructive text-sm">
                                {errors.reason}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={processing}
                        >
                            {processing ? 'Reversing...' : 'Reverse Entry'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
