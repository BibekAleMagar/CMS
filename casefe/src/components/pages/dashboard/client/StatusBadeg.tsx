import { cn } from "@/src/lib/utils";
import { CaseStatus } from "@/src/types/enums/case-status.enum";

const STATUS_MAP: Record<CaseStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-50 text-amber-800" },
  IN_PROGRESS: { label: "In progress", className: "bg-blue-50 text-blue-800" },
  UNDER_REVIEW: {
    label: "Under review",
    className: "bg-purple-50 text-purple-800",
  },
  RESOLVED: { label: "Resolved", className: "bg-green-50 text-green-800" },
  CLOSED: { label: "Closed", className: "bg-gray-100 text-gray-600" },
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  const config = STATUS_MAP[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={cn(
        "text-xs font-medium px-2.5 py-1 rounded-full",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
