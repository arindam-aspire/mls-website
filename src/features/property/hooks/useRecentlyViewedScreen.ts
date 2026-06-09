"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { useToast } from "@/src/hooks/useToast";
import { mapRecentViewsListResponse } from "../mappers/recentViewsList.mapper";
import {
  useClearRecentViews,
  useGetRecentViewsList,
  useRemoveRecentView,
} from "../mutations/property.mutation";
import type { PaginationMeta, PropertyListing } from "../types/property.types";
import {
  normalizeRecentViewHashId,
  resolveRecentViewPropertyId,
} from "../utils/resolveRecentViewPropertyId";
import { usePropertyFavouriteToggle } from "./usePropertyFavouriteToggle";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 15, 20] as const;

function resolvePropertyListingTitle(
  item: PropertyListing,
  locale: AppLocale,
): string {
  const { title } = item;

  if (locale === "ar") {
    return title.ar || title.en;
  }

  if (locale === "es") {
    return title.esp || title.en;
  }

  if (locale === "fr") {
    return title.fr || title.en;
  }

  return title.en;
}

export function useRecentlyViewedScreen() {
  // 1. Router & navigation
  const router = useRouter();

  // 2. UI utilities
  const t = useTranslations("propertyList");
  const locale = useLocale() as AppLocale;
  const toast = useToast();

  const {
    withFavouriteFlags,
    withFavouriteLoading,
    toggleFavourite,
  } = usePropertyFavouriteToggle();

  // 4. Local state
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [listings, setListings] = useState<PropertyListing[] | null>(null);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | undefined>();
  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] =
    useState(false);
  const [deletingRecentViewId, setDeletingRecentViewId] = useState<string | null>(
    null,
  );
  const [pendingDeleteItem, setPendingDeleteItem] =
    useState<PropertyListing | null>(null);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // 5. Data fetching / queries
  const { mutate: getRecentViewsList, isPending: isLoadingRecentViews } =
    useGetRecentViewsList();
  const { mutate: clearRecentViews, isPending: isClearingRecentViews } =
    useClearRecentViews();
  const { mutate: removeRecentView, isPending: isRemovingRecentView } =
    useRemoveRecentView();

  const fetchRecentViews = useCallback(
    (nextPage: number, nextPageSize: number) => {
      getRecentViewsList(
        { page: nextPage, pageSize: nextPageSize },
        {
          onSuccess: (response) => {
            const mapped = mapRecentViewsListResponse(response);
            setListings(mapped.items);
            setPaginationMeta(mapped.meta);
          },
        },
      );
    },
    [getRecentViewsList],
  );

  // 6. Derived / memoized values
  const pageTitle = useMemo(() => t("recentlyViewed.pageTitle"), [t]);
  const pageSubtitle = useMemo(() => t("recentlyViewed.pageSubtitle"), [t]);
  const clearRecentViewsLabel = useMemo(
    () => t("recentlyViewed.clearRecentViews"),
    [t],
  );

  const displayListings = useMemo(() => {
    const items = withFavouriteLoading(withFavouriteFlags(listings ?? []));

    if (!deletingRecentViewId) {
      return items;
    }

    return items.map((item) => {
      if (resolveRecentViewPropertyId(item) !== deletingRecentViewId) {
        return item;
      }

      return { ...item, is_delete_loading: true };
    });
  }, [deletingRecentViewId, listings, withFavouriteFlags, withFavouriteLoading]);

  const pagination = useMemo(
    () => ({
      total: paginationMeta?.total ?? 0,
      page,
      pageSize,
      pageOptions: [...PAGE_SIZE_OPTIONS],
      totalPages: paginationMeta?.totalPages,
      hasNext: paginationMeta?.hasNext,
      hasPrevious: paginationMeta?.hasPrevious,
      maxPageButtons: 5,
      onPageChange: (nextPage: number) => setPage(nextPage),
      onPageSizeChange: (nextPageSize: number) => {
        setPage(1);
        setPageSize(nextPageSize);
      },
    }),
    [
      page,
      pageSize,
      paginationMeta?.hasNext,
      paginationMeta?.hasPrevious,
      paginationMeta?.total,
      paginationMeta?.totalPages,
    ],
  );

  const noDataFound = useMemo(
    () => ({
      title: t("recentlyViewed.noDataTitle"),
      description: t("recentlyViewed.noDataDescription"),
      actionLabel: t("recentlyViewed.noDataAction"),
    }),
    [t],
  );

  // 7. Callbacks
  const onBrowseProperties = useCallback(() => {
    router.push("/property-list");
  }, [router]);

  const openUpcomingFeature = useCallback(() => {
    setIsUpcomingFeatureModalOpen(true);
  }, []);

  const closeUpcomingFeature = useCallback(() => {
    setIsUpcomingFeatureModalOpen(false);
  }, []);

  const onClickProperty = useCallback(
    (item: PropertyListing) => {
      const url = getPathname({
        locale,
        href: `/propert-details/${item.id}`,
      });

      window.open(url, "_blank", "noopener,noreferrer");
    },
    [locale],
  );

  const onClickDelete = useCallback((item: PropertyListing) => {
    setPendingDeleteItem(item);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    if (isRemovingRecentView) {
      return;
    }

    setPendingDeleteItem(null);
  }, [isRemovingRecentView]);

  const confirmDelete = useCallback(() => {
    if (!pendingDeleteItem || isRemovingRecentView) {
      return;
    }

    const propertyHashId = resolveRecentViewPropertyId(pendingDeleteItem);

    if (!normalizeRecentViewHashId(propertyHashId)) {
      return;
    }

    setDeletingRecentViewId(propertyHashId);

    removeRecentView(propertyHashId, {
      onSuccess: (response) => {
        toast.success(t("recentlyViewed.deleteSuccessTitle"), {
          description:
            response.message ?? t("recentlyViewed.deleteSuccessDescription"),
        });
        setDeletingRecentViewId(null);
        setPendingDeleteItem(null);
        fetchRecentViews(page, pageSize);
      },
      onError: () => {
        setDeletingRecentViewId(null);
      },
    });
  }, [
    fetchRecentViews,
    isRemovingRecentView,
    page,
    pageSize,
    pendingDeleteItem,
    removeRecentView,
    t,
    toast,
  ]);

  const deleteConfirmModal = useMemo(
    () => ({
      open: pendingDeleteItem !== null,
      title: t("recentlyViewed.deleteConfirmTitle"),
      description: pendingDeleteItem
        ? t("recentlyViewed.deleteConfirmDescription", {
            title: resolvePropertyListingTitle(pendingDeleteItem, locale),
          })
        : "",
      confirmLabel: t("recentlyViewed.deleteLabel"),
      cancelLabel: t("recentlyViewed.cancelLabel"),
      deletingLabel: t("recentlyViewed.deletingLabel"),
      isLoading: isRemovingRecentView,
      onClose: closeDeleteConfirm,
      onConfirm: confirmDelete,
    }),
    [
      closeDeleteConfirm,
      confirmDelete,
      isRemovingRecentView,
      locale,
      pendingDeleteItem,
      t,
    ],
  );

  const onClearRecentViews = useCallback(() => {
    setIsClearConfirmOpen(true);
  }, []);

  const closeClearConfirm = useCallback(() => {
    if (isClearingRecentViews) {
      return;
    }

    setIsClearConfirmOpen(false);
  }, [isClearingRecentViews]);

  const confirmClearRecentViews = useCallback(() => {
    if (isClearingRecentViews) {
      return;
    }

    clearRecentViews(undefined, {
      onSuccess: (response) => {
        toast.success(t("recentlyViewed.clearSuccessTitle"), {
          description:
            response.message ?? t("recentlyViewed.clearSuccessDescription"),
        });
        setPage(DEFAULT_PAGE);
        setIsClearConfirmOpen(false);
        fetchRecentViews(DEFAULT_PAGE, pageSize);
      },
    });
  }, [clearRecentViews, fetchRecentViews, isClearingRecentViews, pageSize, t, toast]);

  const clearConfirmModal = useMemo(
    () => ({
      open: isClearConfirmOpen,
      title: t("recentlyViewed.clearConfirmTitle"),
      description: t("recentlyViewed.clearConfirmDescription"),
      confirmLabel: t("recentlyViewed.clearLabel"),
      cancelLabel: t("recentlyViewed.cancelLabel"),
      clearingLabel: t("recentlyViewed.clearingLabel"),
      isLoading: isClearingRecentViews,
      onClose: closeClearConfirm,
      onConfirm: confirmClearRecentViews,
    }),
    [
      closeClearConfirm,
      confirmClearRecentViews,
      isClearConfirmOpen,
      isClearingRecentViews,
      t,
    ],
  );

  const onClickEmail = useCallback(() => {
    openUpcomingFeature();
  }, [openUpcomingFeature]);

  const onClickCall = useCallback(() => {
    openUpcomingFeature();
  }, [openUpcomingFeature]);

  const onClickWhatsApp = useCallback(() => {
    openUpcomingFeature();
  }, [openUpcomingFeature]);

  // 9. Effects
  useEffect(() => {
    fetchRecentViews(page, pageSize);
  }, [fetchRecentViews, page, pageSize]);

  // 10. Return values
  return {
    listings: displayListings,
    pageTitle,
    pageSubtitle,
    clearRecentViewsLabel,
    isClearingRecentViews,
    onClearRecentViews,
    clearConfirmModal,
    isLoading: listings === null || isLoadingRecentViews,
    pagination,
    noDataFound,
    onBrowseProperties,
    onClickProperty,
    canViewDelete: true,
    onClickDelete,
    deleteConfirmModal,
    toggleFavourite,
    onClickEmail,
    onClickCall,
    onClickWhatsApp,
    upcomingFeatureModal: {
      open: isUpcomingFeatureModalOpen,
      onClose: closeUpcomingFeature,
    },
  };
}
