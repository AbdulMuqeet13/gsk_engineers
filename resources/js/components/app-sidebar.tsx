import { Link, usePage } from '@inertiajs/react';
import {
    ArrowLeftRight,
    BarChart3,
    BookOpen,
    FolderKanban,
    LayoutGrid,
    Receipt,
    Settings,
    Users,
    Wallet,
} from 'lucide-react';
import { useMemo } from 'react';
import AccountHeadController from '@/actions/App/Http/Controllers/AccountHeadController';
import EmployeeController from '@/actions/App/Http/Controllers/EmployeeController';
import AttendanceController from '@/actions/App/Http/Controllers/AttendanceController';
import ExpenseController from '@/actions/App/Http/Controllers/ExpenseController';
import GeneralLedgerController from '@/actions/App/Http/Controllers/GeneralLedgerController';
import BalanceSheetController from '@/actions/App/Http/Controllers/BalanceSheetController';
import IncomeExpenseSummaryController from '@/actions/App/Http/Controllers/IncomeExpenseSummaryController';
import InterProjectPositionController from '@/actions/App/Http/Controllers/InterProjectPositionController';
import InterProjectTransferController from '@/actions/App/Http/Controllers/InterProjectTransferController';
import LeaveRequestController from '@/actions/App/Http/Controllers/LeaveRequestController';
import JournalEntryController from '@/actions/App/Http/Controllers/JournalEntryController';
import ProjectAssignmentController from '@/actions/App/Http/Controllers/ProjectAssignmentController';
import PayrollReportController from '@/actions/App/Http/Controllers/PayrollReportController';
import PayrollRunController from '@/actions/App/Http/Controllers/PayrollRunController';
import ProfitAndLossController from '@/actions/App/Http/Controllers/ProfitAndLossController';
import ProjectCashbookController from '@/actions/App/Http/Controllers/ProjectCashbookController';
import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
import ProjectLedgerController from '@/actions/App/Http/Controllers/ProjectLedgerController';
import TrialBalanceController from '@/actions/App/Http/Controllers/TrialBalanceController';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { filterNavByPermissions } from '@/lib/filter-nav-items';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Projects',
        href: ProjectController.index().url,
        icon: FolderKanban,
        permission: 'projects.view',
        children: [
            {
                title: 'All Projects',
                href: ProjectController.index().url,
                permission: 'projects.view',
            },
            {
                title: 'Assignments',
                href: ProjectAssignmentController.index().url,
                permission: 'projects.assign',
            },
        ],
    },
    {
        title: 'Employees',
        href: EmployeeController.index().url,
        icon: Users,
        permission: 'employees.view',
        children: [
            {
                title: 'All Employees',
                href: EmployeeController.index().url,
                permission: 'employees.view',
            },
            {
                title: 'Attendance',
                href: AttendanceController.index().url,
                permission: 'attendance.view',
            },
            {
                title: 'Leave',
                href: LeaveRequestController.index().url,
                permission: 'leave.view',
            },
        ],
    },
    {
        title: 'Accounting',
        href: JournalEntryController.index().url,
        icon: BookOpen,
        permission: 'accounting.view',
        children: [
            {
                title: 'Chart of Accounts',
                href: AccountHeadController.index().url,
                permission: 'chart-of-accounts.view',
            },
            {
                title: 'Journal Entries',
                href: JournalEntryController.index().url,
                permission: 'accounting.view',
            },
            {
                title: 'General Ledger',
                href: GeneralLedgerController.index().url,
                permission: 'accounting.view',
            },
            {
                title: 'Trial Balance',
                href: TrialBalanceController.index().url,
                permission: 'accounting.view',
            },
        ],
    },
    {
        title: 'Expenses',
        href: ExpenseController.index().url,
        icon: Receipt,
        permission: 'expenses.view',
    },
    {
        title: 'Transfers',
        href: InterProjectTransferController.index().url,
        icon: ArrowLeftRight,
        permission: 'transfers.view',
    },
    {
        title: 'Payroll',
        href: PayrollRunController.index().url,
        icon: Wallet,
        permission: 'payroll.view',
    },
    {
        title: 'Reports',
        href: InterProjectPositionController.index().url,
        icon: BarChart3,
        permission: 'reports.view',
        children: [
            {
                title: 'Profit & Loss',
                href: ProfitAndLossController.index().url,
                permission: 'reports.financial',
            },
            {
                title: 'Balance Sheet',
                href: BalanceSheetController.index().url,
                permission: 'reports.financial',
            },
            {
                title: 'Income & Expense Summary',
                href: IncomeExpenseSummaryController.index().url,
                permission: 'reports.financial',
            },
            {
                title: 'Project Cashbook',
                href: ProjectCashbookController.index().url,
                permission: 'reports.project',
            },
            {
                title: 'Project Ledger',
                href: ProjectLedgerController.index().url,
                permission: 'reports.project',
            },
            {
                title: 'Inter-Project Position',
                href: InterProjectPositionController.index().url,
                permission: 'transfers.view',
            },
            {
                title: 'Payroll Report',
                href: PayrollReportController.index().url,
                permission: 'reports.payroll',
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const permissions = (auth.permissions ?? []) as string[];

    const filteredNavItems = useMemo(
        () => filterNavByPermissions(mainNavItems, permissions),
        [permissions],
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
