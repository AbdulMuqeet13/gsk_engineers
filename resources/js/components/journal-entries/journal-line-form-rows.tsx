import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { AccountHead, Project } from '@/types';

export type JournalLineFormData = {
    account_head_id: string;
    project_id: string;
    debit: string;
    credit: string;
    memo: string;
};

type JournalLineFormRowsProps = {
    lines: JournalLineFormData[];
    onChange: (lines: JournalLineFormData[]) => void;
    accountHeads: Pick<AccountHead, 'id' | 'code' | 'name'>[];
    projects: Pick<Project, 'id' | 'name' | 'code'>[];
    errors: Record<string, string>;
};

const emptyLine: JournalLineFormData = {
    account_head_id: '',
    project_id: '',
    debit: '',
    credit: '',
    memo: '',
};

export function JournalLineFormRows({
    lines,
    onChange,
    accountHeads,
    projects,
    errors,
}: JournalLineFormRowsProps) {
    function updateLine(
        index: number,
        field: keyof JournalLineFormData,
        value: string,
    ) {
        const updated = lines.map((line, i) => {
            if (i !== index) {
                return line;
            }

            const next = { ...line, [field]: value };

            if (field === 'debit' && value !== '' && value !== '0') {
                next.credit = '';
            } else if (field === 'credit' && value !== '' && value !== '0') {
                next.debit = '';
            }

            return next;
        });

        onChange(updated);
    }

    function addLine() {
        onChange([...lines, { ...emptyLine }]);
    }

    function removeLine(index: number) {
        if (lines.length <= 2) {
            return;
        }

        onChange(lines.filter((_, i) => i !== index));
    }

    const totalDebits = lines.reduce(
        (sum, line) => sum + parseFloat(line.debit || '0'),
        0,
    );
    const totalCredits = lines.reduce(
        (sum, line) => sum + parseFloat(line.credit || '0'),
        0,
    );
    const isBalanced =
        totalDebits > 0 &&
        totalCredits > 0 &&
        Math.abs(totalDebits - totalCredits) < 0.005;

    return (
        <div className="space-y-3">
            {/* Desktop: table layout */}
            <div className="hidden overflow-x-auto rounded-md border lg:block">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted/50 border-b">
                            <th className="px-3 py-2 text-left font-medium">
                                Account
                            </th>
                            <th className="px-3 py-2 text-left font-medium">
                                Project
                            </th>
                            <th className="px-3 py-2 text-right font-medium">
                                Debit
                            </th>
                            <th className="px-3 py-2 text-right font-medium">
                                Credit
                            </th>
                            <th className="px-3 py-2 text-left font-medium">
                                Memo
                            </th>
                            <th className="w-10 px-3 py-2">
                                <span className="sr-only">Remove</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {lines.map((line, index) => (
                            <tr key={index} className="border-b last:border-0">
                                <td className="px-3 py-2">
                                    <Select
                                        value={line.account_head_id}
                                        onValueChange={(value) =>
                                            updateLine(
                                                index,
                                                'account_head_id',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-8 w-[180px]">
                                            <SelectValue placeholder="Select account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accountHeads.map((account) => (
                                                <SelectItem
                                                    key={account.id}
                                                    value={String(account.id)}
                                                >
                                                    {account.code} -{' '}
                                                    {account.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors[
                                        `lines.${index}.account_head_id`
                                    ] && (
                                        <p className="text-destructive mt-1 text-xs">
                                            {
                                                errors[
                                                    `lines.${index}.account_head_id`
                                                ]
                                            }
                                        </p>
                                    )}
                                </td>
                                <td className="px-3 py-2">
                                    <Select
                                        value={line.project_id}
                                        onValueChange={(value) =>
                                            updateLine(
                                                index,
                                                'project_id',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-8 w-[160px]">
                                            <SelectValue placeholder="None" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">
                                                None
                                            </SelectItem>
                                            {projects.map((project) => (
                                                <SelectItem
                                                    key={project.id}
                                                    value={String(project.id)}
                                                >
                                                    {project.code} -{' '}
                                                    {project.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors[`lines.${index}.project_id`] && (
                                        <p className="text-destructive mt-1 text-xs">
                                            {
                                                errors[
                                                    `lines.${index}.project_id`
                                                ]
                                            }
                                        </p>
                                    )}
                                </td>
                                <td className="px-3 py-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={line.debit}
                                        onChange={(e) =>
                                            updateLine(
                                                index,
                                                'debit',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                        className="h-8 w-[100px] text-right"
                                    />
                                    {errors[`lines.${index}.debit`] && (
                                        <p className="text-destructive mt-1 text-xs">
                                            {errors[`lines.${index}.debit`]}
                                        </p>
                                    )}
                                </td>
                                <td className="px-3 py-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={line.credit}
                                        onChange={(e) =>
                                            updateLine(
                                                index,
                                                'credit',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                        className="h-8 w-[100px] text-right"
                                    />
                                    {errors[`lines.${index}.credit`] && (
                                        <p className="text-destructive mt-1 text-xs">
                                            {errors[`lines.${index}.credit`]}
                                        </p>
                                    )}
                                </td>
                                <td className="px-3 py-2">
                                    <Input
                                        value={line.memo}
                                        onChange={(e) =>
                                            updateLine(
                                                index,
                                                'memo',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Optional memo"
                                        className="h-8 w-[140px]"
                                    />
                                    {errors[`lines.${index}.memo`] && (
                                        <p className="text-destructive mt-1 text-xs">
                                            {errors[`lines.${index}.memo`]}
                                        </p>
                                    )}
                                </td>
                                <td className="px-3 py-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => removeLine(index)}
                                        disabled={lines.length <= 2}
                                    >
                                        <Trash2 className="size-4" />
                                        <span className="sr-only">
                                            Remove line
                                        </span>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-muted/50 border-t">
                            <td
                                colSpan={2}
                                className="px-3 py-2 text-right font-medium"
                            >
                                Totals
                            </td>
                            <td className="px-3 py-2 text-right">
                                <span className="font-mono font-medium">
                                    {totalDebits.toFixed(2)}
                                </span>
                            </td>
                            <td className="px-3 py-2 text-right">
                                <span className="font-mono font-medium">
                                    {totalCredits.toFixed(2)}
                                </span>
                            </td>
                            <td colSpan={2} className="px-3 py-2">
                                <BalanceBadge isBalanced={isBalanced} />
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Mobile: card layout */}
            <div className="space-y-3 lg:hidden">
                {lines.map((line, index) => (
                    <div
                        key={index}
                        className="bg-muted/30 rounded-lg border p-3"
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-muted-foreground text-xs font-medium">
                                Line {index + 1}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={() => removeLine(index)}
                                disabled={lines.length <= 2}
                            >
                                <Trash2 className="size-3.5" />
                                <span className="sr-only">Remove line</span>
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Account</Label>
                                <Select
                                    value={line.account_head_id}
                                    onValueChange={(value) =>
                                        updateLine(
                                            index,
                                            'account_head_id',
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger className="h-9 w-full">
                                        <SelectValue placeholder="Select account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accountHeads.map((account) => (
                                            <SelectItem
                                                key={account.id}
                                                value={String(account.id)}
                                            >
                                                {account.code} - {account.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors[
                                    `lines.${index}.account_head_id`
                                ] && (
                                    <p className="text-destructive text-xs">
                                        {
                                            errors[
                                                `lines.${index}.account_head_id`
                                            ]
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs">Project</Label>
                                <Select
                                    value={line.project_id}
                                    onValueChange={(value) =>
                                        updateLine(
                                            index,
                                            'project_id',
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger className="h-9 w-full">
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">None</SelectItem>
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
                                {errors[`lines.${index}.project_id`] && (
                                    <p className="text-destructive text-xs">
                                        {errors[`lines.${index}.project_id`]}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Debit</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={line.debit}
                                        onChange={(e) =>
                                            updateLine(
                                                index,
                                                'debit',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                        className="h-9 text-right"
                                    />
                                    {errors[`lines.${index}.debit`] && (
                                        <p className="text-destructive text-xs">
                                            {errors[`lines.${index}.debit`]}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Credit</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={line.credit}
                                        onChange={(e) =>
                                            updateLine(
                                                index,
                                                'credit',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                        className="h-9 text-right"
                                    />
                                    {errors[`lines.${index}.credit`] && (
                                        <p className="text-destructive text-xs">
                                            {errors[`lines.${index}.credit`]}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs">Memo</Label>
                                <Input
                                    value={line.memo}
                                    onChange={(e) =>
                                        updateLine(
                                            index,
                                            'memo',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Optional memo"
                                    className="h-9"
                                />
                                {errors[`lines.${index}.memo`] && (
                                    <p className="text-destructive text-xs">
                                        {errors[`lines.${index}.memo`]}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Mobile totals */}
                <div className="bg-muted/50 flex items-center justify-between rounded-lg border px-3 py-2">
                    <div className="flex gap-4 text-sm">
                        <span>
                            Debits:{' '}
                            <span className="font-mono font-medium">
                                {totalDebits.toFixed(2)}
                            </span>
                        </span>
                        <span>
                            Credits:{' '}
                            <span className="font-mono font-medium">
                                {totalCredits.toFixed(2)}
                            </span>
                        </span>
                    </div>
                    <BalanceBadge isBalanced={isBalanced} />
                </div>
            </div>

            {errors.lines && (
                <p className="text-destructive text-sm">{errors.lines}</p>
            )}

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLine}
            >
                <Plus className="mr-2 size-4" />
                Add Line
            </Button>
        </div>
    );
}

function BalanceBadge({ isBalanced }: { isBalanced: boolean }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                isBalanced
                    ? 'bg-success/15 text-success'
                    : 'bg-destructive/15 text-destructive',
            )}
        >
            {isBalanced ? 'Balanced' : 'Unbalanced'}
        </span>
    );
}
