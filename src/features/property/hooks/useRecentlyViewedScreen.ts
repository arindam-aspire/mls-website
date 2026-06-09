"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useGetRecentViewsList } from "../mutations/property.mutation";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export function useRecentlyViewedScreen() {
  // 2. UI utilities
  const t = useTranslations("propertyList");

  // 5. Data fetching / queries
  const { mutate: getRecentViewsList } = useGetRecentViewsList();

  const fetchRecentViews = useCallback(() => {
    getRecentViewsList({ page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE });
  }, [getRecentViewsList]);

  // 6. Derived / memoized values
  const pageTitle = useMemo(() => t("recentlyViewed.pageTitle"), [t]);
  const pageSubtitle = useMemo(() => t("recentlyViewed.pageSubtitle"), [t]);
  const comingSoonEyebrow = useMemo(
    () => t("recentlyViewed.comingSoonEyebrow"),
    [t],
  );
  const comingSoonDescription = useMemo(
    () => t("recentlyViewed.comingSoonDescription"),
    [t],
  );

  // 9. Effects
  useEffect(() => {
    fetchRecentViews();
  }, [fetchRecentViews]);

  // 10. Return values
  return {
    pageTitle,
    pageSubtitle,
    comingSoonEyebrow,
    comingSoonDescription,
  };
}
