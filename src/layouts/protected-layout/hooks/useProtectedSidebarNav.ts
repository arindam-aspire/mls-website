"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { hasPermission } from "@/src/lib/auth/hasPermission";
import { usePathname } from "@/src/i18n/navigation";
import { PROTECTED_SIDEBAR_NAV_SECTIONS } from "@/src/layouts/protected-layout/protectedSidebarNav.config";
import type { ProtectedSidebarNavItemConfig } from "@/src/layouts/protected-layout/protectedSidebarNav.config";

export type ProtectedSidebarNavItem = ProtectedSidebarNavItemConfig & {
  label: string;
  isActive: boolean;
};

export type ProtectedSidebarNavSection = {
  titleKey: string;
  title: string;
  items: ProtectedSidebarNavItem[];
};

export function useProtectedSidebarNav() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const sections = useMemo((): ProtectedSidebarNavSection[] => {
    return PROTECTED_SIDEBAR_NAV_SECTIONS.map((section) => ({
      titleKey: section.titleKey,
      title: t(section.titleKey),
      items: section.items
        .filter((item) => hasPermission(user, item.permission))
        .map((item) => ({
          ...item,
          label: t(item.labelKey),
          isActive:
            pathname === item.href || pathname.startsWith(`${item.href}/`),
        })),
    })).filter((section) => section.items.length > 0);
  }, [pathname, t, user]);

  return { sections };
}
