import { Heart, Home, LayoutDashboard, type LucideIcon } from "lucide-react";
import type { PermissionKey } from "@/src/lib/auth/permissions";

export type ProtectedSidebarNavItemConfig = {
  labelKey: string;
  href: string;
  icon: LucideIcon;
  permission: PermissionKey;
};

export type ProtectedSidebarNavSectionConfig = {
  titleKey: string;
  items: ProtectedSidebarNavItemConfig[];
};

export const PROTECTED_SIDEBAR_NAV_SECTIONS: ProtectedSidebarNavSectionConfig[] =
  [
    {
      titleKey: "sidebarSectionMain",
      items: [
        {
          labelKey: "sidebarDashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          permission: "DASHBOARD",
        },
      ],
    },
    {
      titleKey: "sidebarSectionProperty",
      items: [
        {
          labelKey: "myListings",
          href: "/listing",
          icon: Home,
          permission: "PROFILE",
        },
        {
          labelKey: "myFavourites",
          href: "/favourites",
          icon: Heart,
          permission: "PROFILE",
        },
      ],
    },
  ];
