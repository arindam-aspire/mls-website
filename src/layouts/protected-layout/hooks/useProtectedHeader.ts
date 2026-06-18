"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useHeaderNotificationUnreadCount } from "@/src/features/notifications/hooks/useHeaderNotificationUnreadCount";
import { hasProtectedSidebarAccess } from "@/src/lib/auth/sidebarAccess";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { buildHeaderLocaleOptions } from "@/src/layouts/shared/buildHeaderLocaleOptions";
import { useTheme } from "@/src/providers/ThemeProvider";
import type { StaticImageData } from "next/image";

export function useProtectedHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const { theme } = useTheme();

  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);

  const { hasUnread: hasUnreadNotifications, unreadCount: notificationUnreadCount } =
    useHeaderNotificationUnreadCount({
    enabled: Boolean(user),
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const headerLogoSrc: StaticImageData = useMemo(
    () => (theme === "dark" ? mlsLogoDark : mlsLogoLight),
    [theme],
  );

  const handleLocaleChange = useCallback(
    (nextLocale: AppLocale) => {
      router.replace(pathname, { locale: nextLocale });
    },
    [pathname, router],
  );

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const localeOptions = useMemo(() => buildHeaderLocaleOptions(t), [t]);

  const showHeaderLogo = useMemo(
    () => Boolean(user) && !hasProtectedSidebarAccess(user),
    [user],
  );

  return {
    t,
    locale,
    localeOptions,
    user,
    isLoadingUser,
    hasUnreadNotifications,
    notificationUnreadCount,
    showHeaderLogo,
    headerLogoSrc,
    handleLocaleChange,
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
  };
}
