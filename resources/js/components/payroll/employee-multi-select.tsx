import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Employee } from '@/types';

type EmployeeMultiSelectProps = {
    id?: string;
    employees: Pick<Employee, 'id' | 'name' | 'designation'>[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder: string;
};

export function EmployeeMultiSelect({
    id,
    employees,
    value,
    onChange,
    placeholder,
}: EmployeeMultiSelectProps) {
    const [open, setOpen] = useState(false);
    const selectedIds = new Set(value);

    function toggle(employeeId: string) {
        const next = new Set(selectedIds);

        if (next.has(employeeId)) {
            next.delete(employeeId);
        } else {
            next.add(employeeId);
        }

        onChange(Array.from(next));
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                >
                    <span
                        className={cn(
                            'truncate',
                            selectedIds.size === 0 && 'text-muted-foreground',
                        )}
                    >
                        {selectedIds.size > 0
                            ? `${selectedIds.size} employee(s) selected`
                            : placeholder}
                    </span>
                    <ChevronsUpDown className="size-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0"
                align="start"
            >
                <Command>
                    <CommandInput placeholder="Search employees..." />
                    <CommandList>
                        <CommandEmpty>No employees found.</CommandEmpty>
                        <CommandGroup>
                            {employees.map((employee) => {
                                const employeeId = String(employee.id);
                                const isSelected = selectedIds.has(employeeId);

                                return (
                                    <CommandItem
                                        key={employee.id}
                                        value={`${employee.name} ${employee.designation}`}
                                        onSelect={() => toggle(employeeId)}
                                    >
                                        <div
                                            className={cn(
                                                'border-primary mr-2 flex size-4 items-center justify-center rounded-sm border',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'opacity-50 [&_svg]:invisible',
                                            )}
                                        >
                                            <Check className="size-3" />
                                        </div>
                                        <span>
                                            {employee.name} — {employee.designation}
                                        </span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                    {selectedIds.size > 0 && (
                        <>
                            <Separator />
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => onChange([])}
                                    className="justify-center text-center"
                                >
                                    Clear selection
                                </CommandItem>
                            </CommandGroup>
                        </>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
}
