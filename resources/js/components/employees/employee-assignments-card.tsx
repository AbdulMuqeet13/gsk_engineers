import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatAmount } from '@/lib/utils';
import type { ProjectAssignment } from '@/types';

type EmployeeAssignmentsCardProps = {
    assignments: ProjectAssignment[];
};

export function EmployeeAssignmentsCard({
    assignments,
}: EmployeeAssignmentsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Assignments</CardTitle>
                <CardDescription>
                    Allowances are added to payroll and charged to the project.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                {assignments.length === 0 && (
                    <p className="text-muted-foreground">No assignments.</p>
                )}
                {assignments.map((assignment) => (
                    <div
                        key={assignment.id}
                        className="space-y-1 rounded-md border p-3"
                    >
                        <div className="flex justify-between gap-2">
                            <span className="min-w-0 truncate font-medium">
                                {assignment.project?.code} -{' '}
                                {assignment.project?.name}
                            </span>
                            <span className="text-muted-foreground shrink-0">
                                {assignment.allocation_percent}%
                            </span>
                        </div>
                        <p className="text-muted-foreground">
                            {assignment.role}
                        </p>
                        {(assignment.allowances ?? []).map((allowance) => (
                            <div
                                key={allowance.id}
                                className="flex justify-between"
                            >
                                <span>{allowance.name}</span>
                                <span className="font-mono">
                                    {formatAmount(allowance.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
