import {
  FilePenLine,
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
          labelKey: "draftListings",
          href: "/draft-listings",
          icon: FilePenLine,
          permission: "DRAFT_LISTINGS_SIDEBAR",
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
