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
import { destroy } from '@/actions/App/Http/Controllers/ProjectController';
import type { Project } from '@/types';

type DeleteProjectDialogProps = {
    open: boolean;
    onClose: () => void;
    project: Project;
};

export function DeleteProjectDialog({
    open,
    onClose,
    project,
}: DeleteProjectDialogProps) {
    const { delete: destroyProject, processing } = useForm({});

    function handleDelete() {
        destroyProject(destroy(project).url, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the project{' '}
                        <strong>
                            {project.name} ({project.code})
                        </strong>
                        ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        Delete Project
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
