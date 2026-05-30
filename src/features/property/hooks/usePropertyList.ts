"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { getPathname, usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { useGetPropertyTaxonomy } from "@/src/features/landing/mutations/landing.mutation";
import { getPropertyCategories } from "@/src/features/landing/types/propertyTaxonomy.types";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "@/src/components/ui";
import { useGetPropertyList } from "../mutations/property.mutation";
import { usePropertyStore } from "../store/property.store";
import type { PropertyListParams, PropertyListing } from "../types/property.types";

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
  "budgetMin",
  "budgetMax",
  "furnitureStatus",
  "bedrooms",
  "bathrooms",
  "parking",
  "propertyAge",
  "minArea",
  "maxArea",
  "amenities",
] as const satisfies readonly (keyof PropertyListParams)[];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: low to high", value: "price_asc" },
  { label: "Price: high to low", value: "price_desc" },
] as const;

const PAGE_SIZE_OPTIONS = [10, 15, 20] as const;

const STATUS_OPTIONS = [
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
] as const;

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
    budgetMin: parseOptionalNumber(searchParams.get("budgetMin")),
    budgetMax: parseOptionalNumber(searchParams.get("budgetMax")),
    furnitureStatus: getOptionalString(searchParams.get("furnitureStatus")),
    bedrooms: parseOptionalNumber(searchParams.get("bedrooms")),
    bathrooms: parseOptionalNumber(searchParams.get("bathrooms")),
    parking: parseOptionalNumber(searchParams.get("parking")),
    propertyAge: getOptionalString(searchParams.get("propertyAge")),
    minArea: parseOptionalNumber(searchParams.get("minArea")),
    maxArea: parseOptionalNumber(searchParams.get("maxArea")),
    amenities: getOptionalString(searchParams.get("amenities")),
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
    propertyTaxonomy,
  } = usePropertyStore();

  // 4. Local state
  const [layoutVariant, setLayoutVariant] = useState<"grid" | "list">("grid");
  const [locationDraft, setLocationDraft] = useState(
    () => listParams.location ?? "",
  );

  // 5. Data fetching / queries
  const {
    mutate: getPropertyList,
    isPending: isLoadingPropertyList,
  } = useGetPropertyList();

  const { mutate: getPropertyTaxonomy, isPending: isLoadingTaxonomy } =
    useGetPropertyTaxonomy();

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

  const categories = useMemo(
    () => getPropertyCategories(propertyTaxonomy ?? undefined),
    [propertyTaxonomy],
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.slug,
        label: category.name,
      })),
    [categories],
  );

  const activeCategorySlug = useMemo(() => {
    if (categories.some((category) => category.slug === listParams.category)) {
      return listParams.category;
    }

    return categories[0]?.slug ?? "";
  }, [categories, listParams.category]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.slug === activeCategorySlug),
    [activeCategorySlug, categories],
  );

  const typeOptions = useMemo(
    () =>
      selectedCategory?.property_types.map((propertyType) => ({
        value: propertyType.slug,
        label: propertyType.name,
      })) ?? [],
    [selectedCategory],
  );

  const activeTypeValue = useMemo(() => {
    if (!listParams.type) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    if (typeOptions.some((option) => option.value === listParams.type)) {
      return listParams.type;
    }

    return SELECT_DROPDOWN_EMPTY_VALUE;
  }, [listParams.type, typeOptions]);

  const onStatusChange = useCallback(
    (status: string) => {
      updateSearchParams({ status, page: 1 });
    },
    [updateSearchParams],
  );

  const onCategoryChange = useCallback(
    (category: string) => {
      updateSearchParams({ category, type: "", page: 1 });
    },
    [updateSearchParams],
  );

  const onTypeChange = useCallback(
    (type: string) => {
      updateSearchParams({
        type: type === SELECT_DROPDOWN_EMPTY_VALUE ? "" : type,
        page: 1,
      });
    },
    [updateSearchParams],
  );

  const onLocationChange = useCallback((location: string) => {
    setLocationDraft(location);
  }, []);

  const onLocationCommit = useCallback(() => {
    const trimmedLocation = locationDraft.trim();

    if ((listParams.location ?? "") === trimmedLocation) {
      return;
    }

    updateSearchParams({ location: trimmedLocation, page: 1 });
  }, [listParams.location, locationDraft, updateSearchParams]);

  const onResetSearch = useCallback(() => {
    const params = new URLSearchParams();

    params.set("status", DEFAULT_SEARCH_PARAMS.status);
    params.set("category", DEFAULT_SEARCH_PARAMS.category);
    params.set("sort", DEFAULT_SEARCH_PARAMS.sort ?? DEFAULT_SORT);
    params.set("page", String(DEFAULT_SEARCH_PARAMS.page));
    params.set("pageSize", String(DEFAULT_SEARCH_PARAMS.pageSize));

    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router]);

  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] =
    useState(false);

  const openUpcomingFeature = useCallback(() => {
    setIsUpcomingFeatureModalOpen(true);
  }, []);

  const closeUpcomingFeature = useCallback(() => {
    setIsUpcomingFeatureModalOpen(false);
  }, []);

  const filters = useMemo(
    () => ({
      status: listParams.status || STATUS_OPTIONS[0].value,
      statusOptions: STATUS_OPTIONS.map((option) => ({ ...option })),
      onStatusChange,
      category: activeCategorySlug,
      categoryOptions,
      onCategoryChange,
      type: activeTypeValue,
      typeOptions,
      onTypeChange,
      location: locationDraft,
      onLocationChange,
      onLocationCommit,
      onResetSearch,
      onAdvanceSearch: openUpcomingFeature,
      onSaveSearch: openUpcomingFeature,
      disabled: isLoadingTaxonomy && propertyTaxonomy == null,
    }),
    [
      activeCategorySlug,
      activeTypeValue,
      categoryOptions,
      isLoadingTaxonomy,
      listParams.status,
      locationDraft,
      onCategoryChange,
      onLocationChange,
      onLocationCommit,
      onResetSearch,
      onStatusChange,
      onTypeChange,
      openUpcomingFeature,
      propertyTaxonomy,
      typeOptions,
    ],
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
    setLocationDraft(listParams.location ?? "");
  }, [listParams.location]);

  useEffect(() => {
    if (propertyTaxonomy == null) {
      getPropertyTaxonomy();
    }
  }, [getPropertyTaxonomy, propertyTaxonomy]);

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
  };
}
