import { deleteData } from "@/src/lib/apiHelpers";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import { MutationVariables } from "./usePost";

// Generic mutation hook for DELETE
export const useDelete = <T = unknown>(
  config?: AxiosRequestConfig & {
    queryKeyToInvalidate?: QueryKey;
    successMessage?: string;
    errorMessage?: string;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Pick<
        MutationVariables<T>,
        "url" | "successMessage" | "errorMessage"
      >
    ) => deleteData<T>(data.url, config),
    onSettled: () => {
      if (config?.queryKeyToInvalidate) {
        queryClient.invalidateQueries({
          queryKey: config.queryKeyToInvalidate,
        });
      }
    },
  });
};
