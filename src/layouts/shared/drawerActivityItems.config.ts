import { Heart, History, List, Search, type LucideIcon } from "lucide-react";

export type DrawerActivityItemConfig = {
  labelKey: string;
  path: string;
  icon: LucideIcon;
};

/** Shared My Activity rows for public, landing, and protected mobile drawers. */
export const DRAWER_ACTIVITY_ITEMS: readonly DrawerActivityItemConfig[] = [
  { labelKey: "myListings", path: "/my-listings", icon: List },
  { labelKey: "manageListings", path: "/manage-listings", icon: List },
  { labelKey: "myFavourites", path: "/favourites", icon: Heart },
  { labelKey: "mySavedSearches", path: "/saved-searches", icon: Search },
  { labelKey: "myRecentlyViewed", path: "/recently-viewed", icon: History },
] as const;
