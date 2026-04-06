import { LucideIcon, LayoutDashboard, Landmark, User2 } from "lucide-react";
import { UserRole } from "../types/enums/user-role.enum";

export type IconType = LucideIcon;
export type SidebarItemsType = {
  title: string;
  url: string;
  icon?: LucideIcon;
  textColor?: String;
  roles: UserRole[];
  childMenu?: SidebarItemsType[];
};

export const sidebarItems: SidebarItemsType[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    roles: [UserRole.CLIENT, UserRole.LAWYER, UserRole.SUPER_ADMIN],
    icon: LayoutDashboard,
  },
  {
    title: "Case",
    url: "/case",
    roles: [UserRole.CLIENT, UserRole.LAWYER, UserRole.SUPER_ADMIN],
    icon: Landmark,
  },
  {
    title: "User",
    url: "/user",
    roles: [UserRole.SUPER_ADMIN],
    icon: User2
  }
];
