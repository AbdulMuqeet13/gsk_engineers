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
import type { AccountHead } from '@/types';
import { destroy } from '@/actions/App/Http/Controllers/AccountHeadController';

type DeleteAccountHeadDialogProps = {
    open: boolean;
    onClose: () => void;
    accountHead: AccountHead;
};

export function DeleteAccountHeadDialog({
    open,
    onClose,
    accountHead,
}: DeleteAccountHeadDialogProps) {
    const { delete: deleteRequest, processing } = useForm({});

    function handleDelete() {
        deleteRequest(destroy(accountHead).url, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Account Head</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the account{' '}
                        <strong>
                            {accountHead.code} - {accountHead.name}
                        </strong>
                        ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {accountHead.children_count !== undefined &&
                    accountHead.children_count > 0 && (
                        <p className="text-destructive text-sm">
                            This account has {accountHead.children_count} child
                            account(s). You must reassign or delete them first.
                        </p>
                    )}

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
