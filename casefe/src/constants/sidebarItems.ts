import { LucideIcon, LayoutDashboard } from "lucide-react";
import { UserRole } from "../types/enums/user-role.enum";


export type IconType = LucideIcon;
export type SidebarItemsType = {
    title: string;
    url: string;
    icon?: LucideIcon;
    textColor?: String;
    roles: UserRole[];
    childMenu?: SidebarItemsType[];
}

export const sidebarItems: SidebarItemsType[] = [
    {
        title: "Dashboard",
        url: "dashboard",
        roles: [UserRole.CLIENT, UserRole.LAWYER, UserRole.SUPER_ADMIN],
        icon: LayoutDashboard
    }
]