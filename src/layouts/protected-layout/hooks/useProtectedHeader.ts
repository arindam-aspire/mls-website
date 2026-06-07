"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { hasProtectedSidebarAccess } from "@/src/lib/auth/sidebarAccess";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { useTheme } from "@/src/providers/ThemeProvider";
import type { StaticImageData } from "next/image";

const LOCALE_VALUES: AppLocale[] = ["en", "ar", "es", "fr"];

export function useProtectedHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const { theme } = useTheme();

  const { user, isLoadingUser } = useAuthStore();

  const [upcomingFeatureModal, setUpcomingFeatureModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const headerLogoSrc: StaticImageData = useMemo(
    () => (theme === "dark" ? mlsLogoDark : mlsLogoLight),
    [theme],
  );

  const handleLocaleChange = useCallback(
    (nextLocale: string) => {
      router.replace(pathname, { locale: nextLocale as AppLocale });
    },
    [pathname, router],
  );

  const openNotifications = useCallback(() => {
    setUpcomingFeatureModal(true);
  }, []);

  const closeUpcomingFeatureModal = useCallback(() => {
    setUpcomingFeatureModal(false);
  }, []);

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const localeOptions = useMemo(
    () =>
      LOCALE_VALUES.map((value) => ({
        value,
        label: t(`localeNames.${value}`),
      })),
    [t],
  );

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
    showHeaderLogo,
    headerLogoSrc,
    handleLocaleChange,
    upcomingFeatureModal,
    openNotifications,
    closeUpcomingFeatureModal,
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
  };
}
