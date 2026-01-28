"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/src/components/ui/sidebar";
import { sidebarItems } from "@/src/constants/sidebarItems";
import Image from "next/image";
import SidebarItem from "./SidebarItem";
import { useAuth } from "@/src/context/useAuth";
import { UserRole } from "@/src/types/enums/user-role.enum";
import { SidebarDropdown } from "./SidebarDropdown";
import { useUserById } from "@/src/hooks/query/user";

export function CustomSidebar() {
  const { user } = useAuth();
  console.table(user);
  const { data: userData } = useUserById(user?.sub ?? undefined);
  const activeClass = "bg-primary text-white !hover:bg-primary/90";

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="py-4 justify-center flex items-center">
          {userData?.avatar ? (
            <Image
              src={userData.avatar}
              alt="logo"
              height={80}
              width={80}
              className="h-20 w-20 object-cover"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gray-200" />
          )}
        </div>
        <hr />
      </SidebarHeader>
      <SidebarContent>
        {sidebarItems?.map((sidebarItem, index) => {
          if (
            user?.role &&
            sidebarItem.roles?.includes(user?.role as UserRole)
          ) {
            if (sidebarItem.childMenu)
              return (
                <SidebarDropdown
                  item={sidebarItem}
                  key={index}
                  className="p-0 m-0"
                />
              );
            return (
              <SidebarItem
                key={index}
                item={sidebarItem}
                activeClass={activeClass}
              />
            );
          }
        })}
      </SidebarContent>
    </Sidebar>
  );
}
