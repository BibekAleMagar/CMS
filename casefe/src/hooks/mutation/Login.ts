import { LoginType } from "@/src/types/Login"
import usePost from "../react-query-helpers/usePost"
import { LoginResponse } from "@/src/types/auth"


export const useLogin = () => {
    return usePost<LoginType, LoginResponse>({
        queryKeyToInvalidate: ["auth", "login"],
    })
}