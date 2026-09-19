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
import type { AccountHead, AccountType, NormalBalance } from '@/types';
import { update } from '@/actions/App/Http/Controllers/AccountHeadController';

type EditAccountHeadDialogProps = {
    open: boolean;
    onClose: () => void;
    accountHead: AccountHead;
    accountTypes: AccountType[];
    normalBalances: NormalBalance[];
    parentAccounts: Pick<AccountHead, 'id' | 'name' | 'code'>[];
};

const normalBalanceDefaults: Record<AccountType, NormalBalance> = {
    asset: 'debit',
    expense: 'debit',
    liability: 'credit',
    equity: 'credit',
    income: 'credit',
};

export function EditAccountHeadDialog({
    open,
    onClose,
    accountHead,
    accountTypes,
    normalBalances,
    parentAccounts,
}: EditAccountHeadDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        code: accountHead.code,
        name: accountHead.name,
        type: accountHead.type as AccountType,
        normal_balance: accountHead.normal_balance as NormalBalance,
        parent_id: accountHead.parent_id ? String(accountHead.parent_id) : '',
        is_active: accountHead.is_active,
    });

    useEffect(() => {
        setData({
            code: accountHead.code,
            name: accountHead.name,
            type: accountHead.type,
            normal_balance: accountHead.normal_balance,
            parent_id: accountHead.parent_id
                ? String(accountHead.parent_id)
                : '',
            is_active: accountHead.is_active,
        });
    }, [accountHead]);

    useEffect(() => {
        if (data.type && data.type in normalBalanceDefaults) {
            setData(
                'normal_balance',
                normalBalanceDefaults[data.type as AccountType],
            );
        }
    }, [data.type]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        put(update(accountHead).url, {
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

    /** Exclude the current account and its descendants from parent options. */
    const availableParents = parentAccounts.filter(
        (account) => account.id !== accountHead.id,
    );

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Account Head</DialogTitle>
                    <DialogDescription>
                        Update the details for{' '}
                        <strong>
                            {accountHead.code} - {accountHead.name}
                        </strong>
                        .
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-code">Code</Label>
                            <Input
                                id="edit-code"
                                value={data.code}
                                onChange={(e) =>
                                    setData('code', e.target.value)
                                }
                                placeholder="e.g. 1000"
                            />
                            {errors.code && (
                                <p className="text-destructive text-sm">
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="e.g. Cash"
                            />
                            {errors.name && (
                                <p className="text-destructive text-sm">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-type">Type</Label>
                            <Select
                                value={data.type}
                                onValueChange={(value) =>
                                    setData('type', value as AccountType)
                                }
                            >
                                <SelectTrigger id="edit-type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accountTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.charAt(0).toUpperCase() +
                                                type.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-destructive text-sm">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-normal-balance">
                                Normal Balance
                            </Label>
                            <Select
                                value={data.normal_balance}
                                onValueChange={(value) =>
                                    setData(
                                        'normal_balance',
                                        value as NormalBalance,
                                    )
                                }
                            >
                                <SelectTrigger id="edit-normal-balance">
                                    <SelectValue placeholder="Select balance" />
                                </SelectTrigger>
                                <SelectContent>
                                    {normalBalances.map((balance) => (
                                        <SelectItem
                                            key={balance}
                                            value={balance}
                                        >
                                            {balance.charAt(0).toUpperCase() +
                                                balance.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.normal_balance && (
                                <p className="text-destructive text-sm">
                                    {errors.normal_balance}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-parent">Parent Account</Label>
                        <Select
                            value={data.parent_id}
                            onValueChange={(value) =>
                                setData('parent_id', value)
                            }
                        >
                            <SelectTrigger id="edit-parent">
                                <SelectValue placeholder="None (top-level)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">None (top-level)</SelectItem>
                                {availableParents.map((account) => (
                                    <SelectItem
                                        key={account.id}
                                        value={String(account.id)}
                                    >
                                        {account.code} - {account.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.parent_id && (
                            <p className="text-destructive text-sm">
                                {errors.parent_id}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="edit-is-active"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                            className="size-4 rounded border"
                        />
                        <Label htmlFor="edit-is-active">Active</Label>
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
