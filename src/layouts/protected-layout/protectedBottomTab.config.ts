import {
  ClipboardList,
  Heart,
  Home,
  MessageCircle,
  Search,
  type LucideIcon,
} from "lucide-react";

export type ProtectedBottomTabLabelKey =
  | "protectedTabHome"
  | "protectedTabListings"
  | "protectedTabSearch"
  | "protectedTabFavourites"
  | "protectedTabEnquiry";

export type ProtectedBottomTabItemConfig = {
  path: string;
  labelKey: ProtectedBottomTabLabelKey;
  icon: LucideIcon;
};

/** Fixed order: Home, Listings, Search (center), Favourites, Enquiry — always five tabs. */
export const PROTECTED_BOTTOM_TAB_ITEMS: ProtectedBottomTabItemConfig[] = [
  {
    path: "/dashboard",
    labelKey: "protectedTabHome",
    icon: Home,
  },
  {
    path: "/listing",
    labelKey: "protectedTabListings",
    icon: ClipboardList,
  },
  {
    path: "/property-list",
    labelKey: "protectedTabSearch",
    icon: Search,
  },
  {
    path: "/favourites",
    labelKey: "protectedTabFavourites",
    icon: Heart,
  },
  {
    path: "/inquiries",
    labelKey: "protectedTabEnquiry",
    icon: MessageCircle,
  },
];
