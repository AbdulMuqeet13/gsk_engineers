import { useForm } from '@inertiajs/react';
import { DatePicker } from '@/components/date-picker';
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
import { store } from '@/actions/App/Http/Controllers/AccountTransferController';

type CreateAccountTransferDialogProps = {
    open: boolean;
    onClose: () => void;
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
    assetAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
};

export function CreateAccountTransferDialog({
    open,
    onClose,
    projects,
    assetAccounts,
}: CreateAccountTransferDialogProps) {
    const { data, setData, transform, post, processing, errors, reset } =
        useForm({
            from_account_id: '',
            to_account_id: '',
            project_id: '',
            amount: '',
            date: '',
            description: '',
            cheque_number: '',
        });

    transform((formData) => ({
        ...formData,
        project_id: formData.project_id || null,
    }));

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
                    <DialogTitle>New Account Transfer</DialogTitle>
                    <DialogDescription>
                        Move funds between accounts, e.g. Bank to Cash or
                        Receivable to Bank. A journal entry will be posted
                        immediately.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="create-account-transfer-from">
                                From Account
                            </Label>
                            <Select
                                value={data.from_account_id}
                                onValueChange={(value) =>
                                    setData('from_account_id', value)
                                }
                            >
                                <SelectTrigger
                                    id="create-account-transfer-from"
                                    className="w-full min-w-0"
                                >
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

                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="create-account-transfer-to">
                                To Account
                            </Label>
                            <Select
                                value={data.to_account_id}
                                onValueChange={(value) =>
                                    setData('to_account_id', value)
                                }
                            >
                                <SelectTrigger
                                    id="create-account-transfer-to"
                                    className="w-full min-w-0"
                                >
                                    <SelectValue placeholder="Select destination account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {assetAccounts
                                        .filter(
                                            (account) =>
                                                String(account.id) !==
                                                data.from_account_id,
                                        )
                                        .map((account) => (
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

                    <div className="min-w-0 space-y-2">
                        <Label htmlFor="create-account-transfer-project">
                            Project (optional)
                        </Label>
                        <Select
                            value={data.project_id}
                            onValueChange={(value) =>
                                setData('project_id', value)
                            }
                        >
                            <SelectTrigger
                                id="create-account-transfer-project"
                                className="w-full min-w-0"
                            >
                                <SelectValue placeholder="No project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">No project</SelectItem>
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
                        <p className="text-muted-foreground text-xs">
                            Tag a project to show this movement in its cashbook.
                        </p>
                        {errors.project_id && (
                            <p className="text-destructive text-sm">
                                {errors.project_id}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="create-account-transfer-amount">
                                Amount
                            </Label>
                            <Input
                                id="create-account-transfer-amount"
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

                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="create-account-transfer-date">
                                Date
                            </Label>
                            <DatePicker
                                id="create-account-transfer-date"
                                value={data.date}
                                onChange={(value) =>
                                    setData('date', value)
                                }
                            />
                            {errors.date && (
                                <p className="text-destructive text-sm">
                                    {errors.date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="create-account-transfer-description">
                                Description
                            </Label>
                            <Textarea
                                id="create-account-transfer-description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="e.g. Cash withdrawal for site expenses"
                                rows={3}
                                required
                            />
                            {errors.description && (
                                <p className="text-destructive text-sm">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="create-account-transfer-cheque">
                                Cheque No. (optional)
                            </Label>
                            <Input
                                id="create-account-transfer-cheque"
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
