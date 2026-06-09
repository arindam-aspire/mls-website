"use client";

import { useTranslations } from "next-intl";

export function useSavedSearchesScreen() {
  const t = useTranslations("propertyList");

  return {
    pageTitle: t("savedSearches.pageTitle"),
    pageSubtitle: t("savedSearches.pageSubtitle"),
    comingSoonEyebrow: t("savedSearches.comingSoonEyebrow"),
    comingSoonDescription: t("savedSearches.comingSoonDescription"),
  };
}
