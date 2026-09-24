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
import { store } from '@/actions/App/Http/Controllers/ExpenseController';

type CreateExpenseDialogProps = {
    open: boolean;
    onClose: () => void;
    expenseAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
    paymentAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
};

export function CreateExpenseDialog({
    open,
    onClose,
    expenseAccounts,
    paymentAccounts,
    projects,
}: CreateExpenseDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        date: '',
        description: '',
        amount: '',
        account_head_id: '',
        payment_account_id: '',
        project_id: '',
        notes: '',
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
                    <DialogTitle>Create Expense</DialogTitle>
                    <DialogDescription>
                        Record a new expense entry.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="create-description">Description</Label>
                        <Input
                            id="create-description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Expense description"
                            required
                        />
                        {errors.description && (
                            <p className="text-destructive text-sm">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-account-head">
                                Expense Category
                            </Label>
                            <Select
                                value={data.account_head_id}
                                onValueChange={(value) =>
                                    setData('account_head_id', value)
                                }
                            >
                                <SelectTrigger id="create-account-head">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {expenseAccounts.map((account) => (
                                        <SelectItem
                                            key={account.id}
                                            value={String(account.id)}
                                        >
                                            {account.code} - {account.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.account_head_id && (
                                <p className="text-destructive text-sm">
                                    {errors.account_head_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-payment-account">
                                Payment Account
                            </Label>
                            <Select
                                value={data.payment_account_id}
                                onValueChange={(value) =>
                                    setData('payment_account_id', value)
                                }
                            >
                                <SelectTrigger id="create-payment-account">
                                    <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentAccounts.map((account) => (
                                        <SelectItem
                                            key={account.id}
                                            value={String(account.id)}
                                        >
                                            {account.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.payment_account_id && (
                                <p className="text-destructive text-sm">
                                    {errors.payment_account_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="create-project">Project (optional)</Label>
                        <Select
                            value={data.project_id}
                            onValueChange={(value) =>
                                setData('project_id', value)
                            }
                        >
                            <SelectTrigger id="create-project">
                                <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {projects.map((project) => (
                                    <SelectItem
                                        key={project.id}
                                        value={String(project.id)}
                                    >
                                        {project.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.project_id && (
                            <p className="text-destructive text-sm">
                                {errors.project_id}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-notes">
                                Notes (optional)
                            </Label>
                            <Textarea
                                id="create-notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                placeholder="Additional notes"
                                rows={3}
                            />
                            {errors.notes && (
                                <p className="text-destructive text-sm">
                                    {errors.notes}
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
                            {processing ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
