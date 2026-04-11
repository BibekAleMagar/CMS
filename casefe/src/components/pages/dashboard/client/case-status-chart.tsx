"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/components/ui/chart";
import { ClientDashboardResponse } from "@/src/types/clientDashboard";
import { PieChart, Pie, Cell } from "recharts";

type Props = Pick<ClientDashboardResponse, "caseOverview">;

const STATUS_COLORS = {
  pending: "#EF9F27",
  inProgress: "#378ADD",
  underReview: "#7F77DD",
  resolved: "#639922",
  closed: "#888780",
};

const STATUS_LABELS = {
  pending: "Pending",
  inProgress: "In Progress",
  underReview: "Under Review",
  resolved: "Resolved",
  closed: "Closed",
};

export function CaseStatusChart({ caseOverview }: Props) {
  const { byStatus } = caseOverview;

  const keys = Object.keys(STATUS_COLORS) as (keyof typeof STATUS_COLORS)[];

  const chartData = keys.map((k) => ({
    name: STATUS_LABELS[k],
    value: byStatus[k] ?? 0,
    fill: STATUS_COLORS[k],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Distribution</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        <ChartContainer
          config={{
            value: { label: "Cases" },
          }}
          className="h-[250px] w-full"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60} // 🔥 like doughnut
              outerRadius={90}
              paddingAngle={3}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* 🔹 Custom Legend */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {chartData.map(
            (item, i) =>
              item.value > 0 && (
                <span
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ background: item.fill }}
                  />
                  {item.name} {item.value}
                </span>
              ),
          )}
        </div>
      </CardContent>
    </Card>
  );
}
