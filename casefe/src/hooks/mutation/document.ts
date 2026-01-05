import usePost from "../react-query-helpers/usePost";
import { formDataConfig } from "@/src/lib/api";
import { CreateDocumentDto } from "@/src/types/document";


export const useAddDocument = () => {
    return usePost<CreateDocumentDto, unknown>({
        queryKeyToInvalidate: ["documents"],
        config: formDataConfig
    })
}