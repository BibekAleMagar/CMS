import { ClientDashboardResponse } from "@/src/types/clientDashboard";

type Props = Pick<ClientDashboardResponse, "caseOverview">;

export function MetricCards({ caseOverview }: Props) {
  const { totalCases, byStatus } = caseOverview;

  const metrics = [
    { label: "Total cases", value: totalCases, sub: "all time" },
    { label: "In progress", value: byStatus.inProgress, sub: "active" },
    { label: "Pending", value: byStatus.pending, sub: "awaiting action" },
    { label: "Resolved", value: byStatus.resolved, sub: "completed" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="bg-muted rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
          <p className="text-2xl font-medium">{m.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
        </div>
      ))}
    </div>
  );
}
