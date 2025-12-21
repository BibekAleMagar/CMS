

import { User } from "@/src/types/User";
import useFetch from "../react-query-helpers/useFetch";


export const useUserById = (id?:string) => {
    return useFetch<User>(`/user/${id}`,{
        queryKey: ["user",id],
        enabled: !!id
    }
        
    )
}