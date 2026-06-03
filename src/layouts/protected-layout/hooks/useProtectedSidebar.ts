"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";
import favicon from "@/src/assets/images/favicon.png";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { hasProtectedSidebarAccess } from "@/src/lib/auth/sidebarAccess";
import { useTheme } from "@/src/providers/ThemeProvider";
import type { StaticImageData } from "next/image";

const COLLAPSED_STORAGE_KEY = "protected-sidebar-collapsed";

export function useProtectedSidebar() {
  const t = useTranslations("common");
  const { theme } = useTheme();
  const { user, isLoadingUser } = useAuthStore();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const isVisible = useMemo(
    () => hasProtectedSidebarAccess(user),
    [user],
  );

  const logoSrc: StaticImageData = useMemo(() => {
    if (isCollapsed) {
      return favicon;
    }
    return theme === "dark" ? mlsLogoDark : mlsLogoLight;
  }, [isCollapsed, theme]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLLAPSED_STORAGE_KEY);
      if (stored === "true") {
        setIsCollapsed(true);
      }
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      } catch {
        /* ignore storage errors */
      }
      return next;
    });
  }, []);

  const collapseLabel = t("sidebarCollapse");
  const expandLabel = t("sidebarExpand");

  return {
    isVisible,
    isLoadingUser,
    isCollapsed,
    toggleCollapsed,
    collapseLabel,
    expandLabel,
    navLabel: t("protectedSidebarNav"),
    logoAlt: t("brand"),
    logoSrc,
  };
}
