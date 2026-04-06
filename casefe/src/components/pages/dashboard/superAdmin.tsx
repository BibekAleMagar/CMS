import {
  useCaseChartStats,
  useCaseDashboardStats,
} from "@/src/hooks/query/case";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../../ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ChartStatsResponse } from "@/src/types/chart";
import { DashboardStats } from "@/src/types/dashboardstats";
import { Briefcase, Users, Scale, UserCheck } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "var(--chart-1)",
  ACTIVE: "var(--chart-2)",
  CLOSED: "var(--chart-3)",
  UNDER_REVIEW: "var(--chart-4)",
  REJECTED: "var(--chart-5)",
};

const TYPE_COLORS: Record<string, string> = {
  CIVIL: "var(--chart-1)",
  CRIMINAL: "var(--chart-2)",
  FAMILY: "var(--chart-3)",
  PROPERTY: "var(--chart-4)",
  CORPORATE: "var(--chart-5)",
  LABOUR: "var(--chart-1)",
};

const statusChartConfig: ChartConfig = {
  PENDING: { label: "Pending", color: "var(--chart-1)" },
  ACTIVE: { label: "Active", color: "var(--chart-2)" },
  CLOSED: { label: "Closed", color: "var(--chart-3)" },
  UNDER_REVIEW: { label: "Under Review", color: "var(--chart-4)" },
  REJECTED: { label: "Rejected", color: "var(--chart-5)" },
};

const typeChartConfig: ChartConfig = {
  count: { label: "Cases", color: "var(--chart-1)" },
};

const monthChartConfig: ChartConfig = {
  count: { label: "Cases", color: "var(--chart-2)" },
};

const statCards = (stats: DashboardStats) => [
  {
    label: "Total Cases",
    value: stats.totalCases,
    icon: Briefcase,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    label: "Total Clients",
    value: stats.totalClients,
    icon: Users,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    label: "Total Lawyers",
    value: stats.totalLawyers,
    icon: Scale,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    label: "Total Users",
    value: stats.totalUsers,
    icon: UserCheck,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
];

export const SuperAdminDashboard = () => {
  const { data: chartData } = useCaseChartStats();
  const { data: statsData } = useCaseDashboardStats();

  const stats = statsData as DashboardStats | undefined;

  const statusData =
    (chartData as ChartStatsResponse | undefined)?.byStatus.map((s) => ({
      ...s,
      fill: STATUS_COLORS[s.status] ?? "var(--chart-1)",
    })) ?? [];

  const typeData = (chartData as ChartStatsResponse | undefined)?.byType ?? [];
  const monthData =
    (chartData as ChartStatsResponse | undefined)?.byMonth ?? [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Super Admin Dashboard</h1>

      {/* Stat Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards(stats).map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={`${bg} ${color} p-3 rounded-xl`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-semibold">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 1. Donut — Cases by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Cases by Status</CardTitle>
            <CardDescription>Distribution of case statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={statusChartConfig}
              className="h-[250px] w-full"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="status" />}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 2. Bar — Cases by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Cases by Type</CardTitle>
            <CardDescription>Total cases per case type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={typeChartConfig}
              className="h-[250px] w-full"
            >
              <BarChart data={typeData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="caseType"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v) => v.charAt(0) + v.slice(1).toLowerCase()}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={4}>
                  {typeData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={TYPE_COLORS[entry.caseType] ?? "var(--chart-1)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 3. Area — Cases over Time */}
        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle>Cases over Time</CardTitle>
            <CardDescription>Monthly case creation trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={monthChartConfig}
              className="h-[250px] w-full"
            >
              <AreaChart data={monthData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v) => v.slice(5)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  fill="var(--chart-2)"
                  fillOpacity={0.2}
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
