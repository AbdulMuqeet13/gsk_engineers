import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    Banknote,
    ClipboardList,
    FolderKanban,
    TrendingDown,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { ChartTooltip, PieTooltip } from '@/components/dashboard/chart-tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type {
    CategoryBreakdown,
    DashboardKpis,
    MonthlyTrend,
    ProjectBreakdown,
} from '@/types';
import { index } from '@/actions/App/Http/Controllers/DashboardController';
import ExpenseController from '@/actions/App/Http/Controllers/ExpenseController';
import PayrollRunController from '@/actions/App/Http/Controllers/PayrollRunController';
import ProjectController from '@/actions/App/Http/Controllers/ProjectController';

type DashboardPageProps = {
    kpis: DashboardKpis;
    monthlyTrend: MonthlyTrend[];
    expenseByCategory: CategoryBreakdown[];
    projectBreakdown: ProjectBreakdown[];
};

const CHART_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
];

function formatAmount(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }

    if (num >= 1000) {
        return `${(num / 1000).toFixed(0)}K`;
    }

    return num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

function ChartLegend({ payload }: { payload?: Array<{ value: string; color: string }> }) {
    if (!payload?.length) {
        return null;
    }

    return (
        <div className="flex justify-center gap-4 pt-2">
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5">
                    <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-muted-foreground text-xs">{entry.value}</span>
                </div>
            ))}
        </div>
    );
}

export default function Dashboard({
    kpis,
    monthlyTrend,
    expenseByCategory,
    projectBreakdown,
}: DashboardPageProps) {
    const netProfitValue = parseFloat(kpis.netProfit);
    const isLoss = netProfitValue < 0;

    const trendData = monthlyTrend.map((item) => ({
        month: item.month,
        income: parseFloat(item.income),
        expenses: parseFloat(item.expenses),
    }));

    const pieData = expenseByCategory.map((item) => ({
        name: item.name,
        value: parseFloat(item.value),
    }));

    const projectData = projectBreakdown.map((item) => ({
        name: item.code,
        income: parseFloat(item.income),
        expenses: parseFloat(item.expenses),
    }));

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* KPI Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <KpiCard
                        title="Monthly Income"
                        value={kpis.totalIncome}
                        icon={TrendingUp}
                        variant="success"
                    />
                    <KpiCard
                        title="Monthly Expenses"
                        value={kpis.totalExpenses}
                        icon={TrendingDown}
                        variant="destructive"
                    />
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">
                                {isLoss ? 'Net Loss' : 'Net Profit'}
                            </CardTitle>
                            <div
                                className={`flex size-8 items-center justify-center rounded-lg ${
                                    isLoss
                                        ? 'bg-destructive/10 text-destructive'
                                        : 'bg-success/10 text-success'
                                }`}
                            >
                                {isLoss ? (
                                    <ArrowDownRight className="size-4" />
                                ) : (
                                    <ArrowUpRight className="size-4" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-2xl font-bold ${
                                    isLoss
                                        ? 'text-destructive'
                                        : 'text-success'
                                }`}
                            >
                                {formatAmount(kpis.netProfit)}
                            </div>
                        </CardContent>
                    </Card>
                    <KpiCard
                        title="Cash Balance"
                        value={kpis.cashBalance}
                        icon={Banknote}
                        variant="info"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 lg:grid-cols-7">
                    {/* Monthly Trend — takes more space */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Income vs Expenses
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {trendData.length > 0 ? (
                                <ResponsiveContainer
                                    width="100%"
                                    height={300}
                                >
                                    <BarChart
                                        data={trendData}
                                        barGap={4}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="var(--border)"
                                        />
                                        <XAxis
                                            dataKey="month"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            stroke="var(--muted-foreground)"
                                        />
                                        <YAxis
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            stroke="var(--muted-foreground)"
                                            tickFormatter={(v) =>
                                                formatAmount(v)
                                            }
                                            width={50}
                                        />
                                        <Tooltip
                                            content={<ChartTooltip />}
                                            cursor={{ fill: 'var(--accent)', opacity: 0.5 }}
                                        />
                                        <Legend content={<ChartLegend />} />
                                        <Bar
                                            dataKey="income"
                                            fill="var(--success)"
                                            radius={[4, 4, 0, 0]}
                                            name="Income"
                                            maxBarSize={40}
                                        />
                                        <Bar
                                            dataKey="expenses"
                                            fill="var(--destructive)"
                                            radius={[4, 4, 0, 0]}
                                            name="Expenses"
                                            maxBarSize={40}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-muted-foreground flex h-[300px] items-center justify-center text-sm">
                                    No data for this period.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Expense by Category — pie chart */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Expense Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pieData.length > 0 ? (
                                <div>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={220}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={90}
                                                strokeWidth={2}
                                                stroke="var(--card)"
                                            >
                                                {pieData.map((_, i) => (
                                                    <Cell
                                                        key={i}
                                                        fill={
                                                            CHART_COLORS[
                                                                i %
                                                                    CHART_COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<PieTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 px-2">
                                        {pieData.map((item, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2"
                                            >
                                                <span
                                                    className="size-2.5 shrink-0 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            CHART_COLORS[
                                                                i %
                                                                    CHART_COLORS.length
                                                            ],
                                                    }}
                                                />
                                                <span className="text-muted-foreground truncate text-xs">
                                                    {item.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted-foreground flex h-[300px] items-center justify-center text-sm">
                                    No expenses this month.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Project Breakdown + Summary Cards */}
                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Project Breakdown */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Project Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {projectData.length > 0 ? (
                                <ResponsiveContainer
                                    width="100%"
                                    height={Math.max(
                                        projectData.length * 60,
                                        180,
                                    )}
                                >
                                    <BarChart
                                        data={projectData}
                                        layout="vertical"
                                        barGap={2}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            horizontal={false}
                                            stroke="var(--border)"
                                        />
                                        <XAxis
                                            type="number"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            stroke="var(--muted-foreground)"
                                            tickFormatter={(v) =>
                                                formatAmount(v)
                                            }
                                        />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            stroke="var(--muted-foreground)"
                                            width={70}
                                        />
                                        <Tooltip
                                            content={<ChartTooltip />}
                                            cursor={{ fill: 'var(--accent)', opacity: 0.5 }}
                                        />
                                        <Legend content={<ChartLegend />} />
                                        <Bar
                                            dataKey="income"
                                            fill="var(--success)"
                                            radius={[0, 4, 4, 0]}
                                            name="Income"
                                            maxBarSize={24}
                                        />
                                        <Bar
                                            dataKey="expenses"
                                            fill="var(--destructive)"
                                            radius={[0, 4, 4, 0]}
                                            name="Expenses"
                                            maxBarSize={24}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-muted-foreground flex h-[180px] items-center justify-center text-sm">
                                    No project data available.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Summary Cards */}
                    <div className="flex flex-col gap-4">
                        <Link
                            href={ProjectController.index().url}
                            className="flex-1"
                        >
                            <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-muted-foreground text-sm font-medium">
                                        Active Projects
                                    </CardTitle>
                                    <div className="bg-info/10 text-info flex size-8 items-center justify-center rounded-lg">
                                        <FolderKanban className="size-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">
                                        {kpis.activeProjects}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link
                            href={PayrollRunController.index().url}
                            className="flex-1"
                        >
                            <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-muted-foreground text-sm font-medium">
                                        Pending Payroll
                                    </CardTitle>
                                    <div className="bg-warning/10 text-warning flex size-8 items-center justify-center rounded-lg">
                                        <Wallet className="size-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">
                                        {kpis.pendingPayroll}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link
                            href={ExpenseController.index().url}
                            className="flex-1"
                        >
                            <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-muted-foreground text-sm font-medium">
                                        Pending Expenses
                                    </CardTitle>
                                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                                        <ClipboardList className="size-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">
                                        {kpis.pendingExpenses}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: index().url,
        },
    ],
};
