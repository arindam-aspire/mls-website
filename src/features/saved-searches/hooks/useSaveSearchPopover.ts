"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { SAVED_SEARCH_POPOVER_PAGE_SIZE } from "../constants/savedSearch.constants";
import {
  savedSearchPopoverListParams,
  useGetSavedSearches,
} from "../mutations/saved-search.mutation";
import type { SavedSearchRecord } from "../types/savedSearch.types";
import { buildSavedSearchPropertyListHref } from "../utils/buildSavedSearchPropertyListHref";

const SAVED_SEARCHES_PATH = "/saved-searches";

type UseSaveSearchPopoverParams = {
  /** When false, the popover is hidden/disabled for guests. */
  enabled?: boolean;
};

export function useSaveSearchPopover({
  enabled = true,
}: UseSaveSearchPopoverParams = {}) {
  const t = useTranslations("savedSearches");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const [hasOpened, setHasOpened] = useState(false);

  const { data, isPending, isFetching, isError, refetch } = useGetSavedSearches(
    savedSearchPopoverListParams,
    { enabled: enabled && hasOpened },
  );

  const items = useMemo(
    () => (data?.data?.items ?? []).slice(0, SAVED_SEARCH_POPOVER_PAGE_SIZE),
    [data?.data?.items],
  );

  const isLoading = hasOpened && (isPending || isFetching);

  const onOpen = useCallback(() => {
    if (!hasOpened) {
      setHasOpened(true);
      return;
    }

    void refetch();
  }, [hasOpened, refetch]);

  const onSelectSavedSearch = useCallback(
    (record: SavedSearchRecord) => {
      const href = buildSavedSearchPropertyListHref(record);
      const url = getPathname({ locale, href });

      window.open(url, "_blank", "noopener,noreferrer");
    },
    [locale],
  );

  const onAddSearchCriteria = useCallback(() => {
    router.push(SAVED_SEARCHES_PATH);
  }, [router]);

  return {
    searchAriaLabel: tCommon("searchLabel"),
    listAriaLabel: t("popoverTitle"),
    emptyTitle: t("popoverEmptyTitle"),
    emptyDescription: t("popoverEmptyDescription"),
    addSearchCriteriaLabel: t("popoverAddSearchCriteria"),
    seeAllSavedSearchesLabel: t("popoverSeeAllSavedSearches"),
    loadErrorMessage: t("popoverLoadError"),
    items,
    isLoading,
    isError,
    isEmpty: hasOpened && !isLoading && !isError && items.length === 0,
    onOpen,
    onSelectSavedSearch,
    onAddSearchCriteria,
  };
}
