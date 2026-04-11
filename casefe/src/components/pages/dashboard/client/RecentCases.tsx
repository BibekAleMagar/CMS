import { ClientDashboardResponse } from "@/src/types/clientDashboard";
import { StatusBadge } from "./status-badge";

type Props = Pick<ClientDashboardResponse, "recentCases">;

export function RecentCases({ recentCases }: Props) {
  if (!recentCases.length) {
    return (
      <div className="bg-white border rounded-xl p-4 text-center text-sm text-muted-foreground py-8">
        No cases found.
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left text-xs text-muted-foreground font-medium pb-2">
              Title
            </th>
            <th className="text-left text-xs text-muted-foreground font-medium pb-2">
              Type
            </th>
            <th className="text-left text-xs text-muted-foreground font-medium pb-2">
              Status
            </th>
            <th className="text-left text-xs text-muted-foreground font-medium pb-2">
              Filed
            </th>
          </tr>
        </thead>
        <tbody>
          {recentCases.map((c) => (
            <tr key={c.caseId} className="border-b last:border-0">
              <td className="py-2.5 font-medium">
                {c.title}
                <span className="text-xs text-muted-foreground ml-1">
                  #{c.caseId}
                </span>
              </td>
              <td className="py-2.5 text-muted-foreground">{c.caseType}</td>
              <td className="py-2.5">
                <StatusBadge status={c.status} />
              </td>
              <td className="py-2.5 text-muted-foreground">
                {new Date(c.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
