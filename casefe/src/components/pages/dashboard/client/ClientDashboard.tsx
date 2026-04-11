"use client";

import { useClientDashboard } from "@/src/hooks/query/user";
import { DashboardSkeleton } from "./skeleton";
import { DashboardError } from "./error";
import { MetricCards } from "./MetricCard";
import { CaseStatusChart } from "./case-status-chart";
import { AssignedLawyerCard } from "./assignedLawyercard";
import { UpcomingHearings } from "./Upcomingheraing";
import { RecentCases } from "./RecentCases";

export default function ClientDashboardPage() {
  const { data, isLoading, error } = useClientDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <DashboardError message={error.message} />;
  if (!data) return null;

  return (
    <div className="p-6 space-y-6">
      <section>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Case overview
        </h2>
        <MetricCards caseOverview={data.caseOverview} />
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <section>
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Cases by status
          </h2>
          <div className="bg-white border rounded-xl p-4">
            <CaseStatusChart caseOverview={data.caseOverview} />
          </div>
        </section>
        <section>
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Assigned lawyer
          </h2>
          <AssignedLawyerCard assignedLawyer={data.assignedLawyer} />
        </section>
      </div>

      <section>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Upcoming hearings
        </h2>
        <UpcomingHearings upcomingHearings={data.upcomingHearings} />
      </section>

      <section>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Recent cases
        </h2>
        <RecentCases recentCases={data.recentCases} />
      </section>
    </div>
  );
}
