"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { getPathname, usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { tokenStore } from "@/src/apis/core/token.store";
import { AUTH_VIEW } from "@/src/features/auth/authViews";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import type {
  SavedSearchCriteria,
  SaveSearchFilterItem,
} from "@/src/features/saved-searches/types/savedSearch.types";
import {
  useGetPropertyList,
} from "../mutations/property.mutation";
import { usePropertyFavouriteToggle } from "./usePropertyFavouriteToggle";
import { useGetSavedSearch } from "@/src/features/saved-searches/mutations/saved-search.mutation";
import { getSavedSearchById } from "@/src/features/saved-searches/services/saved-search.service";
import {
  buildSearchParamsFromSavedSearchRecord,
  needsSavedSearchUrlHydration,
  resolvePropertyListRequestParams,
} from "@/src/features/saved-searches/utils/savedSearchPropertyListParams";
import { usePropertyStore } from "../store/property.store";
import type { PropertyListParams, PropertyListing } from "../types/property.types";
import { normalizePropertyListing } from "../utils/normalizePropertyListingStatus";
import {
  DEFAULT_PROPERTY_LIST_PARAMS,
  DEFAULT_PROPERTY_LIST_SORT,
  parsePropertyListUrlParams,
} from "../utils/parsePropertyListUrlParams";
import { usePropertySearchFilters } from "./usePropertySearchFilters";
import { usePropertyContactModalActions } from "@/src/features/contact/hooks/usePropertyContactModalActions";

const DEFAULT_SORT = DEFAULT_PROPERTY_LIST_SORT;

const DEFAULT_SEARCH_PARAMS = DEFAULT_PROPERTY_LIST_PARAMS;

const LIST_PARAM_KEYS = [
  "page",
  "pageSize",
  "category",
  "status",
  "sort",
  "type",
  "location",
  "city",
  "locations",
  "budgetMin",
  "budgetMax",
  "furnitureStatus",
  "bedrooms",
  "rooms",
  "bathrooms",
  "parking",
  "propertyAge",
  "floorLevel",
  "minArea",
  "maxArea",
  "minPlotArea",
  "maxPlotArea",
  "governorate",
  "directorate",
  "village",
  "parcelName",
  "amenities",
  "similar_to",
  "savedSearchId",
] as const satisfies readonly (keyof PropertyListParams)[];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: low to high", value: "price_asc" },
  { label: "Price: high to low", value: "price_desc" },
] as const;

const PAGE_SIZE_OPTIONS = [10, 15, 20] as const;

function getListTitle(status: string) {
  if (status === "rent") {
    return "Properties for rent";
  }

  return "Properties for sale";
}

function setSearchParamValue(
  params: URLSearchParams,
  key: (typeof LIST_PARAM_KEYS)[number],
  value: PropertyListParams[(typeof LIST_PARAM_KEYS)[number]],
) {
  if (value === undefined || value === "") {
    params.delete(key);
    return;
  }

  params.set(key, String(value));
}

export function usePropertyList() {
  // 1. Router & navigation
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale() as AppLocale;

  // 2. UI utilities
  const {
    withFavouriteFlags,
    withFavouriteLoading,
    toggleFavourite,
  } = usePropertyFavouriteToggle();

  const listParams = useMemo(
    () => parsePropertyListUrlParams(searchParams),
    [searchParams],
  );

  const isHydratingSavedSearch = useMemo(
    () => needsSavedSearchUrlHydration(listParams),
    [listParams],
  );

  // 3. Global state (Zustand)
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);
  const {
    propertyListings,
    setPropertyListings,
    setPropertyListParams,
  } = usePropertyStore();

  // 4. Local state
  const [layoutVariant, setLayoutVariant] = useState<"grid" | "list">("grid");
  const [isSaveSearchModalOpen, setIsSaveSearchModalOpen] = useState(false);
  const [saveSearchFilterItems, setSaveSearchFilterItems] = useState<
    SaveSearchFilterItem[]
  >([]);
  const [saveSearchCriteria, setSaveSearchCriteria] = useState<SavedSearchCriteria>(
    {},
  );
  const [saveSearchModalSavedSearchId, setSaveSearchModalSavedSearchId] = useState<
    string | undefined
  >();
  /** Tracks guest vs authenticated so list refetches after `/auth/me` (or login). */
  const listAuthKeyRef = useRef<string | null>(null);

  // 5. Data fetching / queries
  const {
    mutate: getPropertyList,
    isPending: isLoadingPropertyList,
  } = useGetPropertyList();

  const { data: savedSearchDetail } = useGetSavedSearch(listParams.savedSearchId, {
    enabled: Boolean(listParams.savedSearchId),
  });

  const fetchProperties = useCallback(
    (params: PropertyListParams) => {
      setPropertyListParams(params);
      getPropertyList(params, {
        onSuccess: (response) => {
          const items = (response.data?.items ?? []).map((item) =>
            normalizePropertyListing(item),
          );
          setPropertyListings({
            items,
            meta: response.meta?.pagination,
          });
        },
      });
    },
    [getPropertyList, setPropertyListParams, setPropertyListings],
  );

  const updateSearchParams = useCallback(
    (partial: Partial<PropertyListParams>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const key of LIST_PARAM_KEYS) {
        const value = partial[key];

        if (value === undefined) {
          continue;
        }

        setSearchParamValue(params, key, value);
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const propertyListRequestParams = useMemo(
    () =>
      resolvePropertyListRequestParams(
        listParams,
        savedSearchDetail?.data ?? null,
      ),
    [listParams, savedSearchDetail?.data],
  );

  const propertyListRequestParamsRef = useRef(propertyListRequestParams);
  propertyListRequestParamsRef.current = propertyListRequestParams;

  // 6. Derived / memoized values
  const listings = useMemo(
    () =>
      withFavouriteLoading(
        withFavouriteFlags(propertyListings?.items ?? []),
      ),
    [propertyListings?.items, withFavouriteFlags, withFavouriteLoading],
  );

  const paginationMeta = propertyListings?.meta;

  const onResetSearch = useCallback(() => {
    const resetToDefaultSearch = () => {
      const params = new URLSearchParams();

      params.set("status", DEFAULT_SEARCH_PARAMS.status);
      params.set("category", DEFAULT_SEARCH_PARAMS.category);
      params.set("sort", DEFAULT_SEARCH_PARAMS.sort ?? DEFAULT_SORT);
      params.set("page", String(DEFAULT_SEARCH_PARAMS.page));
      params.set("pageSize", String(DEFAULT_SEARCH_PARAMS.pageSize));

      if (listParams.similar_to) {
        params.set("similar_to", listParams.similar_to);
      }

      router.replace(`${pathname}?${params.toString()}`);
    };

    if (!listParams.savedSearchId) {
      resetToDefaultSearch();
      return;
    }

    void (async () => {
      try {
        const response = await getSavedSearchById(listParams.savedSearchId!);
        const record = response.data;

        if (!record) {
          resetToDefaultSearch();
          return;
        }

        const params = buildSearchParamsFromSavedSearchRecord(record, {
          similarTo: listParams.similar_to,
        });

        router.replace(`${pathname}?${params.toString()}`);
      } catch {
        resetToDefaultSearch();
      }
    })();
  }, [listParams.savedSearchId, listParams.similar_to, pathname, router]);

  const { contactModal, onClickEmail, onClickCall, onClickWhatsApp } =
    usePropertyContactModalActions();

  const openSaveSearchModal = useCallback(() => {
    setIsSaveSearchModalOpen(true);
  }, []);

  const closeSaveSearchModal = useCallback(() => {
    setIsSaveSearchModalOpen(false);
    setSaveSearchModalSavedSearchId(undefined);
  }, []);

  const onSaveSearch = useCallback(
    (payload: {
      filterItems: SaveSearchFilterItem[];
      searchCriteria: SavedSearchCriteria;
    }) => {
      const { user: currentUser, isLoadingUser } = useAuthStore.getState();
      const hasAccessToken = Boolean(tokenStore.getAccessToken());
      const isAuthenticated =
        Boolean(currentUser) || (hasAccessToken && isLoadingUser);

      if (!isAuthenticated) {
        useAuthStore.getState().openAuth(AUTH_VIEW.chooseAccount);
        return;
      }

      setSaveSearchFilterItems(payload.filterItems);
      setSaveSearchCriteria(payload.searchCriteria);
      setSaveSearchModalSavedSearchId(listParams.savedSearchId);
      openSaveSearchModal();
    },
    [listParams.savedSearchId, openSaveSearchModal],
  );

  const filters = usePropertySearchFilters({
    filterParams: listParams,
    updateFilterParams: updateSearchParams,
    onResetSearch,
    onSaveSearch,
    savedSearchId: listParams.savedSearchId,
  });

  const listTitle = useMemo(
    () => getListTitle(listParams.status),
    [listParams.status],
  );

  const onSortChange = useCallback(
    (sort: string) => {
      updateSearchParams({ sort, page: 1 });
    },
    [updateSearchParams],
  );

  const toolbar = useMemo(
    () => ({
      listingsLabel: "Properties",
      sortOptions: SORT_OPTIONS.map((option) => ({ ...option })),
      sortValue: listParams.sort ?? DEFAULT_SORT,
      onSortChange,
      onViewChange: setLayoutVariant,
    }),
    [onSortChange, listParams.sort],
  );

  const pagination = useMemo(
    () => ({
      total: paginationMeta?.total ?? 0,
      page: listParams.page,
      pageSize: listParams.pageSize,
      pageOptions: [...PAGE_SIZE_OPTIONS],
      totalPages: paginationMeta?.totalPages,
      hasNext: paginationMeta?.hasNext,
      hasPrevious: paginationMeta?.hasPrevious,
      maxPageButtons: 5,
      onPageChange: (page: number) => updateSearchParams({ page }),
      onPageSizeChange: (pageSize: number) =>
        updateSearchParams({ page: 1, pageSize }),
    }),
    [
      paginationMeta?.hasNext,
      paginationMeta?.hasPrevious,
      paginationMeta?.total,
      paginationMeta?.totalPages,
      listParams.page,
      listParams.pageSize,
      updateSearchParams,
    ],
  );

  const noDataFound = useMemo(
    () => ({
      title: "No properties found",
      description: "Try adjusting your filters.",
    }),
    [],
  );

  // 7. Callbacks
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

  // 9. Effects
  useEffect(() => {
    if (!isHydratingSavedSearch) {
      return;
    }

    const savedSearchId = listParams.savedSearchId;

    if (!savedSearchId) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const response = await getSavedSearchById(savedSearchId);
        const record = response.data;

        if (cancelled || !record) {
          return;
        }

        const params = buildSearchParamsFromSavedSearchRecord(record, {
          similarTo: listParams.similar_to,
        });

        router.replace(`${pathname}?${params.toString()}`);
      } catch {
        if (!cancelled) {
          const params = new URLSearchParams();

          params.set("status", DEFAULT_SEARCH_PARAMS.status);
          params.set("category", DEFAULT_SEARCH_PARAMS.category);
          params.set("sort", DEFAULT_SEARCH_PARAMS.sort ?? DEFAULT_SORT);
          params.set("page", String(DEFAULT_SEARCH_PARAMS.page));
          params.set("pageSize", String(DEFAULT_SEARCH_PARAMS.pageSize));
          params.set("savedSearchId", savedSearchId);

          if (listParams.similar_to) {
            params.set("similar_to", listParams.similar_to);
          }

          router.replace(`${pathname}?${params.toString()}`);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isHydratingSavedSearch,
    listParams.savedSearchId,
    listParams.similar_to,
    pathname,
    router,
  ]);

  useEffect(() => {
    if (isHydratingSavedSearch) {
      return;
    }

    fetchProperties(propertyListRequestParams);
  }, [fetchProperties, isHydratingSavedSearch, propertyListRequestParams]);

  // After AuthProvider `/auth/me` (token + user), refetch list so agent/owner/actions hydrate.
  useEffect(() => {
    if (isHydratingSavedSearch || isLoadingUser) {
      return;
    }

    const hasAccessToken = Boolean(tokenStore.getAccessToken());
    const nextAuthKey =
      hasAccessToken && user ? `auth:${user.id}` : "guest";
    const previousAuthKey = listAuthKeyRef.current;

    if (previousAuthKey === nextAuthKey) {
      return;
    }

    listAuthKeyRef.current = nextAuthKey;

    // Guest boot: base params effect already fetched without auth.
    if (nextAuthKey === "guest" && previousAuthKey == null) {
      return;
    }

    // Token + me settled (or login / logout while on this page) → reload list.
    if (nextAuthKey.startsWith("auth:") || previousAuthKey?.startsWith("auth:")) {
      fetchProperties(propertyListRequestParamsRef.current);
    }
  }, [fetchProperties, isHydratingSavedSearch, isLoadingUser, user]);

  // 10. Return values
  return {
    listings,
    layoutVariant,
    listTitle,
    isLoading:
      isHydratingSavedSearch ||
      propertyListings === null ||
      isLoadingPropertyList,
    filters,
    toolbar,
    pagination,
    noDataFound,
    onClickProperty,
    toggleFavourite,
    onClickEmail,
    onClickCall,
    onClickWhatsApp,
    contactModal,
    saveSearchModal: {
      open: isSaveSearchModalOpen,
      onClose: closeSaveSearchModal,
      filterItems: saveSearchFilterItems,
      searchCriteria: saveSearchCriteria,
      savedSearchId: saveSearchModalSavedSearchId,
      initialName:
        saveSearchModalSavedSearchId != null
          ? (savedSearchDetail?.data?.name ?? "")
          : "",
    },
  };
}
