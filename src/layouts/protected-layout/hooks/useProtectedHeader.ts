"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
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

  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] =
    useState(false);
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
    setIsUpcomingFeatureModalOpen(true);
  }, []);

  const closeUpcomingFeatureModal = useCallback(() => {
    setIsUpcomingFeatureModalOpen(false);
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

  return {
    t,
    locale,
    localeOptions,
    user,
    isLoadingUser,
    headerLogoSrc,
    handleLocaleChange,
    isUpcomingFeatureModalOpen,
    openNotifications,
    closeUpcomingFeatureModal,
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
  };
}
