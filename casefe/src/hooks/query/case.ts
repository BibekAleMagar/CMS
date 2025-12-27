import { GetCaseDto } from "@/src/types/Case";
import useFetch from "../react-query-helpers/useFetch";


export const useCase = () => {
    return useFetch<GetCaseDto[]>("/case",{
        queryKey: ["case"]
    })
}


export const useCaseById = (id: number) => {
    return useFetch<GetCaseDto>(`/case/${id}`,{
        queryKey: ["caseById"]
    }
        
    )
}