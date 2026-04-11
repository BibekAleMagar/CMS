

import { User } from "@/src/types/User";
import useFetch from "../react-query-helpers/useFetch";
import { LawyerDashboardResponse } from "@/src/types/lawyer-dashboard";
import { ClientDashboardResponse } from "@/src/types/clientDashboard";


export const useUserById = (id?:string) => {
    return useFetch<User>(`/user/${id}`,{
        queryKey: ["user",id],
        enabled: !!id
    }
        
    )
}

export const useUsers = () => {
    return useFetch<User[]>("/user", {
        queryKey: ["user"],
    })
}

export const useLawyerDashboard = () => {
    return useFetch<LawyerDashboardResponse>("/user/dashboard/lawyer", {
        queryKey: ["lawyerdashboard"]
    })
}


export const useClientDashboard = () => {
    return useFetch<ClientDashboardResponse>("/user/dashboard/client", {
        queryKey: ["clientdashboard"]
    })
}