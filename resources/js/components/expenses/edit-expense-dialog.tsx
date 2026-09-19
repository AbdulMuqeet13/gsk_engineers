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
import { Textarea } from '@/components/ui/textarea';
import type { AccountHead, Expense, Project } from '@/types';
import { update } from '@/actions/App/Http/Controllers/ExpenseController';

type EditExpenseDialogProps = {
    open: boolean;
    onClose: () => void;
    expense: Expense;
    expenseAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
    paymentAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
};

export function EditExpenseDialog({
    open,
    onClose,
    expense,
    expenseAccounts,
    paymentAccounts,
    projects,
}: EditExpenseDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        date: expense.date.split('T')[0],
        description: expense.description,
        amount: expense.amount,
        account_head_id: String(expense.account_head_id),
        payment_account_id: String(expense.payment_account_id),
        project_id: expense.project_id?.toString() ?? '',
        notes: expense.notes ?? '',
    });

    useEffect(() => {
        setData({
            date: expense.date.split('T')[0],
            description: expense.description,
            amount: expense.amount,
            account_head_id: String(expense.account_head_id),
            payment_account_id: String(expense.payment_account_id),
            project_id: expense.project_id?.toString() ?? '',
            notes: expense.notes ?? '',
        });
    }, [expense]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        put(update(expense).url, {
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
                    <DialogTitle>Edit Expense</DialogTitle>
                    <DialogDescription>
                        Update the details for{' '}
                        <strong>{expense.reference}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-date">Date</Label>
                            <Input
                                id="edit-date"
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
                            <Label htmlFor="edit-amount">Amount</Label>
                            <Input
                                id="edit-amount"
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
                        <Label htmlFor="edit-description">Description</Label>
                        <Input
                            id="edit-description"
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
                            <Label htmlFor="edit-account-head">
                                Expense Category
                            </Label>
                            <Select
                                value={data.account_head_id}
                                onValueChange={(value) =>
                                    setData('account_head_id', value)
                                }
                            >
                                <SelectTrigger id="edit-account-head">
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
                            <Label htmlFor="edit-payment-account">
                                Payment Account
                            </Label>
                            <Select
                                value={data.payment_account_id}
                                onValueChange={(value) =>
                                    setData('payment_account_id', value)
                                }
                            >
                                <SelectTrigger id="edit-payment-account">
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
                        <Label htmlFor="edit-project">Project (optional)</Label>
                        <Select
                            value={data.project_id}
                            onValueChange={(value) =>
                                setData('project_id', value)
                            }
                        >
                            <SelectTrigger id="edit-project">
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

                    <div className="space-y-2">
                        <Label htmlFor="edit-notes">Notes (optional)</Label>
                        <Textarea
                            id="edit-notes"
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
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
