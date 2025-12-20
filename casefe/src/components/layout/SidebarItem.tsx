"use client";
import { usePathname } from "next/navigation";
import React from "react";

import Link from "next/link";
import { SidebarItemsType } from "@/src/constants/sidebarItems";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuButton,
} from "../ui/sidebar";
import { cn } from "@/src/lib/utils";

const CustomSidebarItem = ({
  item,
  activeClass = "bg-red-500 hover:bg-red-500 text-white",
  className = "",
}: // ...props
{
  item: SidebarItemsType;
  className?: string;
  activeClass?: string;
}) => {
  const pathname = usePathname();
  const isActive = (url: string) => {
    console.log(url);
    if (url === "/") {
      return pathname === "/";
    }
    if (url.startsWith(".")) {
      return pathname.includes(url.slice(1));
    }
    return pathname.includes(url);
  };

  return (
    <SidebarGroup className="p-0 m-0">
      <SidebarGroupContent>
        <SidebarMenuButton
          asChild
          className={
            isActive(item.url) ? "hover:bg-primary/90 hover:text-white" : ""
          }
        >
          <Link
            href={item.url}
            className={cn(isActive(item.url) ? activeClass : "", className)}
          >
            {item.icon && <item.icon size={16} />}
            {item.title}
          </Link>
        </SidebarMenuButton>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default CustomSidebarItem;
