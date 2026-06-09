import {
  Heart,
  LayoutDashboard,
  List,
  Search,
  type LucideIcon,
} from "lucide-react";
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
          labelKey: "manageListings",
          href: "/manage-listings",
          icon: List,
          permission: "MANAGE_LISTINGS",
        },
        {
          labelKey: "myFavourites",
          href: "/favourites",
          icon: Heart,
          permission: "PROFILE",
        },
        {
          labelKey: "mySavedSearches",
          href: "/saved-searches",
          icon: Search,
          permission: "PROFILE",
        },
      ],
    },
  ];
