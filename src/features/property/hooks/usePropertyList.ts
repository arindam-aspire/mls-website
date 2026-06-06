"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { getPathname, usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import {
  getInitialBudgetMax,
  getInitialBudgetMin,
} from "@/src/components/search";
import { tokenStore } from "@/src/apis/core/token.store";
import { AUTH_VIEW } from "@/src/features/auth/authViews";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import type {
  SavedSearchCriteria,
  SaveSearchFilterItem,
} from "@/src/features/saved-searches/types/savedSearch.types";
import { useGetPropertyList } from "../mutations/property.mutation";
import { useGetSavedSearch } from "@/src/features/saved-searches/mutations/saved-search.mutation";
import { getSavedSearchById } from "@/src/features/saved-searches/services/saved-search.service";
import { buildSavedSearchPropertyListSearchParams } from "@/src/features/saved-searches/utils/buildSavedSearchPropertyListHref";
import { usePropertyStore } from "../store/property.store";
import type { PropertyListParams, PropertyListing } from "../types/property.types";
import { normalizeAmenitiesParam } from "../components/propertyListAdvancedFilters.constants";
import { usePropertySearchFilters } from "./usePropertySearchFilters";

const DEFAULT_SORT = "newest";

const DEFAULT_SEARCH_PARAMS: PropertyListParams = {
  page: 1,
  pageSize: 10,
  category: "residential",
  status: "buy",
  sort: DEFAULT_SORT,
};

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

function getOptionalString(value: string | null) {
  return value || undefined;
}

function parseOptionalNumber(value: string | null) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseUrlListParams(searchParams: URLSearchParams): PropertyListParams {
  return {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
    category: searchParams.get("category") || "",
    status: searchParams.get("status") || "",
    sort: searchParams.get("sort") || DEFAULT_SORT,
    type: getOptionalString(searchParams.get("type")),
    location: getOptionalString(searchParams.get("location")),
    city: getOptionalString(searchParams.get("city")),
    locations: getOptionalString(searchParams.get("locations")),
    budgetMin: parseOptionalNumber(getInitialBudgetMin(searchParams) || null),
    budgetMax: parseOptionalNumber(getInitialBudgetMax(searchParams) || null),
    furnitureStatus: getOptionalString(searchParams.get("furnitureStatus")),
    bedrooms: parseOptionalNumber(searchParams.get("bedrooms")),
    rooms: parseOptionalNumber(searchParams.get("rooms")),
    bathrooms: parseOptionalNumber(searchParams.get("bathrooms")),
    parking: parseOptionalNumber(searchParams.get("parking")),
    propertyAge: getOptionalString(searchParams.get("propertyAge")),
    floorLevel: getOptionalString(searchParams.get("floorLevel")),
    minArea: parseOptionalNumber(searchParams.get("minArea")),
    maxArea: parseOptionalNumber(searchParams.get("maxArea")),
    minPlotArea: parseOptionalNumber(searchParams.get("minPlotArea")),
    maxPlotArea: parseOptionalNumber(searchParams.get("maxPlotArea")),
    governorate: getOptionalString(searchParams.get("governorate")),
    directorate: getOptionalString(searchParams.get("directorate")),
    village: getOptionalString(searchParams.get("village")),
    parcelName: getOptionalString(searchParams.get("parcelName")),
    amenities: normalizeAmenitiesParam(getOptionalString(searchParams.get("amenities"))),
    similar_to: getOptionalString(searchParams.get("similar_to")),
    savedSearchId: getOptionalString(searchParams.get("savedSearchId")),
  };
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

  const listParams = useMemo(
    () => parseUrlListParams(searchParams),
    [searchParams],
  );

  // 3. Global state (Zustand)
  const {
    propertyListings,
    setPropertyListings,
    setPropertyListParams,
  } = usePropertyStore();

  // 4. Local state
  const [layoutVariant, setLayoutVariant] = useState<"grid" | "list">("grid");
  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] =
    useState(false);
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
          setPropertyListings({
            items: response.data?.items ?? [],
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

  // 6. Derived / memoized values
  const listings = useMemo(
    () => propertyListings?.items ?? [],
    [propertyListings?.items],
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

        const params = new URLSearchParams(
          buildSavedSearchPropertyListSearchParams(record),
        );

        if (listParams.similar_to) {
          params.set("similar_to", listParams.similar_to);
        }

        router.replace(`${pathname}?${params.toString()}`);
      } catch {
        resetToDefaultSearch();
      }
    })();
  }, [listParams.savedSearchId, listParams.similar_to, pathname, router]);

  const openUpcomingFeature = useCallback(() => {
    setIsUpcomingFeatureModalOpen(true);
  }, []);

  const closeUpcomingFeature = useCallback(() => {
    setIsUpcomingFeatureModalOpen(false);
  }, []);

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
      setIsUpcomingFeatureModalOpen(false);

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

  const toggleFavourite = useCallback(() => {
    openUpcomingFeature();
  }, [openUpcomingFeature]);

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
    fetchProperties(listParams);
  }, [fetchProperties, listParams]);

  // 10. Return values
  return {
    listings,
    layoutVariant,
    listTitle,
    isLoading: propertyListings === null || isLoadingPropertyList,
    filters,
    toolbar,
    pagination,
    noDataFound,
    onClickProperty,
    toggleFavourite,
    onClickEmail,
    onClickCall,
    onClickWhatsApp,
    upcomingFeatureModal: {
      open: isUpcomingFeatureModalOpen,
      onClose: closeUpcomingFeature,
    },
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
