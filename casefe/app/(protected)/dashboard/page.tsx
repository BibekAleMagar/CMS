"use client";

import ClientDashboard from "@/src/components/pages/dashboard/client/ClientDashboard";
import LawyerDashboard from "@/src/components/pages/dashboard/lawyerDashboard";
import { SuperAdminDashboard } from "@/src/components/pages/dashboard/superAdmin";
import { useAuth } from "@/src/context/useAuth";
import { useUserById } from "@/src/hooks/query/user";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: userData } = useUserById(user?.sub ?? undefined);

  return (
    <>
      <div className="text-black">
        <h1>
          {user?.role === "CLIENT" ? (
            <ClientDashboard />
          ) : user?.role === "LAWYER" ? (
            <LawyerDashboard />
          ) : user?.role === "SUPER_ADMIN" ? (
            <SuperAdminDashboard />
          ) : null}
        </h1>
      </div>
    </>
  );
};
export default Dashboard;
