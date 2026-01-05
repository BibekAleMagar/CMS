import { CustomSidebar } from "@/src/components/layout/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { AuthProvider } from "@/src/context/useAuth";
import React from "react";
export const dynamic = "force-dynamic"; // This is to ensure that the layout is not cachedimport { cookies } from "next/headers" // remove
import { cookies } from "next/headers"; // remove
import Navbar from "@/src/components/layout/Navbar";
type Props = { children: React.ReactNode };

const Layout = async ({ children }: Props) => {
  const cookieStore = cookies();
  const isSidebarOpen =
    (await cookieStore).get("sidebar_state")?.value !== "false"; // defaults to true

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <AuthProvider>
          <CustomSidebar />
          <div className="relative basis-full bg-white">
            <SidebarTrigger className="absolute top-2" size="lg" />
            <div className="flex flex-col ">
              <Navbar />
              <main className="p-3 pt-1 lg:p-6 lg:pt-1">{children}</main>
            </div>
          </div>
      </AuthProvider>
    </SidebarProvider>
  );
};

export default Layout;
