import { ClientDashboardResponse } from "@/src/types/clientDashboard";
import { StatusBadge } from "./StatusBadeg";

type Props = Pick<ClientDashboardResponse, "upcomingHearings">;

export function UpcomingHearings({ upcomingHearings }: Props) {
  if (!upcomingHearings.length) {
    return (
      <div className="bg-white border rounded-xl p-4 text-center text-sm text-muted-foreground py-8">
        No upcoming hearings.
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left text-xs text-muted-foreground font-medium pb-2">
              Case
            </th>
            <th className="text-left text-xs text-muted-foreground font-medium pb-2">
              Next hearing
            </th>
            <th className="text-left text-xs text-muted-foreground font-medium pb-2">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {upcomingHearings.map((h) => (
            <tr key={h.caseId} className="border-b last:border-0">
              <td className="py-2.5 font-medium">
                {h.title}
                <span className="text-xs text-muted-foreground ml-1">
                  #{h.caseId}
                </span>
              </td>
              <td className="py-2.5 text-muted-foreground">
                {new Date(h.nextHearing).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="py-2.5">
                <StatusBadge status={h.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
