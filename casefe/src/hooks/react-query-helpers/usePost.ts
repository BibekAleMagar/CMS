import { postData } from "@/src/lib/apiHelpers";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
export type MutationVariables<T> = {
  payload: T;
  url: string;
  successMessage?: string;
  errorMessage?: string;
};

const usePost = <T, R>(
  options?: Omit<
    UseMutationOptions<R, unknown, MutationVariables<T>>,
    "mutationFn"
  > & {
    queryKeyToInvalidate?: QueryKey;
    config?: AxiosRequestConfig;
  }
) => {
  const queryClient = useQueryClient(); // Access the React Query client

  return useMutation({
    mutationFn: async (data: MutationVariables<T>) => {
      return await postData<T, R>(data.url, data.payload, options?.config);
    },
    onSettled: () => {
      // Invalidate the query after the mutation is successful
      if (options?.queryKeyToInvalidate) {
        queryClient.invalidateQueries([
          ...options.queryKeyToInvalidate,
        ] as InvalidateQueryFilters<readonly unknown[]>);
      }
    },
  });
};

export default usePost;
