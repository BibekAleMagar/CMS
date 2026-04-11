import { CaseStatus } from "./enums/case-status.enum";
import { CaseSummaryByStatus } from "./lawyer-dashboard";

export interface AssignedLawyer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  specializations: string[];
  experience: number | null;
  successRate: number | null;
}

export interface UpcomingHearing {
  caseId: number;
  title: string;
  nextHearing: string;
  status: CaseStatus;
}

export interface RecentCase {
  caseId: number;
  title: string;
  caseType: string;
  status: CaseStatus;
  createdAt: string;
}

export interface ClientDashboardResponse {
  caseOverview: {
    totalCases: number;
    byStatus: CaseSummaryByStatus;
  };
  assignedLawyer: AssignedLawyer | null;
  upcomingHearings: UpcomingHearing[];
  recentCases: RecentCase[];
}