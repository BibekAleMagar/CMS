import { Lawyer } from "@/src/types/Lawyer";
import useFetch from "../react-query-helpers/useFetch";

export const useLawyer = (enabled: boolean) => {
  return useFetch<Lawyer[]>("/user/lawyers", {
    queryKey: ["lawyers"],
    enabled,
  });
};
