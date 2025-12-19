import { getData } from "@/src/lib/apiHelpers";
import {
  useQuery,
  UseQueryResult,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";

/**
 * A custom hook that simplifies data fetching using React Query and Axios.
 *
 * @template T - The type of the data being fetched.
 *
 * @param {string} url - The URL endpoint to fetch data from.
 * @param {Omit<UseQueryOptions<ResponseModel<T>>, "queryKey" | "queryFn"> & { queryKey?: QueryKey; config?: AxiosRequestConfig; }} [options]
 *        - Optional configuration for the query and Axios request.
 *        - `queryKey`: A unique key for the query, used for caching and invalidation.
 *        - `config`: Axios request configuration options.
 *
 * @returns {UseQueryResult<ResponseModel<T>, unknown>} - The result of the query, including the data, status, and error information.
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useFetch<User>('/api/users/1', {
 *   queryKey: ['user', 1],w
 *   config: { headers: { Authorization: 'Bearer token' } },
 * });
 * ```
 */

const useFetch = <T>(
  url: string,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn"> & {
    queryKey?: QueryKey;
    config?: AxiosRequestConfig;
    // for api without app 
    appWithoutApi?: boolean;
  }
): UseQueryResult<T, Error> => {
  return useQuery<T, Error>({
    queryKey: ["fetch", url, options?.queryKey,options?.appWithoutApi],
    queryFn: async () => await getData<T>(url, options?.config, options?.appWithoutApi),
    ...options,
  });
};

export default useFetch;
