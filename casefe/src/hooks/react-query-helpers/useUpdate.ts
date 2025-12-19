import { updateData } from "@/src/lib/apiHelpers";
import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { type AxiosRequestConfig } from "axios";
import { MutationVariables } from "./usePost";

/**
 * A custom hook for sending a PATCH   request with React Query and Axios,
 * and invalidating queries after a successful POST.
 *
 * @template T - The type of the data being sent (request body).
 * @template R - The type of the response data.
 *
 * @param {string} url - The URL endpoint to send the POST request to.
 * @param {Omit<UseMutationOptions<ResponseModel<R>, unknown, T>, "mutationFn"> & { queryKeyToInvalidate?: string; config?: AxiosRequestConfig; }} [options]
 *        - Optional configuration for the mutation and Axios request.
 *        - `queryKeyToInvalidate`: The query key that needs to be invalidated after mutation.
 *        - `config`: Axios request configuration options.
 *
 * @returns {UseMutationResult<ResponseModel<R>, unknown, T>} - The result of the mutation, including the data, status, and error information.
 *
 * @example
 * ```typescript
 * const { mutate, isLoading, error } = usePost<User, ApiResponse>('/api/users', {
 *   queryKeyToInvalidate: 'usersList',
 *   config: { headers: { Authorization: 'Bearer token' } },
 * });
 * ```
 */
const useUpdate = <T, R>(
  options?: Omit<
    UseMutationOptions<R, unknown, MutationVariables<T>>,
    "mutationFn"
  > & {
    queryKeyToInvalidate?: QueryKey;
    config?: AxiosRequestConfig;
    successMessage?: string;
    errorMessage?: string;
  }
) => {
  const queryClient = useQueryClient(); // Access the React Query client

  return useMutation({
    mutationFn: async (data: MutationVariables<T>) => {
      return await updateData<T, R>(data.url, data.payload, options?.config);
    },
    onSettled: () => {
      // Invalidate the query after the mutation is successful
      if (options?.queryKeyToInvalidate) {
        queryClient.invalidateQueries({
          queryKey: options.queryKeyToInvalidate,
        });
      }
    },
  });
};

export default useUpdate;
