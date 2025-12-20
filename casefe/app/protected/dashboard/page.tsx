"use client";

import { useAuth } from "@/src/context/useAuth";


 const Dashboard = () => {
    const {user} = useAuth()

    return (
        <>
        <h1>{
            user?.role === "CLIENT" ? "Hello I am Client" : 
            user?.role === "LAWYER" ? " Hello I am Lawyer" : 
            user?. role === "SUPER_ADMIN" ? "Hello I am SuperAdmin" : 
            null
            }</h1>
        </>
    )
}
export default Dashboard;