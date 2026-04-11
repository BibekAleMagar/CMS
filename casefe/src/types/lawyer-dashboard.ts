import { CaseStatus } from "./enums/case-status.enum";

export interface UpcomingDeadline {
  caseId: number;
  nextHearing: string;
  status: CaseStatus;
}

export interface ClientOverview {
  totalClients: number;
  newClientsThisMonth: number;
  activeClients: number;
  inactiveClients: number;
}

export interface CaseSummaryByStatus {
  pending: number;
  inProgress: number;
  underReview: number;
  resolved: number;
  closed: number;
}

export interface CaseSummary {
  totalCases: number;
  byStatus: CaseSummaryByStatus;
  upcomingDeadlines: UpcomingDeadline[];
}

export interface LawyerDashboardResponse {
  clientOverview: ClientOverview;
  caseSummary: CaseSummary;
}