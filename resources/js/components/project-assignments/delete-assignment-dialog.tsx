import { useForm } from '@inertiajs/react';
import ProjectAssignmentController from '@/actions/App/Http/Controllers/ProjectAssignmentController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ProjectAssignment } from '@/types';

type DeleteAssignmentDialogProps = {
    open: boolean;
    onClose: () => void;
    assignment: ProjectAssignment;
};

export function DeleteAssignmentDialog({
    open,
    onClose,
    assignment,
}: DeleteAssignmentDialogProps) {
    const { delete: destroy, processing } = useForm({});

    function handleDelete() {
        destroy(ProjectAssignmentController.destroy(assignment).url, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remove Assignment</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to remove{' '}
                        <strong>{assignment.employee?.name}</strong> from{' '}
                        <strong>{assignment.project?.name}</strong>? This action
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
                        {processing ? 'Removing...' : 'Remove'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
