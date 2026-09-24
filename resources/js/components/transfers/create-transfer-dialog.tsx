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
import { Textarea } from '@/components/ui/textarea';
import type { AccountHead, Project } from '@/types';
import { store } from '@/actions/App/Http/Controllers/InterProjectTransferController';

type CreateTransferDialogProps = {
    open: boolean;
    onClose: () => void;
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
    assetAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
};

export function CreateTransferDialog({
    open,
    onClose,
    projects,
    assetAccounts,
}: CreateTransferDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        from_project_id: '',
        to_project_id: '',
        from_account_id: '',
        to_account_id: '',
        amount: '',
        date: '',
        purpose: '',
        cheque_number: '',
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Transfer</DialogTitle>
                    <DialogDescription>
                        Transfer funds between projects. A journal entry will be
                        posted immediately.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-from-project">
                                From Project
                            </Label>
                            <Select
                                value={data.from_project_id}
                                onValueChange={(value) =>
                                    setData('from_project_id', value)
                                }
                            >
                                <SelectTrigger id="create-from-project">
                                    <SelectValue placeholder="Select source project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map((project) => (
                                        <SelectItem
                                            key={project.id}
                                            value={String(project.id)}
                                        >
                                            {project.code} - {project.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.from_project_id && (
                                <p className="text-destructive text-sm">
                                    {errors.from_project_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-to-project">
                                To Project
                            </Label>
                            <Select
                                value={data.to_project_id}
                                onValueChange={(value) =>
                                    setData('to_project_id', value)
                                }
                            >
                                <SelectTrigger id="create-to-project">
                                    <SelectValue placeholder="Select target project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map((project) => (
                                        <SelectItem
                                            key={project.id}
                                            value={String(project.id)}
                                        >
                                            {project.code} - {project.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.to_project_id && (
                                <p className="text-destructive text-sm">
                                    {errors.to_project_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-from-account">
                                From Account
                            </Label>
                            <Select
                                value={data.from_account_id}
                                onValueChange={(value) =>
                                    setData('from_account_id', value)
                                }
                            >
                                <SelectTrigger id="create-from-account">
                                    <SelectValue placeholder="Select source account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {assetAccounts.map((account) => (
                                        <SelectItem
                                            key={account.id}
                                            value={String(account.id)}
                                        >
                                            {account.code} - {account.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.from_account_id && (
                                <p className="text-destructive text-sm">
                                    {errors.from_account_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-to-account">
                                To Account
                            </Label>
                            <Select
                                value={data.to_account_id}
                                onValueChange={(value) =>
                                    setData('to_account_id', value)
                                }
                            >
                                <SelectTrigger id="create-to-account">
                                    <SelectValue placeholder="Select target account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {assetAccounts.map((account) => (
                                        <SelectItem
                                            key={account.id}
                                            value={String(account.id)}
                                        >
                                            {account.code} - {account.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.to_account_id && (
                                <p className="text-destructive text-sm">
                                    {errors.to_account_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-amount">Amount</Label>
                            <Input
                                id="create-amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.amount}
                                onChange={(e) =>
                                    setData('amount', e.target.value)
                                }
                                placeholder="0.00"
                                required
                            />
                            {errors.amount && (
                                <p className="text-destructive text-sm">
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-date">Date</Label>
                            <Input
                                id="create-date"
                                type="date"
                                value={data.date}
                                onChange={(e) =>
                                    setData('date', e.target.value)
                                }
                                required
                            />
                            {errors.date && (
                                <p className="text-destructive text-sm">
                                    {errors.date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-purpose">Purpose</Label>
                            <Textarea
                                id="create-purpose"
                                value={data.purpose}
                                onChange={(e) =>
                                    setData('purpose', e.target.value)
                                }
                                placeholder="Reason for the transfer"
                                rows={3}
                                required
                            />
                            {errors.purpose && (
                                <p className="text-destructive text-sm">
                                    {errors.purpose}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-cheque">
                                Cheque No. (optional)
                            </Label>
                            <Input
                                id="create-cheque"
                                value={data.cheque_number}
                                onChange={(e) =>
                                    setData('cheque_number', e.target.value)
                                }
                                placeholder="e.g. CHQ-001234"
                            />
                            {errors.cheque_number && (
                                <p className="text-destructive text-sm">
                                    {errors.cheque_number}
                                </p>
                            )}
                        </div>
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
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Transferring...' : 'Transfer'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
