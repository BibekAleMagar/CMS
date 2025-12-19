"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { sweetAlert } from "../lib/helper";
import { MutationVariables } from "../hooks/react-query-helpers/usePost";
import { handleCatchError } from "../helper/handleCatchError";

export function CustomQueryClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30000,
            retry: false,
            refetchOnWindowFocus: false,

            throwOnError(error) {
              const err = error as Error;
              console.log(err.message);
              handleCatchError(err, "", "Query");
              return false;
            },
          },
          mutations: {
            onError(error) {
              const err = error as Error;
              return handleCatchError(err, "", "Mutation");
            },
            onSuccess: (_, variables: unknown) => {
              const typedVariables = variables as MutationVariables<unknown>;
              sweetAlert.success(
                typedVariables?.successMessage || "Data saved successfully."
              );
            },
          },
        },
      })
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
