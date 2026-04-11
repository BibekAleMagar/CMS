import { ClientDashboardResponse } from "@/src/types/clientDashboard";

type Props = Pick<ClientDashboardResponse, "assignedLawyer">;

export function AssignedLawyerCard({ assignedLawyer }: Props) {
  if (!assignedLawyer) {
    return (
      <div className="bg-white border rounded-xl p-4 flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">No lawyer assigned yet.</p>
      </div>
    );
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    experience,
    successRate,
    specializations,
  } = assignedLawyer;
  const initials = `${firstName[0]}${lastName[0]}`;

  return (
    <div className="bg-white border rounded-xl p-4 h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-medium text-sm shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-medium text-sm">
            {firstName} {lastName}
          </p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      </div>

      <hr className="my-3" />

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Phone</span>
          <span className="font-medium">{phone ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Experience</span>
          <span className="font-medium">
            {experience != null ? `${experience} yrs` : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Success rate</span>
          <span className="font-medium">
            {successRate != null ? `${successRate}%` : "—"}
          </span>
        </div>
      </div>

      <hr className="my-3" />

      <div className="flex flex-wrap gap-1">
        {specializations.map((s) => (
          <span
            key={s}
            className="text-xs bg-purple-50 text-purple-800 px-2.5 py-1 rounded-full"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
