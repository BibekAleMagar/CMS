import { formDataConfig } from "@/src/lib/api";
import usePost from "../react-query-helpers/usePost";
import { LoginResponse } from "@/src/types/auth";
import { RegisterType } from "@/src/types/register";



export const useRegister = () => {
    return usePost<RegisterType, LoginResponse>({
        queryKeyToInvalidate: ["auth"],
        config: formDataConfig,
            
        
    })
}