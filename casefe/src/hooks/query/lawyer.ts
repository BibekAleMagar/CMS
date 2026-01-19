import { Lawyer } from "@/src/types/Lawyer";
import useFetch from "../react-query-helpers/useFetch";

export const useLawyer = () => {
  return useFetch<Lawyer[]>("/user/lawyers", {
    queryKey: ["lawyers"],
  });
};
