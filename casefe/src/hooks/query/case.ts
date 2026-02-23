import { GetCaseDto } from "@/src/types/Case";
import useFetch from "../react-query-helpers/useFetch";
import { AiRecommendation } from "@/src/types/AiRecommendation";

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
    queryKey: ["case", id],
    enabled: enabled && !!id,
  });
};
