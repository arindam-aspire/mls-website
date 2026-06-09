"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { PageMetadataKey } from "@/src/lib/metadata/buildPageMetadata";

export function usePageTitle(pageKey: PageMetadataKey) {
  const t = useTranslations("metadata");

  useEffect(() => {
    document.title = `${t(pageKey)} - ${t("titleSuffix")}`;
  }, [pageKey, t]);
}
