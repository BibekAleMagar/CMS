export interface CaseByStatus {
  status: string;
  count: number;
}

export interface CaseByType {
  caseType: string;
  count: number;
}

export interface CaseByMonth {
  month: string;
  count: number;
}

export interface ChartStatsResponse {
  byStatus: CaseByStatus[];
  byType: CaseByType[];
  byMonth: CaseByMonth[];
}