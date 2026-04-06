import { GetCaseDto } from "@/src/types/Case";
import useFetch from "../react-query-helpers/useFetch";
import { AiRecommendation } from "@/src/types/AiRecommendation";
import { ChartStatsResponse } from "@/src/types/chart";
import { DashboardStats } from "@/src/types/dashboardstats";

export const useCase = () => {
  return useFetch<GetCaseDto[]>("/case", {
    queryKey: ["case"],
  });
};

export const useCaseById = (id: number) => {
  return useFetch<GetCaseDto>(`/case/${id}`, {
    queryKey: ["case", id],
  });
};

export const useAiRecommendation = (id: number, enabled: boolean) => {
  return useFetch<AiRecommendation>(`/case/${id}/recommended-lawyers`, {
    queryKey: ["case", id, "recommended-lawyers"],
    enabled: enabled && !!id,
  });
};

export const useCaseChartStats = () => {
  return useFetch<ChartStatsResponse>(`/case/chart-data`, {
    queryKey: ["case", "chart-data"],
  });
}

export const useCaseDashboardStats = () => {
  return useFetch<DashboardStats>(`/case/dashboard-stats`, {
    queryKey: ["case", "dashboard-stats"],
  });
}
