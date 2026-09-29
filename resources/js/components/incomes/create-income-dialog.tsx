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
import { store } from '@/actions/App/Http/Controllers/ProjectIncomeController';

type CreateIncomeDialogProps = {
    open: boolean;
    onClose: () => void;
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
    incomeAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
    assetAccounts: Pick<AccountHead, 'id' | 'code' | 'name'>[];
};

const DEFAULT_INCOME_ACCOUNT_CODE = '4001';

export function CreateIncomeDialog({
    open,
    onClose,
    projects,
    incomeAccounts,
    assetAccounts,
}: CreateIncomeDialogProps) {
    const defaultIncomeAccount = incomeAccounts.find(
        (account) => account.code === DEFAULT_INCOME_ACCOUNT_CODE,
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        project_id: '',
        income_account_id: defaultIncomeAccount
            ? String(defaultIncomeAccount.id)
            : '',
        deposit_account_id: '',
        amount: '',
        date: '',
        received_from: '',
        description: '',
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
                    <DialogTitle>Record Income</DialogTitle>
                    <DialogDescription>
                        Record a payment received for a project. A journal entry
                        will be posted immediately.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="create-income-project">
                                Project
                            </Label>
                            <Select
                                value={data.project_id}
                                onValueChange={(value) =>
                                    setData('project_id', value)
                                }
                            >
                                <SelectTrigger
                                    id="create-income-project"
                                    className="w-full min-w-0"
                                >
                                    <SelectValue placeholder="Select project" />
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
                            {errors.project_id && (
                                <p className="text-destructive text-sm">
                                    {errors.project_id}
                                </p>
                            )}
                        </div>

                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="create-income-received-from">
                                Received From (optional)
                            </Label>
                            <Input
                                id="create-income-received-from"
                                value={data.received_from}
                                onChange={(e) =>
                                    setData('received_from', e.target.value)
                                }
                                placeholder="Client name"
                            />
                            {errors.received_from && (
                                <p className="text-destructive text-sm">
                                    {errors.received_from}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="create-income-account">
                                Income Account
                            </Label>
                            <Select
                                value={data.income_account_id}
                                onValueChange={(value) =>
                                    setData('income_account_id', value)
                                }
                            >
                                <SelectTrigger
                                    id="create-income-account"
                                    className="w-full min-w-0"
                                >
                                    <SelectValue placeholder="Select income account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {incomeAccounts.map((account) => (
                                        <SelectItem
                                            key={account.id}
                                            value={String(account.id)}
                                        >
                                            {account.code} - {account.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.income_account_id && (
                                <p className="text-destructive text-sm">
                                    {errors.income_account_id}
                                </p>
                            )}
                        </div>

                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="create-income-deposit-account">
                                Receive Into
                            </Label>
                            <Select
                                value={data.deposit_account_id}
                                onValueChange={(value) =>
                                    setData('deposit_account_id', value)
                                }
                            >
                                <SelectTrigger
                                    id="create-income-deposit-account"
                                    className="w-full min-w-0"
                                >
                                    <SelectValue placeholder="Cash, Bank, Receivable..." />
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
                            <p className="text-muted-foreground text-xs">
                                Pick Accounts Receivable if the client has not
                                paid yet.
                            </p>
                            {errors.deposit_account_id && (
                                <p className="text-destructive text-sm">
                                    {errors.deposit_account_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="min-w-0 space-y-2">
                            <Label htmlFor="create-income-amount">Amount</Label>
                            <Input
                                id="create-income-amount"
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
                            <Label htmlFor="create-income-date">Date</Label>
                            <DatePicker
                                id="create-income-date"
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
                            <Label htmlFor="create-income-description">
                                Description
                            </Label>
                            <Textarea
                                id="create-income-description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="e.g. Milestone 1 payment"
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
                            <Label htmlFor="create-income-cheque">
                                Cheque No. (optional)
                            </Label>
                            <Input
                                id="create-income-cheque"
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
                            {processing ? 'Recording...' : 'Record Income'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
