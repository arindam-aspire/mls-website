"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import {
  resolveListingsMenuPath,
  shouldShowManageListingsMenuItem,
} from "@/src/features/auth/utils/shouldShowRecentlyViewedMenu";
import { hasPermission } from "@/src/lib/auth/hasPermission";
import { usePathname } from "@/src/i18n/navigation";
import {
  PROTECTED_BOTTOM_TAB_ITEMS,
  type ProtectedBottomTabItemConfig,
} from "@/src/layouts/protected-layout/protectedBottomTab.config";

export type ProtectedBottomTabItem = ProtectedBottomTabItemConfig & {
  label: string;
  isActive: boolean;
};

function isTabActive(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function useProtectedBottomTabBar() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const tabs = useMemo((): ProtectedBottomTabItem[] => {
    if (!user) {
      return [];
    }

    return PROTECTED_BOTTOM_TAB_ITEMS.flatMap((item) => {
      if (item.labelKey === "protectedTabListings") {
        const listingsPath = resolveListingsMenuPath(user);

        if (!listingsPath) {
          return [];
        }

        const path = listingsPath;
        const label = shouldShowManageListingsMenuItem(user)
          ? t("manageListings")
          : t(item.labelKey);

        return [
          {
            ...item,
            path,
            label,
            isActive: isTabActive(pathname, path),
          },
        ];
      }

      const path =
        item.labelKey === "protectedTabHome" &&
        !hasPermission(user, "DASHBOARD")
          ? "/my-profile"
          : item.path;

      return [
        {
          ...item,
          path,
          label: t(item.labelKey),
          isActive: isTabActive(pathname, path),
        },
      ];
    });
  }, [pathname, t, user]);

  return {
    t,
    tabs,
  };
}
