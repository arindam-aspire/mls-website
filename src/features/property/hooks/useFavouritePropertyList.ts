"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { getPathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { canTrackRecentPropertyView } from "@/src/features/auth/utils/shouldShowRecentlyViewedMenu";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useToast } from "@/src/hooks/useToast";
import { mapFavoriteListResponse } from "../mappers/favoriteList.mapper";
import { useGetFavoriteList, useRemoveFavorite } from "../mutations/property.mutation";
import type { PaginationMeta, PropertyListing } from "../types/property.types";
import { resolveFavoriteResourceId } from "../utils/resolveFavoriteResourceId";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 15, 20] as const;

export function useFavouritePropertyList() {
  // 1. Router & navigation
  const router = useRouter();

  // 2. UI utilities
  const t = useTranslations("propertyList.favourites");
  const locale = useLocale() as AppLocale;
  const toast = useToast();

  // 3. Global state (Zustand)
  const user = useAuthStore((state) => state.user);
  const loggedInUserRole = useAuthStore((state) => state.loggedInUserRole);

  // 4. Local state
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [listings, setListings] = useState<PropertyListing[] | null>(null);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | undefined>();
  const [removingFavoriteId, setRemovingFavoriteId] = useState<string | null>(null);
  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] = useState(false);

  // 5. Data fetching / queries
  const { mutate: getFavoriteList, isPending: isLoadingFavoriteList } =
    useGetFavoriteList();
  const { mutate: removeFavorite, isPending: isRemovingFavorite } = useRemoveFavorite();

  const fetchFavorites = useCallback(
    (nextPage: number, nextPageSize: number) => {
      getFavoriteList(
        { page: nextPage, pageSize: nextPageSize },
        {
          onSuccess: (response) => {
            const mapped = mapFavoriteListResponse(response);
            setListings(mapped.items);
            setPaginationMeta(mapped.meta);
          },
        },
      );
    },
    [getFavoriteList],
  );

  // 6. Derived / memoized values
  const pageTitle = useMemo(() => t("pageTitle"), [t]);
  const pageSubtitle = useMemo(() => t("pageSubtitle"), [t]);

  const cardButtonSize = useMemo(
    () =>
      canTrackRecentPropertyView(user, loggedInUserRole) ? ("md" as const) : ("sm" as const),
    [loggedInUserRole, user],
  );

  const displayListings = useMemo(() => {
    const items = listings ?? [];

    if (!removingFavoriteId) {
      return items;
    }

    return items.map((item) => {
      if (resolveFavoriteResourceId(item) !== removingFavoriteId) {
        return item;
      }

      return { ...item, is_favourite_loading: true };
    });
  }, [listings, removingFavoriteId]);

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
      title: t("noDataTitle"),
      description: t("noDataDescription"),
      actionLabel: t("noDataAction"),
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

  const toggleFavourite = useCallback(
    (item: PropertyListing) => {
      if (isRemovingFavorite) {
        return;
      }

      const propertyHash = resolveFavoriteResourceId(item);
      setRemovingFavoriteId(propertyHash);

      removeFavorite(propertyHash, {
        onSuccess: (response) => {
          toast.success(t("removeSuccessTitle"), {
            description: response.message ?? t("removeSuccessDescription"),
          });
          setRemovingFavoriteId(null);
          fetchFavorites(page, pageSize);
        },
        onError: () => {
          setRemovingFavoriteId(null);
        },
      });
    },
    [
      fetchFavorites,
      isRemovingFavorite,
      page,
      pageSize,
      removeFavorite,
      t,
      toast,
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
    fetchFavorites(page, pageSize);
  }, [fetchFavorites, page, pageSize]);

  // 10. Return values
  return {
    listings: displayListings,
    pageTitle,
    pageSubtitle,
    isLoading: listings === null || isLoadingFavoriteList,
    cardButtonSize,
    pagination,
    noDataFound,
    onBrowseProperties,
    onClickProperty,
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
