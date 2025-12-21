"use client";

import { useAuth } from "@/src/context/useAuth";
import { useUserById } from "@/src/hooks/query/user";


 const Dashboard = () => {
    const {user} = useAuth()
    const {data: userData} = useUserById(user?.sub ?? undefined);

    return (
        <>
        <div className="">
            <h1>{
            user?.role === "CLIENT" ? "Hello I am Client" : 
            user?.role === "LAWYER" ? " Hello I am Lawyer" : 
            user?. role === "SUPER_ADMIN" ? "Hello I am SuperAdmin" : 
            null
            }</h1>
        </div>
        </>
    )
}
export default Dashboard;