

import { CreateCaseDto } from "@/src/types/Case";
import usePost from "../react-query-helpers/usePost";


export const useCreateCase = () => {
    return usePost<CreateCaseDto, unknown>({
        queryKeyToInvalidate: ["case"]
    })
}