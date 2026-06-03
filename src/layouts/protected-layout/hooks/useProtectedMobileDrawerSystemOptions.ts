"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { useTheme, type ThemeMode } from "@/src/providers/ThemeProvider";

export const PROTECTED_DRAWER_LOCALE_OPTIONS: {
  value: AppLocale;
  label: string;
}[] = [
  { value: "en", label: "En" },
  { value: "ar", label: "Ar" },
  { value: "es", label: "Sp" },
  { value: "fr", label: "Fr" },
];

export function useProtectedMobileDrawerSystemOptions() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as AppLocale;
  const { theme, setTheme } = useTheme();

  const handleLocaleChange = useCallback(
    (nextLocale: AppLocale) => {
      router.replace(pathname, { locale: nextLocale });
    },
    [pathname, router],
  );

  const handleThemeChange = useCallback(
    (mode: ThemeMode) => {
      setTheme(mode);
    },
    [setTheme],
  );

  return {
    locale,
    theme,
    localeOptions: PROTECTED_DRAWER_LOCALE_OPTIONS,
    handleLocaleChange,
    handleThemeChange,
  };
}
