import { CreateCaseDto, UpdateCaseDto } from "@/src/types/Case";
import usePost from "../react-query-helpers/usePost";
import useUpdate from "../react-query-helpers/useUpdate";

export const useCreateCase = () => {
  return usePost<CreateCaseDto, unknown>({
    queryKeyToInvalidate: ["case"],
  });
};

export const useAssignLawyer = () => {
  return useUpdate<UpdateCaseDto, unknown>({
    queryKeyToInvalidate: ["case"],
  });
};

export const useUpdateCaseStatus = () => {
  return useUpdate<UpdateCaseDto, unknown>({
    queryKeyToInvalidate: ["case"],
  });
};
