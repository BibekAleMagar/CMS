import React, {useState} from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { sidebarItems, SidebarItemsType } from "@/src/constants/sidebarItems";
import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";


type Pros= {
    item: SidebarItemsType;
    defaultOpen?: boolean;
    className?: string
}

export const SidebarDropdown = ({item, defaultOpen = false, className}: Pros) => {
    const [openMenu, setOpenMenu] = useState(defaultOpen || false);
    const pathname = usePathname();
    const activeClass = "bg-primary text-white flex hover:bg-primary/90";

    const isActive = (url: string) => {
        console.log(url);
        if(url === "/") {
            return pathname === "/";
        }
        if(url.startsWith(".")) {
            return pathname.includes(url.slice(1));
        }
        return pathname.includes(url)
    }
    return (
         <SidebarGroup className={cn("ml-2 p-0", className)}>
      <SidebarGroupContent>
        <SidebarMenu>
          <Collapsible
            open={openMenu}
            onOpenChange={setOpenMenu}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  {item.icon && <item.icon />}
                  <div className="flex-1 flex  justify-between">
                    {item.title}
                    {!openMenu ? <ChevronRight /> : <ChevronDown />}
                  </div>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {item.childMenu?.map((childMenu, index) => {
                  if (childMenu.childMenu)
                    return <SidebarDropdown item={childMenu} key={index} />;
                  return (
                    <SidebarMenuSub key={index} className="">
                      <SidebarMenuSubItem className="flex gap-1 items-center">
                        <SidebarMenuButton className="m-0 p-0">
                          <Link
                            href={childMenu.url}
                            className={cn(
                              "flex gap-1 items-center w-full p-2 rounded-md",
                              isActive(childMenu.url) && activeClass
                            )}
                          >
                            {childMenu.icon && <childMenu.icon size={16} />}
                            {childMenu.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  );
                })}
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
    )
}